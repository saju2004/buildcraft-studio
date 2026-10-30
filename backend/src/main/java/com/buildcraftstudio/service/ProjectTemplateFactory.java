package com.buildcraftstudio.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProjectTemplateFactory {

    public String generateTemplateJson(String templateType, Double plotWidth, Double plotLength, Integer floorCount) {
        if (plotWidth == null || plotWidth <= 0) plotWidth = 15.0;
        if (plotLength == null || plotLength <= 0) plotLength = 20.0;
        if (floorCount == null || floorCount <= 0) floorCount = 1;

        if ("MODERN_TWO_STOREY".equalsIgnoreCase(templateType)) {
            return generateModernTwoStoreyTemplate(plotWidth, plotLength);
        } else if ("VILLA".equalsIgnoreCase(templateType)) {
            return generateVillaTemplate(plotWidth, plotLength);
        } else if ("SMALL_HOUSE".equalsIgnoreCase(templateType) || "RESIDENTIAL_SMALL".equalsIgnoreCase(templateType)) {
            return generateSmallHouseTemplate(plotWidth, plotLength);
        } else {
            return generateEmptyTemplate(plotWidth, plotLength, floorCount);
        }
    }

    private String generateEmptyTemplate(Double w, Double l, Integer floors) {
        return "{\n" +
                "  \"plot\": {\"width\": " + w + ", \"length\": " + l + ", \"setbackFront\": 3.0, \"setbackRear\": 2.0, \"setbackLeft\": 1.5, \"setbackRight\": 1.5},\n" +
                "  \"levels\": [\n" +
                "    {\"id\": \"lvl-ground\", \"name\": \"Ground Floor\", \"floorIndex\": 0, \"elevation\": 0.0, \"height\": 3.0, \"slabThickness\": 0.15}\n" +
                (floors > 1 ? "    ,{\"id\": \"lvl-first\", \"name\": \"First Floor\", \"floorIndex\": 1, \"elevation\": 3.0, \"height\": 3.0, \"slabThickness\": 0.15}\n" : "") +
                "  ],\n" +
                "  \"activeLevelId\": \"lvl-ground\",\n" +
                "  \"layers\": [\n" +
                "    {\"id\": \"layer-arch\", \"name\": \"Architecture\", \"color\": \"#60a5fa\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-struct\", \"name\": \"Structure\", \"color\": \"#f59e0b\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-dim\", \"name\": \"Dimensions\", \"color\": \"#34d399\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-furn\", \"name\": \"Furniture\", \"color\": \"#a78bfa\", \"visible\": true, \"locked\": false}\n" +
                "  ],\n" +
                "  \"walls\": [],\n" +
                "  \"doors\": [],\n" +
                "  \"windows\": [],\n" +
                "  \"columns\": [],\n" +
                "  \"rooms\": [],\n" +
                "  \"dimensions\": [],\n" +
                "  \"furniture\": []\n" +
                "}";
    }

    public String generateSmallHouseTemplate(Double w, Double l) {
        // 9m x 7m footprint placed inside plot
        double ox = (w - 9.0) / 2.0;
        double oy = (l - 7.0) / 2.0;
        if (ox < 1.0) ox = 1.0;
        if (oy < 1.0) oy = 1.0;

        return "{\n" +
                "  \"plot\": {\"width\": " + w + ", \"length\": " + l + ", \"setbackFront\": 3.0, \"setbackRear\": 2.0, \"setbackLeft\": 1.5, \"setbackRight\": 1.5},\n" +
                "  \"levels\": [\n" +
                "    {\"id\": \"lvl-ground\", \"name\": \"Ground Floor\", \"floorIndex\": 0, \"elevation\": 0.0, \"height\": 3.0, \"slabThickness\": 0.15}\n" +
                "  ],\n" +
                "  \"activeLevelId\": \"lvl-ground\",\n" +
                "  \"layers\": [\n" +
                "    {\"id\": \"layer-arch\", \"name\": \"Architecture\", \"color\": \"#60a5fa\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-struct\", \"name\": \"Structure\", \"color\": \"#f59e0b\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-dim\", \"name\": \"Dimensions\", \"color\": \"#34d399\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-furn\", \"name\": \"Furniture\", \"color\": \"#a78bfa\", \"visible\": true, \"locked\": false}\n" +
                "  ],\n" +
                "  \"walls\": [\n" +
                // Outer perimeter walls: (ox, oy) to (ox+9, oy) to (ox+9, oy+7) to (ox, oy+7) to (ox, oy)
                "    {\"id\": \"w-1\", \"levelId\": \"lvl-ground\", \"startX\": " + ox + ", \"startY\": " + oy + ", \"endX\": " + (ox + 9.0) + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-2\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 9.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox + 9.0) + ", \"endY\": " + (oy + 7.0) + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-3\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 9.0) + ", \"startY\": " + (oy + 7.0) + ", \"endX\": " + ox + ", \"endY\": " + (oy + 7.0) + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-4\", \"levelId\": \"lvl-ground\", \"startX\": " + ox + ", \"startY\": " + (oy + 7.0) + ", \"endX\": " + ox + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                // Interior partition: divider between Living/Dining and Bedroom/Kitchen
                "    {\"id\": \"w-5\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 5.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox + 5.0) + ", \"endY\": " + (oy + 7.0) + ", \"thickness\": 0.115, \"height\": 3.0, \"wallType\": \"INTERIOR\", \"material\": \"BRICK\", \"color\": \"#94a3b8\"},\n" +
                // Partition between Bedroom and Bathroom/Kitchen
                "    {\"id\": \"w-6\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 5.0) + ", \"startY\": " + (oy + 4.0) + ", \"endX\": " + (ox + 9.0) + ", \"endY\": " + (oy + 4.0) + ", \"thickness\": 0.115, \"height\": 3.0, \"wallType\": \"INTERIOR\", \"material\": \"BRICK\", \"color\": \"#94a3b8\"}\n" +
                "  ],\n" +
                "  \"doors\": [\n" +
                "    {\"id\": \"d-1\", \"wallId\": \"w-1\", \"offset\": 1.5, \"width\": 1.0, \"height\": 2.1, \"type\": \"MAIN_ENTRANCE\", \"flip\": false},\n" +
                "    {\"id\": \"d-2\", \"wallId\": \"w-5\", \"offset\": 1.8, \"width\": 0.9, \"height\": 2.1, \"type\": \"INTERNAL\", \"flip\": false},\n" +
                "    {\"id\": \"d-3\", \"wallId\": \"w-6\", \"offset\": 1.2, \"width\": 0.8, \"height\": 2.1, \"type\": \"INTERNAL\", \"flip\": true}\n" +
                "  ],\n" +
                "  \"windows\": [\n" +
                "    {\"id\": \"win-1\", \"wallId\": \"w-1\", \"offset\": 3.5, \"width\": 1.5, \"height\": 1.2, \"elevation\": 0.9, \"type\": \"SLIDING\"},\n" +
                "    {\"id\": \"win-2\", \"wallId\": \"w-2\", \"offset\": 2.0, \"width\": 1.2, \"height\": 1.2, \"elevation\": 0.9, \"type\": \"CASEMENT\"},\n" +
                "    {\"id\": \"win-3\", \"wallId\": \"w-3\", \"offset\": 2.5, \"width\": 1.2, \"height\": 1.2, \"elevation\": 0.9, \"type\": \"CASEMENT\"},\n" +
                "    {\"id\": \"win-4\", \"wallId\": \"w-4\", \"offset\": 3.0, \"width\": 1.5, \"height\": 1.2, \"elevation\": 0.9, \"type\": \"SLIDING\"}\n" +
                "  ],\n" +
                "  \"columns\": [\n" +
                "    {\"id\": \"c-1\", \"levelId\": \"lvl-ground\", \"x\": " + ox + ", \"y\": " + oy + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0},\n" +
                "    {\"id\": \"c-2\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 5.0) + ", \"y\": " + oy + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0},\n" +
                "    {\"id\": \"c-3\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 9.0) + ", \"y\": " + oy + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0},\n" +
                "    {\"id\": \"c-4\", \"levelId\": \"lvl-ground\", \"x\": " + ox + ", \"y\": " + (oy + 7.0) + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0},\n" +
                "    {\"id\": \"c-5\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 5.0) + ", \"y\": " + (oy + 7.0) + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0},\n" +
                "    {\"id\": \"c-6\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 9.0) + ", \"y\": " + (oy + 7.0) + ", \"width\": 0.3, \"depth\": 0.3, \"height\": 3.0}\n" +
                "  ],\n" +
                "  \"rooms\": [\n" +
                "    {\"id\": \"rm-1\", \"name\": \"Living & Dining\", \"type\": \"LIVING\", \"area\": 35.0, \"perimeter\": 24.0, \"floorMaterial\": \"CERAMIC_TILE\", \"color\": \"#38bdf8\", \"centerX\": " + (ox + 2.5) + ", \"centerY\": " + (oy + 3.5) + "},\n" +
                "    {\"id\": \"rm-2\", \"name\": \"Master Bedroom\", \"type\": \"BEDROOM\", \"area\": 16.0, \"perimeter\": 16.0, \"floorMaterial\": \"WOOD\", \"color\": \"#f472b6\", \"centerX\": " + (ox + 7.0) + ", \"centerY\": " + (oy + 2.0) + "},\n" +
                "    {\"id\": \"rm-3\", \"name\": \"Modular Kitchen\", \"type\": \"KITCHEN\", \"area\": 12.0, \"perimeter\": 14.0, \"floorMaterial\": \"GRANITE\", \"color\": \"#fbbf24\", \"centerX\": " + (ox + 7.0) + ", \"centerY\": " + (oy + 5.5) + "}\n" +
                "  ],\n" +
                "  \"furniture\": [\n" +
                "    {\"id\": \"f-1\", \"name\": \"3-Seater Sofa\", \"type\": \"SOFA\", \"x\": " + (ox + 1.2) + ", \"y\": " + (oy + 3.0) + ", \"rotation\": 0, \"width\": 2.1, \"depth\": 0.85},\n" +
                "    {\"id\": \"f-2\", \"name\": \"King Bed\", \"type\": \"BED\", \"x\": " + (ox + 7.2) + ", \"y\": " + (oy + 1.5) + ", \"rotation\": 0, \"width\": 1.8, \"depth\": 2.0},\n" +
                "    {\"id\": \"f-3\", \"name\": \"Dining Table 4P\", \"type\": \"TABLE\", \"x\": " + (ox + 3.2) + ", \"y\": " + (oy + 5.2) + ", \"rotation\": 90, \"width\": 1.4, \"depth\": 0.9}\n" +
                "  ],\n" +
                "  \"dimensions\": [\n" +
                "    {\"id\": \"dim-1\", \"startX\": " + ox + ", \"startY\": " + (oy - 0.8) + ", \"endX\": " + (ox + 9.0) + ", \"endY\": " + (oy - 0.8) + ", \"value\": 9.0, \"text\": \"9.00 m\"},\n" +
                "    {\"id\": \"dim-2\", \"startX\": " + (ox - 0.8) + ", \"startY\": " + oy + ", \"endX\": " + (ox - 0.8) + ", \"endY\": " + (oy + 7.0) + ", \"value\": 7.0, \"text\": \"7.00 m\"}\n" +
                "  ]\n" +
                "}";
    }

    public String generateModernTwoStoreyTemplate(Double w, Double l) {
        double ox = (w - 11.0) / 2.0;
        double oy = (l - 9.0) / 2.0;
        if (ox < 1.0) ox = 1.0;
        if (oy < 1.0) oy = 1.0;

        return "{\n" +
                "  \"plot\": {\"width\": " + w + ", \"length\": " + l + ", \"setbackFront\": 3.5, \"setbackRear\": 2.5, \"setbackLeft\": 2.0, \"setbackRight\": 2.0},\n" +
                "  \"levels\": [\n" +
                "    {\"id\": \"lvl-ground\", \"name\": \"Ground Floor\", \"floorIndex\": 0, \"elevation\": 0.0, \"height\": 3.2, \"slabThickness\": 0.15},\n" +
                "    {\"id\": \"lvl-first\", \"name\": \"First Floor\", \"floorIndex\": 1, \"elevation\": 3.2, \"height\": 3.0, \"slabThickness\": 0.15}\n" +
                "  ],\n" +
                "  \"activeLevelId\": \"lvl-ground\",\n" +
                "  \"layers\": [\n" +
                "    {\"id\": \"layer-arch\", \"name\": \"Architecture\", \"color\": \"#60a5fa\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-struct\", \"name\": \"Structure\", \"color\": \"#f59e0b\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-dim\", \"name\": \"Dimensions\", \"color\": \"#34d399\", \"visible\": true, \"locked\": false},\n" +
                "    {\"id\": \"layer-furn\", \"name\": \"Furniture\", \"color\": \"#a78bfa\", \"visible\": true, \"locked\": false}\n" +
                "  ],\n" +
                "  \"walls\": [\n" +
                // Ground floor perimeter: 11m x 9m
                "    {\"id\": \"w-g1\", \"levelId\": \"lvl-ground\", \"startX\": " + ox + ", \"startY\": " + oy + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.2, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-g2\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 11.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + (oy + 9.0) + ", \"thickness\": 0.23, \"height\": 3.2, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-g3\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 11.0) + ", \"startY\": " + (oy + 9.0) + ", \"endX\": " + ox + ", \"endY\": " + (oy + 9.0) + ", \"thickness\": 0.23, \"height\": 3.2, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-g4\", \"levelId\": \"lvl-ground\", \"startX\": " + ox + ", \"startY\": " + (oy + 9.0) + ", \"endX\": " + ox + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.2, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                // Ground interior dividers
                "    {\"id\": \"w-g5\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 6.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox + 6.0) + ", \"endY\": " + (oy + 9.0) + ", \"thickness\": 0.15, \"height\": 3.2, \"wallType\": \"INTERIOR\", \"material\": \"BRICK\", \"color\": \"#94a3b8\"},\n" +
                "    {\"id\": \"w-g6\", \"levelId\": \"lvl-ground\", \"startX\": " + (ox + 6.0) + ", \"startY\": " + (oy + 5.0) + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + (oy + 5.0) + ", \"thickness\": 0.15, \"height\": 3.2, \"wallType\": \"INTERIOR\", \"material\": \"BRICK\", \"color\": \"#94a3b8\"},\n" +
                // First floor walls
                "    {\"id\": \"w-f1\", \"levelId\": \"lvl-first\", \"startX\": " + ox + ", \"startY\": " + oy + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-f2\", \"levelId\": \"lvl-first\", \"startX\": " + (ox + 11.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + (oy + 9.0) + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-f3\", \"levelId\": \"lvl-first\", \"startX\": " + (ox + 11.0) + ", \"startY\": " + (oy + 9.0) + ", \"endX\": " + ox + ", \"endY\": " + (oy + 9.0) + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"},\n" +
                "    {\"id\": \"w-f4\", \"levelId\": \"lvl-first\", \"startX\": " + ox + ", \"startY\": " + (oy + 9.0) + ", \"endX\": " + ox + ", \"endY\": " + oy + ", \"thickness\": 0.23, \"height\": 3.0, \"wallType\": \"EXTERIOR\", \"material\": \"BRICK\", \"color\": \"#d97706\"}\n" +
                "  ],\n" +
                "  \"doors\": [\n" +
                "    {\"id\": \"d-g1\", \"wallId\": \"w-g1\", \"offset\": 2.0, \"width\": 1.1, \"height\": 2.2, \"type\": \"MAIN_ENTRANCE\", \"flip\": false},\n" +
                "    {\"id\": \"d-g2\", \"wallId\": \"w-g5\", \"offset\": 2.0, \"width\": 0.9, \"height\": 2.1, \"type\": \"INTERNAL\", \"flip\": false},\n" +
                "    {\"id\": \"d-g3\", \"wallId\": \"w-g6\", \"offset\": 1.5, \"width\": 0.9, \"height\": 2.1, \"type\": \"INTERNAL\", \"flip\": false}\n" +
                "  ],\n" +
                "  \"windows\": [\n" +
                "    {\"id\": \"win-g1\", \"wallId\": \"w-g1\", \"offset\": 7.5, \"width\": 1.8, \"height\": 1.4, \"elevation\": 0.8, \"type\": \"SLIDING\"},\n" +
                "    {\"id\": \"win-g2\", \"wallId\": \"w-g2\", \"offset\": 2.5, \"width\": 1.5, \"height\": 1.4, \"elevation\": 0.8, \"type\": \"CASEMENT\"},\n" +
                "    {\"id\": \"win-g3\", \"wallId\": \"w-g4\", \"offset\": 4.0, \"width\": 1.8, \"height\": 1.4, \"elevation\": 0.8, \"type\": \"SLIDING\"}\n" +
                "  ],\n" +
                "  \"columns\": [\n" +
                "    {\"id\": \"cg-1\", \"levelId\": \"lvl-ground\", \"x\": " + ox + ", \"y\": " + oy + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2},\n" +
                "    {\"id\": \"cg-2\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 6.0) + ", \"y\": " + oy + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2},\n" +
                "    {\"id\": \"cg-3\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 11.0) + ", \"y\": " + oy + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2},\n" +
                "    {\"id\": \"cg-4\", \"levelId\": \"lvl-ground\", \"x\": " + ox + ", \"y\": " + (oy + 9.0) + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2},\n" +
                "    {\"id\": \"cg-5\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 6.0) + ", \"y\": " + (oy + 9.0) + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2},\n" +
                "    {\"id\": \"cg-6\", \"levelId\": \"lvl-ground\", \"x\": " + (ox + 11.0) + ", \"y\": " + (oy + 9.0) + ", \"width\": 0.35, \"depth\": 0.35, \"height\": 3.2}\n" +
                "  ],\n" +
                "  \"rooms\": [\n" +
                "    {\"id\": \"rm-g1\", \"name\": \"Grand Living & Dining Room\", \"type\": \"LIVING\", \"area\": 54.0, \"perimeter\": 30.0, \"floorMaterial\": \"MARBLE\", \"color\": \"#38bdf8\", \"centerX\": " + (ox + 3.0) + ", \"centerY\": " + (oy + 4.5) + "},\n" +
                "    {\"id\": \"rm-g2\", \"name\": \"Guest Suite\", \"type\": \"BEDROOM\", \"area\": 25.0, \"perimeter\": 20.0, \"floorMaterial\": \"WOOD\", \"color\": \"#f472b6\", \"centerX\": " + (ox + 8.5) + ", \"centerY\": " + (oy + 2.5) + "},\n" +
                "    {\"id\": \"rm-g3\", \"name\": \"Gourmet Island Kitchen\", \"type\": \"KITCHEN\", \"area\": 20.0, \"perimeter\": 18.0, \"floorMaterial\": \"GRANITE\", \"color\": \"#fbbf24\", \"centerX\": " + (ox + 8.5) + ", \"centerY\": " + (oy + 7.0) + "}\n" +
                "  ],\n" +
                "  \"furniture\": [\n" +
                "    {\"id\": \"fg-1\", \"name\": \"Sectional Luxury Sofa\", \"type\": \"SOFA\", \"x\": " + (ox + 2.0) + ", \"y\": " + (oy + 3.5) + ", \"rotation\": 0, \"width\": 2.8, \"depth\": 1.6},\n" +
                "    {\"id\": \"fg-2\", \"name\": \"Dining Table 8P\", \"type\": \"TABLE\", \"x\": " + (ox + 4.2) + ", \"y\": " + (oy + 7.0) + ", \"rotation\": 0, \"width\": 2.2, \"depth\": 1.0},\n" +
                "    {\"id\": \"fg-3\", \"name\": \"Queen Bed\", \"type\": \"BED\", \"x\": " + (ox + 8.5) + ", \"y\": " + (oy + 2.0) + ", \"rotation\": 0, \"width\": 1.6, \"depth\": 2.0}\n" +
                "  ],\n" +
                "  \"dimensions\": [\n" +
                "    {\"id\": \"dim-g1\", \"startX\": " + ox + ", \"startY\": " + (oy - 1.0) + ", \"endX\": " + (ox + 11.0) + ", \"endY\": " + (oy - 1.0) + ", \"value\": 11.0, \"text\": \"11.00 m\"},\n" +
                "    {\"id\": \"dim-g2\", \"startX\": " + (ox - 1.0) + ", \"startY\": " + oy + ", \"endX\": " + (ox - 1.0) + ", \"endY\": " + (oy + 9.0) + ", \"value\": 9.0, \"text\": \"9.00 m\"}\n" +
                "  ]\n" +
                "}";
    }

    public String generateVillaTemplate(Double w, Double l) {
        return generateModernTwoStoreyTemplate(w, l);
    }
}
