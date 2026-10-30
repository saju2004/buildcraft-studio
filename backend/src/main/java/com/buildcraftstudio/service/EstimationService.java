package com.buildcraftstudio.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EstimationService {

    public Map<String, Object> calculateEstimate(Map<String, Object> projectData, String currency, Map<String, Double> customRates) {
        if (currency == null || currency.isBlank()) currency = "USD";
        if (customRates == null) customRates = new HashMap<>();

        // Default rates per unit (editable by user)
        double rateConcreteM3 = customRates.getOrDefault("concreteM3", 120.0);
        double rateSteelKg = customRates.getOrDefault("steelKg", 1.25);
        double rateBrickPcs = customRates.getOrDefault("brickPcs", 0.45);
        double rateTileM2 = customRates.getOrDefault("tileM2", 28.0);
        double ratePaintM2 = customRates.getOrDefault("paintM2", 4.5);
        double ratePlasterM2 = customRates.getOrDefault("plasterM2", 7.0);
        double rateLabourPercent = customRates.getOrDefault("labourPercent", 35.0);
        double rateContingencyPercent = customRates.getOrDefault("contingencyPercent", 5.0);

        // Extract walls, columns, rooms from projectData
        List<Map<String, Object>> walls = (List<Map<String, Object>>) projectData.getOrDefault("walls", Collections.emptyList());
        List<Map<String, Object>> columns = (List<Map<String, Object>>) projectData.getOrDefault("columns", Collections.emptyList());
        List<Map<String, Object>> rooms = (List<Map<String, Object>>) projectData.getOrDefault("rooms", Collections.emptyList());

        // 1. Calculate Wall Masonry & Plaster/Paint Area
        double totalWallVolumeM3 = 0.0;
        double totalWallSurfaceAreaM2 = 0.0;
        double totalWallLengthM = 0.0;

        for (Map<String, Object> w : walls) {
            double sx = getDouble(w.get("startX"));
            double sy = getDouble(w.get("startY"));
            double ex = getDouble(w.get("endX"));
            double ey = getDouble(w.get("endY"));
            double thick = getDouble(w.getOrDefault("thickness", 0.23));
            double height = getDouble(w.getOrDefault("height", 3.0));

            double length = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
            totalWallLengthM += length;
            double vol = length * thick * height;
            totalWallVolumeM3 += vol;
            totalWallSurfaceAreaM2 += (length * height * 2.0); // both faces
        }

        // Standard brick calculation: ~500 bricks per m3 with mortar allowance
        long estimatedBricks = Math.round(totalWallVolumeM3 * 500.0);

        // 2. Calculate Column & Footing Concrete Volume
        double totalColumnConcreteM3 = 0.0;
        double totalFootingConcreteM3 = 0.0;
        for (Map<String, Object> c : columns) {
            double cw = getDouble(c.getOrDefault("width", 0.3));
            double cd = getDouble(c.getOrDefault("depth", 0.3));
            double ch = getDouble(c.getOrDefault("height", 3.0));
            double colVol = cw * cd * ch;
            totalColumnConcreteM3 += colVol;
            // Conceptual isolated footing per column: 1.2m x 1.2m x 0.45m
            totalFootingConcreteM3 += (1.2 * 1.2 * 0.45);
        }

        // 3. Calculate Slab Concrete Volume & Floor Area
        double totalFloorAreaM2 = 0.0;
        for (Map<String, Object> r : rooms) {
            totalFloorAreaM2 += getDouble(r.getOrDefault("area", 0.0));
        }
        if (totalFloorAreaM2 <= 0 && walls.size() >= 4) {
            totalFloorAreaM2 = 80.0; // fallback reasonable floor area
        }
        double totalSlabConcreteM3 = totalFloorAreaM2 * 0.15; // 150mm slab

        // Total Concrete Volume
        double totalConcreteM3 = Math.round((totalColumnConcreteM3 + totalFootingConcreteM3 + totalSlabConcreteM3) * 100.0) / 100.0;

        // 4. Steel Reinforcement Estimation:
        // Columns: ~160 kg/m3 of concrete
        // Slabs: ~90 kg/m3 of concrete
        // Footings: ~80 kg/m3 of concrete
        double steelColumnKg = totalColumnConcreteM3 * 160.0;
        double steelSlabKg = totalSlabConcreteM3 * 90.0;
        double steelFootingKg = totalFootingConcreteM3 * 80.0;
        double totalSteelKg = Math.round((steelColumnKg + steelSlabKg + steelFootingKg) * 10.0) / 10.0;

        // 5. Flooring Tiles and Painting Area
        double totalTileAreaM2 = totalFloorAreaM2 * 1.10; // 10% cutting waste
        double totalPaintingAreaM2 = totalWallSurfaceAreaM2 * 1.05; // walls + ceiling allowance

        // 6. Cost Line Items (BOQ)
        List<Map<String, Object>> boqItems = new ArrayList<>();
        double totalMaterialCost = 0.0;

        // Concrete item
        double costConcrete = totalConcreteM3 * rateConcreteM3;
        totalMaterialCost += costConcrete;
        boqItems.add(createBOQItem("CONC-01", "Ready Mix Concrete (Grade M25)", "Structural members, footings & slabs", totalConcreteM3, "m³", rateConcreteM3, costConcrete));

        // Steel item
        double costSteel = totalSteelKg * rateSteelKg;
        totalMaterialCost += costSteel;
        boqItems.add(createBOQItem("STL-01", "TMT High-Yield Rebar (Fe500)", "Longitudinal & tie reinforcement", totalSteelKg, "kg", rateSteelKg, costSteel));

        // Brick masonry item
        double costBricks = estimatedBricks * rateBrickPcs;
        totalMaterialCost += costBricks;
        boqItems.add(createBOQItem("MSN-01", "Clay / Fly-Ash Bricks", "Exterior & interior load-bearing masonry", (double) estimatedBricks, "pcs", rateBrickPcs, costBricks));

        // Flooring tiles item
        double costTiles = totalTileAreaM2 * rateTileM2;
        totalMaterialCost += costTiles;
        boqItems.add(createBOQItem("FIN-01", "Vitrified Floor Tiles", "Living, bedrooms, and kitchen floors", totalTileAreaM2, "m²", rateTileM2, costTiles));

        // Plastering item
        double costPlaster = totalWallSurfaceAreaM2 * ratePlasterM2;
        totalMaterialCost += costPlaster;
        boqItems.add(createBOQItem("FIN-02", "Cement Sand Plastering (12mm)", "Internal & external wall plastering", totalWallSurfaceAreaM2, "m²", ratePlasterM2, costPlaster));

        // Painting item
        double costPaint = totalPaintingAreaM2 * ratePaintM2;
        totalMaterialCost += costPaint;
        boqItems.add(createBOQItem("FIN-03", "Premium Emulsion Paint", "Two-coat finish over primer", totalPaintingAreaM2, "m²", ratePaintM2, costPaint));

        // Labour and Contingency
        double labourCost = Math.round((totalMaterialCost * (rateLabourPercent / 100.0)) * 100.0) / 100.0;
        double subtotal = totalMaterialCost + labourCost;
        double contingencyCost = Math.round((subtotal * (rateContingencyPercent / 100.0)) * 100.0) / 100.0;
        double grandTotal = Math.round((subtotal + contingencyCost) * 100.0) / 100.0;

        Map<String, Object> result = new HashMap<>();
        result.put("currency", currency);
        result.put("quantities", Map.of(
                "totalFloorAreaM2", totalFloorAreaM2,
                "totalWallLengthM", Math.round(totalWallLengthM * 100.0) / 100.0,
                "totalConcreteM3", totalConcreteM3,
                "totalSteelKg", totalSteelKg,
                "totalSteelTons", Math.round((totalSteelKg / 1000.0) * 100.0) / 100.0,
                "estimatedBricks", estimatedBricks,
                "totalTileAreaM2", Math.round(totalTileAreaM2 * 100.0) / 100.0,
                "totalPaintingAreaM2", Math.round(totalPaintingAreaM2 * 100.0) / 100.0
        ));
        result.put("boqItems", boqItems);
        result.put("costSummary", Map.of(
                "materialCost", Math.round(totalMaterialCost * 100.0) / 100.0,
                "labourCost", labourCost,
                "contingencyCost", contingencyCost,
                "grandTotal", grandTotal,
                "costPerSqMeter", totalFloorAreaM2 > 0 ? Math.round((grandTotal / totalFloorAreaM2) * 100.0) / 100.0 : 0
        ));
        result.put("disclaimer", "Preliminary estimate for engineering concept & budgeting. Structural quantities subject to site soil tests and code-certified structural analysis.");

        return result;
    }

    private Map<String, Object> createBOQItem(String code, String name, String desc, double qty, String unit, double unitPrice, double total) {
        Map<String, Object> item = new HashMap<>();
        item.put("code", code);
        item.put("name", name);
        item.put("description", desc);
        item.put("quantity", Math.round(qty * 100.0) / 100.0);
        item.put("unit", unit);
        item.put("unitPrice", unitPrice);
        item.put("totalPrice", Math.round(total * 100.0) / 100.0);
        return item;
    }

    private double getDouble(Object val) {
        if (val instanceof Number) return ((Number) val).doubleValue();
        if (val instanceof String) {
            try { return Double.parseDouble((String) val); } catch (Exception ignored) {}
        }
        return 0.0;
    }
}
