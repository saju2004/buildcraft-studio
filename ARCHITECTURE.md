# BuildCraft Studio — System Architecture

## 1. High-Level Architecture Overview

BuildCraft Studio is an integrated professional desktop engineering software built using an Electron + React frontend combined with a Spring Boot Java desktop service and local SQLite database engine.

```
+-----------------------------------------------------------------------------------+
|                           BUILDCRAFT STUDIO DESKTOP (WIN64)                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             ELECTRON SHELL                                  |  |
|  |  * Main Process: Lifecycle, Native Menus, Window Management, Process Spawner|  |
|  |  * Preload Bridge: Context Isolation, Whitelisted IPC, Native Dialogs       |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                       FRONTEND (REACT.JS / ES6+)                            |  |
|  |                                                                             |  |
|  |  [ Application Shell ]                                                      |  |
|  |   - Top Menu Bar & Quick Access Toolbar                                     |  |
|  |   - Engineering Tool Palette (Wall, Door, Window, Column, Beam, Slab, etc.) |  |
|  |   - Central Viewport Switcher (2D CAD / 3D BIM / Split View)                |  |
|  |   - Right-side Inspector & Level Navigator                                  |  |
|  |   - Bottom Command Line & Precision Status Bar                              |  |
|  |                                                                             |  |
|  |  [ 2D CAD Engine ]                   [ 3D Building Engine ]                 |  |
|  |   - World/Screen Transforms           - Three.js / React Three Fiber        |  |
|  |   - Konva.js Vector Canvas            - Real-time 2D-to-3D Extrusion        |  |
|  |   - Grid & Snapping Subsystem         - Wall Openings & Solid Boolean Logic |  |
|  |   - Dynamic Dimensioning Subsystem    - Multi-Level Elevations & Materials  |  |
|  |                                                                             |  |
|  |  [ State & Command Architecture ]                                           |  |
|  |   - Central Zustand Store (Project, Levels, Layers, CAD Entities)           |  |
|  |   - Command Stack with Undo/Redo (Execute, Revert, Redo)                     |  |
|  +-----------------------------------------------------------------------------+  |
|                                         | HTTP / JSON REST                        |
|  +-----------------------------------------------------------------------------+  |
|  |                   BACKEND ENGINE (SPRING BOOT 3 / JAVA 17)                  |  |
|  |                                                                             |  |
|  |  - REST API Controllers (/api/projects, /api/building, /api/estimates)      |  |
|  |  - Service Layer (CAD Math, Civil Quantity Formulas, Takeoff Engines)      |  |
|  |  - AI Assistant Service (Structured JSON Generation & Validation)           |  |
|  |  - Spring Data JPA with Hibernate Community SQLite Dialect                  |  |
|  |  - Local SQLite Database (buildcraft_studio.db)                             |  |
|  |  - Native .bcs Project File Reader/Writer                                   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

## 2. Core Subsystems

### 2.1 Coordinate System & Geometry
- **World Coordinate Space**: Floating point metric (meters/mm) or imperial (feet/inches) standard coordinate system with origin `(0, 0, 0)` at plot base.
- **Screen Transformation**: Viewport pan `(panX, panY)` and scale `zoom`.
  - World to Screen: `screenX = worldX * zoom + panX`, `screenY = -worldY * zoom + panY` (Y-up convention).
  - Screen to World: `worldX = (screenX - panX) / zoom`, `worldY = -(screenY - panY) / zoom`.
- **Snapping Subsystem**:
  - Grid snap to custom increments (e.g. 0.1m, 0.5m, 1.0m).
  - Object Endpoint snap: Snaps to existing wall endpoints within screen tolerance.
  - Object Midpoint snap: Snaps to centers of existing elements.
  - Ortho Mode: Constrains vector drawing to 0°, 90°, 180°, 270°.

### 2.2 2D to 3D Synchronization
- Unified building entity model: A Wall is defined by `startPoint {x, y}`, `endPoint {x, y}`, `thickness`, `height`, `material`, `levelId`.
- The 3D engine computes wall direction, length, rotation, extrusion box, and cuts door/window openings accurately at their specified offsets and heights.
- Real-time updates: Edits in 2D instantly propagate into the 3D scene without re-creating unassociated geometries.
