# Changelog — BuildCraft Studio

All notable changes to this project are documented in this file.

## [1.0.0-beta.1] - 2026-10-30

### Completed Milestone 1: Core Engine, CAD, 3D BIM, and Full-Stack Desktop Architecture

#### Desktop Shell & Design System
- Built enterprise-grade engineering workspace inspired by AutoCAD, Revit, and Archicad.
- Charcoal workspace background (`#0f1115`), subtle graphite panels (`#141820`), neutral borders (`#232936`), and blue selection highlights (`#38bdf8`).
- Integrated custom top menu bar, quick access toolbar, bottom AutoCAD-style command line, and monospace status bar with coordinate tracking (`X`, `Y`, `Z`).
- Implemented Electron 30 desktop window management with context isolation and secure preload IPC bridge.

#### Backend & Persistence
- Configured Spring Boot 3 with Java 17, Spring Data JPA, and Hibernate 6 Community Dialect.
- Integrated SQLite database (`buildcraft_studio.db`) for offline-first desktop storage.
- Implemented REST APIs:
  - `GET /api/projects`, `POST /api/projects`, `GET /api/projects/{id}`, `PUT /api/projects/{id}`, `DELETE /api/projects/{id}`, `POST /api/projects/{id}/duplicate`
  - `POST /api/estimates/calculate`
  - `POST /api/ai/plan`
  - `GET /api/health`
- Seeded default sample residential projects: *Green Haven Residential Villa* and *Sunridge Modern Bungalow*.

#### 2D CAD Engine
- Built 2D CAD canvas with mathematical separation between screen pixels and world meters.
- Implemented world-to-screen and screen-to-world coordinate transformations.
- Integrated configurable grid system (major & minor lines) with grid snapping.
- Built Object Snapping (OSNAP) for endpoints and midpoints, plus Orthogonal Mode (ORTHO).
- Interactive drawing tools: Select, Pan, Wall (thickness 230mm/115mm), Door, Window, Column, Room, Dimension, Line, Rectangle, Eraser.
- Built command pattern Undo/Redo manager (Ctrl+Z / Ctrl+Y).

#### 3D Building Modelling Engine
- Built interactive Three.js / React Three Fiber 3D viewport.
- Real-time 2D-to-3D automatic conversion:
  - Extrudes 2D walls into 3D solid meshes with elevation offsets.
  - Generates structural floor slabs under building footprints.
  - Positions structural columns in 3D space with materials.
  - Places 3D furniture models (sofas, beds, dining tables).
- Implemented OrbitControls (orbit, pan, zoom) with polar angle limit.
- Provided camera angle presets: Isometric, Top, Front, Right.
- Implemented synchronized Split View (side-by-side interactive 2D CAD + 3D BIM).

#### Civil Engineering & Cost Estimation (BOQ)
- Implemented concrete volume takeoff for footings, columns, and slabs (m³).
- Implemented steel reinforcement estimation (kg and metric tons).
- Implemented brick masonry count and wall plaster/finishing surface area calculations.
- Integrated itemized BOQ table with unit rates and summary cards (materials, labour, contingency, grand total).
- Supported multi-currency selection: USD ($), INR (₹), EUR (€), and GBP (£).

#### AI Architect Assistant
- Integrated natural language prompt planner with structured JSON schema.
- Generates room arrangements, zoning, setbacks, and parametric geometry.
- Validates geometric constraints and presents a design summary before user acceptance.

#### Export Capabilities
- Implemented native `.bcs` project JSON package export.
- Implemented standard AutoCAD DXF vector drawing export (`.dxf`).
