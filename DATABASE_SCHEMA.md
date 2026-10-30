# BuildCraft Studio — Database Schema Specification

This document details the relational database schema implemented in SQLite for BuildCraft Studio via JPA/Hibernate entities.

## 1. Entity-Relationship Overview

```
[User] 1 ──── N [Project] 1 ──── 1 [Building] 1 ──── N [BuildingLevel]
                   │                   │                    │
                   │                   │                    ├── N [Wall] 1 ──── N [Door]
                   │                   │                    │            1 ──── N [Window]
                   │                   │                    ├── N [Room]
                   │                   │                    ├── N [Column]
                   │                   │                    ├── N [Beam]
                   │                   │                    └── N [Slab]
                   │                   │
                   ├── 1 [Plot]        └── 1 ──── N [Foundation]
                   ├── N [CADLayer] 1 ──── N [CADObject]
                   ├── N [CostEstimate] 1 ──── N [BOQItem]
                   ├── N [ProjectReport]
                   ├── N [AIConversation] 1 ──── N [AIProposal]
                   ├── 1 [ProjectSettings]
                   └── N [ProjectVersion]
```

## 2. Table Specifications

### 2.1 projects
- `id` (VARCHAR(36), PK) - UUID
- `name` (VARCHAR(255), NOT NULL) - Project title
- `client_name` (VARCHAR(255))
- `location` (VARCHAR(255))
- `category` (VARCHAR(50)) - RESIDENTIAL, COMMERCIAL, VILLA, etc.
- `unit_system` (VARCHAR(20)) - METRIC, IMPERIAL
- `length_unit` (VARCHAR(20)) - METERS, MILLIMETERS, FEET_INCHES
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `thumbnail_data` (TEXT) - Base64 preview
- `project_data_json` (TEXT) - Full serialized scene graph for rapid offline loading

### 2.2 plots
- `id` (VARCHAR(36), PK)
- `project_id` (VARCHAR(36), FK -> projects.id)
- `width` (DOUBLE) - Plot width in meters
- `length` (DOUBLE) - Plot length in meters
- `setback_front` (DOUBLE)
- `setback_rear` (DOUBLE)
- `setback_left` (DOUBLE)
- `setback_right` (DOUBLE)
- `boundary_points_json` (TEXT)
- `road_access_orientation` (VARCHAR(20)) - NORTH, SOUTH, EAST, WEST

### 2.3 buildings & building_levels
- `id` (VARCHAR(36), PK)
- `project_id` (VARCHAR(36), FK)
- `total_area` (DOUBLE)
- `footprint_area` (DOUBLE)
- **building_levels**:
  - `id` (VARCHAR(36), PK)
  - `building_id` (VARCHAR(36), FK)
  - `name` (VARCHAR(100)) - Ground Floor, First Floor, etc.
  - `floor_index` (INT) - 0, 1, 2...
  - `elevation` (DOUBLE) - Height from ground (m)
  - `height` (DOUBLE) - Story clear height (m)
  - `slab_thickness` (DOUBLE)

### 2.4 walls
- `id` (VARCHAR(36), PK)
- `level_id` (VARCHAR(36), FK -> building_levels.id)
- `start_x` (DOUBLE)
- `start_y` (DOUBLE)
- `end_x` (DOUBLE)
- `end_y` (DOUBLE)
- `thickness` (DOUBLE) - Standard 0.2m (200mm) or 0.1m
- `height` (DOUBLE) - Default 3.0m
- `wall_type` (VARCHAR(50)) - EXTERIOR, INTERIOR, PARTITION, RETAINING
- `material` (VARCHAR(50)) - BRICK, CONCRETE_BLOCK, REINFORCED_CONCRETE, DRYWALL
- `finish_color` (VARCHAR(20))

### 2.5 doors & windows
- `id` (VARCHAR(36), PK)
- `wall_id` (VARCHAR(36), FK -> walls.id)
- `offset_distance` (DOUBLE) - Position along wall from start point
- `width` (DOUBLE) - Door: 0.9m, Window: 1.2m
- `height` (DOUBLE) - Door: 2.1m, Window: 1.2m
- `elevation` (DOUBLE) - Window sill height: 0.9m, Door: 0m
- `type` (VARCHAR(50)) - SINGLE, DOUBLE, SLIDING, CASEMENT
- `flip_hand` (BOOLEAN) - Swing direction

### 2.6 rooms
- `id` (VARCHAR(36), PK)
- `level_id` (VARCHAR(36), FK)
- `name` (VARCHAR(100)) - Living Room, Master Bedroom, Kitchen, etc.
- `type` (VARCHAR(50))
- `area` (DOUBLE) - Calculated square meters
- `perimeter` (DOUBLE) - Calculated perimeter meters
- `polygon_json` (TEXT) - Boundary coordinates
- `floor_material` (VARCHAR(50)) - CERAMIC_TILE, WOOD, MARBLE, GRANITE

### 2.7 structural_elements (columns, beams, slabs, foundations)
- `id` (VARCHAR(36), PK)
- `level_id` (VARCHAR(36), FK)
- `element_type` (VARCHAR(50)) - COLUMN, BEAM, SLAB, FOOTING
- `x` (DOUBLE), `y` (DOUBLE), `z` (DOUBLE)
- `width` (DOUBLE), `depth` (DOUBLE), `length` (DOUBLE)
- `concrete_grade` (VARCHAR(20)) - M20, M25, M30
- `steel_grade` (VARCHAR(20)) - Fe500, Fe550
- `estimated_concrete_vol` (DOUBLE)
- `estimated_steel_kg` (DOUBLE)

### 2.8 cost_estimates & boq_items
- `id` (VARCHAR(36), PK)
- `project_id` (VARCHAR(36), FK)
- `currency` (VARCHAR(10)) - USD, INR, EUR, GBP
- `total_material_cost` (DOUBLE)
- `total_labour_cost` (DOUBLE)
- `total_estimate` (DOUBLE)
- `items_json` (TEXT) - Categorized BOQ line items with rates & units
