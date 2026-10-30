# BuildCraft Studio — Development Progress

**Product**: BuildCraft Studio  
**Tagline**: Design Smarter. Build Better.  
**Version**: 1.0.0-SNAPSHOT  
**Platform**: Windows 10 & 11 (64-bit Desktop Application)  

---

## Roadmap & Status

| Phase | Description | Status | Notes |
|---|---|---|---|
| **Phase 1: Foundation** | Electron + React + Spring Boot + SQLite, Shell, Dashboard, Persistence | 🟢 Completed | Fully running desktop window, SQLite persistence, Spring Boot 3 REST APIs |
| **Phase 2: 2D CAD Engine** | Precision coordinate system, Konva/Canvas, Grid, Snap, Wall, Door, Window, Room, Dimension, Undo/Redo | 🟢 Completed | Interactive drafting, world/screen transforms, OSNAP, ORTHO mode, live dimensioning |
| **Phase 3: 3D Engine** | Three.js / R3F viewport, automated 2D-to-3D wall extrusion, openings, slabs, camera orbits, materials | 🟢 Completed | Real-time 2D-to-3D sync, Three.js OrbitControls, lighting & shadows, presets |
| **Phase 4: Civil Engineering** | Structural grids, columns, beams, foundations, concrete takeoff, steel estimation | 🟢 Completed | Structural columns, foundation layout, rebar estimation formulas, volume calculations |
| **Phase 5: Site & Interior Design** | Plot boundaries, setbacks, ground coverage, furniture placement, materials library | 🟢 Completed | Parametric plot boundary, setbacks, coverage % and 3D furniture placement |
| **Phase 6: Cost Estimation** | BOQ generator, material rates, labour, tax, currency management, PDF/reports | 🟢 Completed | Real-time BOQ generator, unit rates, labour%, contingency%, multi-currency (USD, INR, EUR, GBP) |
| **Phase 7: AI Architect** | Natural language house planner, structured JSON proposal generator, geometric validation | 🟢 Completed | Natural language AI planner, structured zoning, geometric constraint verification |
| **Phase 8: Professional Interoperability** | DXF export/import, native .bcs project serialization, drawing sheets | 🟢 Completed | Native .bcs JSON package export, standard AutoCAD DXF vector export |
| **Phase 9: Quality & Release** | Packaging, Electron Builder, error recovery, testing verification | 🟡 Ongoing | Production packaging, manual checklist and automated tests |

---

## Milestone 1 Delivery Verification Checklist

- [x] **1. Working Windows Desktop Window**: Electron 30.5.1 main & preload process running with context isolation and secure IPC bridge.
- [x] **2. Professional Dark-Themed Engineering Workspace**: Dark charcoal theme (`#0f1115`), graphite panels, subtle borders, high visual polish, Lucide icons, Inter & JetBrains Mono typography.
- [x] **3. Create / Open / Save Project**: Full CRUD operations connected to Spring Boot 3 REST backend.
- [x] **4. Project Creation Wizard**: Modal wizard capturing project name, client, location, category, plot dimensions, units, floor count, and engineering templates.
- [x] **5. Working 2D CAD Workspace**: Infinite pan/zoom canvas, world-to-screen transforms, major/minor grid, cursor coordinate tracking.
- [x] **6. Grid & Coordinate System**: Metric (meters, mm, cm) and Imperial support, floating point precision world space.
- [x] **7. Line, Rectangle, Wall Tools**: Real-time rubberbanding, live distance readouts, exterior & interior wall thickness (230mm / 115mm).
- [x] **8. Wall Dimensions & Properties**: Properties Inspector on the right panel showing live length, coordinates, thickness, height, and wall type.
- [x] **9. Working 3D Viewport**: Three.js / React Three Fiber interactive scene with directional sunlight, shadows, and camera angle presets.
- [x] **10. 2D-to-3D Real-Time Conversion**: Walls extruded into 3D solid meshes, slabs generated under building footprint, structural columns positioned in 3D.
- [x] **11. Orbit, Pan, Zoom**: Three.js OrbitControls with mouse damping, max polar angle constraint, and perspective camera.
- [x] **12. Split View**: Synchronized side-by-side view showing 2D CAD layout on the left and 3D BIM model on the right.
- [x] **13. SQLite Persistence**: Spring Boot Data JPA with SQLite JDBC and Hibernate 6 Community Dialect (`buildcraft_studio.db`).
- [x] **14. Working Backend Connection**: Real-time health check pill in toolbar showing UP / Connected status.
- [x] **15. Undo / Redo Command Stack**: Command pattern for adding/updating/deleting walls, doors, windows, and columns.
- [x] **16. Pre-seeded Residential Projects**: "Green Haven Residential Villa" (2-storey) and "Sunridge Modern Bungalow" pre-seeded on startup.
- [x] **17. AI Architect Assistant**: Natural language planning (`/api/ai/plan`) returning structured proposals with geometric validation.
- [x] **18. Cost Takeoff & BOQ**: Preliminary quantity takeoff engine (`/api/estimates/calculate`) computing concrete, steel, brick, and tile costs.
- [x] **19. Native .BCS & DXF Export**: Exporting native project packages and AutoCAD-compatible vector DXF drawings.
