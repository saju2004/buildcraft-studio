package com.buildcraftstudio.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AIArchitectService {

    public Map<String, Object> planHouse(String prompt, Double plotWidth, Double plotLength, Integer requestedFloors) {
        if (plotWidth == null || plotWidth <= 0) plotWidth = 15.0; // ~50 ft
        if (plotLength == null || plotLength <= 0) plotLength = 20.0; // ~65 ft
        if (requestedFloors == null || requestedFloors <= 0) requestedFloors = 2;

        String lowerPrompt = (prompt != null ? prompt.toLowerCase() : "");

        // Determine bedrooms count from prompt (default 3 or 4)
        int bedrooms = 3;
        if (lowerPrompt.contains("4 bedroom") || lowerPrompt.contains("four bedroom") || lowerPrompt.contains("4bhk")) {
            bedrooms = 4;
        } else if (lowerPrompt.contains("2 bedroom") || lowerPrompt.contains("two bedroom") || lowerPrompt.contains("2bhk")) {
            bedrooms = 2;
        } else if (lowerPrompt.contains("5 bedroom") || lowerPrompt.contains("five bedroom") || lowerPrompt.contains("5bhk")) {
            bedrooms = 5;
        }

        boolean hasParking = lowerPrompt.contains("park") || lowerPrompt.contains("garage") || lowerPrompt.contains("car");
        boolean hasGarden = lowerPrompt.contains("garden") || lowerPrompt.contains("lawn") || lowerPrompt.contains("landscape");
        boolean isModern = lowerPrompt.contains("modern") || lowerPrompt.contains("contemporary") || lowerPrompt.contains("minimal");

        // Setbacks based on plot size
        double frontSetback = hasParking ? 4.0 : 3.0;
        double rearSetback = 2.5;
        double sideSetback = 1.5;

        double buildableWidth = plotWidth - (sideSetback * 2);
        double buildableLength = plotLength - frontSetback - rearSetback;

        // Origin of building in plot
        double ox = sideSetback;
        double oy = frontSetback;
        double bw = Math.min(buildableWidth, 12.0); // max sensible house width
        double bl = Math.min(buildableLength, 10.0); // max sensible house length

        // Structured JSON proposal
        List<Map<String, Object>> proposedRooms = new ArrayList<>();
        List<Map<String, Object>> proposedWalls = new ArrayList<>();
        List<Map<String, Object>> proposedDoors = new ArrayList<>();
        List<Map<String, Object>> proposedWindows = new ArrayList<>();
        List<Map<String, Object>> proposedColumns = new ArrayList<>();

        // 1. Exterior Walls
        proposedWalls.add(createWall("w-ai-1", "lvl-ground", ox, oy, ox + bw, oy, 0.23, 3.0, "EXTERIOR"));
        proposedWalls.add(createWall("w-ai-2", "lvl-ground", ox + bw, oy, ox + bw, oy + bl, 0.23, 3.0, "EXTERIOR"));
        proposedWalls.add(createWall("w-ai-3", "lvl-ground", ox + bw, oy + bl, ox, oy + bl, 0.23, 3.0, "EXTERIOR"));
        proposedWalls.add(createWall("w-ai-4", "lvl-ground", ox, oy + bl, ox, oy, 0.23, 3.0, "EXTERIOR"));

        // 2. Interior Walls & Room Partitioning
        double livingWidth = bw * 0.55;
        proposedWalls.add(createWall("w-ai-5", "lvl-ground", ox + livingWidth, oy, ox + livingWidth, oy + bl, 0.15, 3.0, "INTERIOR"));
        proposedWalls.add(createWall("w-ai-6", "lvl-ground", ox + livingWidth, oy + (bl * 0.5), ox + bw, oy + (bl * 0.5), 0.15, 3.0, "INTERIOR"));
        proposedWalls.add(createWall("w-ai-7", "lvl-ground", ox, oy + (bl * 0.6), ox + livingWidth, oy + (bl * 0.6), 0.15, 3.0, "INTERIOR"));

        // 3. Rooms
        proposedRooms.add(createRoom("rm-ai-1", "Formal Living & Dining Room", "LIVING", livingWidth * (bl * 0.6), "#38bdf8", ox + (livingWidth * 0.5), oy + (bl * 0.3)));
        proposedRooms.add(createRoom("rm-ai-2", "Modular Kitchen & Utility", "KITCHEN", livingWidth * (bl * 0.4), "#fbbf24", ox + (livingWidth * 0.5), oy + (bl * 0.8)));
        proposedRooms.add(createRoom("rm-ai-3", "Master Bedroom (Ensuite)", "BEDROOM", (bw - livingWidth) * (bl * 0.5), "#f472b6", ox + livingWidth + ((bw - livingWidth) * 0.5), oy + (bl * 0.25)));
        proposedRooms.add(createRoom("rm-ai-4", "Guest Bedroom / Study", "BEDROOM", (bw - livingWidth) * (bl * 0.5), "#a78bfa", ox + livingWidth + ((bw - livingWidth) * 0.5), oy + (bl * 0.75)));

        // 4. Openings
        proposedDoors.add(createDoor("d-ai-1", "w-ai-1", 1.8, 1.1, 2.2, "MAIN_ENTRANCE"));
        proposedDoors.add(createDoor("d-ai-2", "w-ai-5", 1.5, 0.9, 2.1, "INTERNAL"));
        proposedDoors.add(createDoor("d-ai-3", "w-ai-6", 1.2, 0.9, 2.1, "INTERNAL"));
        proposedDoors.add(createDoor("d-ai-4", "w-ai-7", 1.2, 0.8, 2.1, "INTERNAL"));

        proposedWindows.add(createWindow("win-ai-1", "w-ai-1", livingWidth * 0.6, 1.8, 1.4, 0.8, "SLIDING"));
        proposedWindows.add(createWindow("win-ai-2", "w-ai-2", 2.0, 1.5, 1.4, 0.8, "CASEMENT"));
        proposedWindows.add(createWindow("win-ai-3", "w-ai-3", 2.5, 1.5, 1.4, 0.8, "CASEMENT"));
        proposedWindows.add(createWindow("win-ai-4", "w-ai-4", 3.0, 1.8, 1.4, 0.8, "SLIDING"));

        // 5. Structural Columns at Grid Intersections
        double[] xCols = new double[]{ox, ox + livingWidth, ox + bw};
        double[] yCols = new double[]{oy, oy + (bl * 0.5), oy + bl};
        int colIdx = 1;
        for (double cx : xCols) {
            for (double cy : yCols) {
                Map<String, Object> col = new HashMap<>();
                col.put("id", "col-ai-" + colIdx++);
                col.put("levelId", "lvl-ground");
                col.put("x", cx);
                col.put("y", cy);
                col.put("width", 0.3);
                col.put("depth", 0.3);
                col.put("height", 3.0);
                proposedColumns.add(col);
            }
        }

        // Summary Statistics
        double groundFootprintArea = bw * bl;
        double totalFloorArea = groundFootprintArea * requestedFloors;
        double plotArea = plotWidth * plotLength;
        double groundCoveragePct = Math.round((groundFootprintArea / plotArea) * 1000.0) / 10.0;

        Map<String, Object> response = new HashMap<>();
        response.put("proposalId", UUID.randomUUID().toString());
        response.put("title", "AI Generated " + bedrooms + "-Bedroom Architectural Concept");
        response.put("rationale", "Layout optimizes natural daylighting and cross-ventilation. Public living zones positioned towards front road orientation with private sleeping quarters buffered at rear. Front setback preserves driveway and optional parking.");
        response.put("designSummary", Map.of(
                "bedrooms", bedrooms,
                "floors", requestedFloors,
                "groundFootprintArea", groundFootprintArea,
                "totalEstimatedArea", totalFloorArea,
                "groundCoveragePct", groundCoveragePct,
                "frontSetback", frontSetback,
                "hasParkingZone", hasParking,
                "hasGardenZone", hasGarden
        ));

        Map<String, Object> generatedScene = new HashMap<>();
        generatedScene.put("plot", Map.of("width", plotWidth, "length", plotLength, "setbackFront", frontSetback, "setbackRear", rearSetback, "setbackLeft", sideSetback, "setbackRight", sideSetback));
        generatedScene.put("walls", proposedWalls);
        generatedScene.put("doors", proposedDoors);
        generatedScene.put("windows", proposedWindows);
        generatedScene.put("columns", proposedColumns);
        generatedScene.put("rooms", proposedRooms);

        response.put("proposedScene", generatedScene);
        response.put("requiresApproval", true);

        return response;
    }

    private Map<String, Object> createWall(String id, String levelId, double sx, double sy, double ex, double ey, double thick, double h, String type) {
        Map<String, Object> w = new HashMap<>();
        w.put("id", id);
        w.put("levelId", levelId);
        w.put("startX", sx);
        w.put("startY", sy);
        w.put("endX", ex);
        w.put("endY", ey);
        w.put("thickness", thick);
        w.put("height", h);
        w.put("wallType", type);
        w.put("material", "BRICK");
        w.put("color", "EXTERIOR".equals(type) ? "#d97706" : "#94a3b8");
        return w;
    }

    private Map<String, Object> createRoom(String id, String name, String type, double area, String color, double cx, double cy) {
        Map<String, Object> r = new HashMap<>();
        r.put("id", id);
        r.put("name", name);
        r.put("type", type);
        r.put("area", Math.round(area * 10.0) / 10.0);
        r.put("perimeter", Math.round(Math.sqrt(area) * 4 * 10.0) / 10.0);
        r.put("color", color);
        r.put("centerX", Math.round(cx * 10.0) / 10.0);
        r.put("centerY", Math.round(cy * 10.0) / 10.0);
        return r;
    }

    private Map<String, Object> createDoor(String id, String wallId, double offset, double w, double h, String type) {
        Map<String, Object> d = new HashMap<>();
        d.put("id", id);
        d.put("wallId", wallId);
        d.put("offset", offset);
        d.put("width", w);
        d.put("height", h);
        d.put("type", type);
        d.put("flip", false);
        return d;
    }

    private Map<String, Object> createWindow(String id, String wallId, double offset, double w, double h, double elev, String type) {
        Map<String, Object> win = new HashMap<>();
        win.put("id", id);
        win.put("wallId", wallId);
        win.put("offset", offset);
        win.put("width", w);
        win.put("height", h);
        win.put("elevation", elev);
        win.put("type", type);
        return win;
    }
}
