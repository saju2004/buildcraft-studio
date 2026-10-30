# BuildCraft Studio 🏛️📐

> **Design Smarter. Build Better.**  
> *Professional Civil Engineering, Architecture, 2D CAD & 3D Building Design Desktop Software.*

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20(64--bit)-0078D6?logo=windows)](https://github.com/saju2004/buildcraft-studio)
[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Electron](https://img.shields.io/badge/Electron-30.5-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 🏗️ Overview

**BuildCraft Studio** is an integrated Windows desktop CAD & BIM engineering software designed for civil engineers, architects, building planners, contractors, and interior designers. It provides an end-to-end workflow from initial site boundary planning and 2D architectural CAD drafting to real-time 3D building visualization, structural layout, automated quantity takeoffs, and preliminary construction cost estimation.

---

## ✨ Key Features

### 1. 📐 2D Architectural CAD Vector Engine
- **Precision Floating-Point Coordinates**: Strict separation between screen pixels and engineering world meters.
- **World & Screen Transformations**: Pan, mouse-wheel zoom, and origin tracking.
- **Grid & Snapping Subsystem**:
  - Major and minor grid lines (configurable spacing: `0.5m`, `1.0m`, etc.).
  - **OSNAP**: Precision object snapping to wall and column endpoints and midpoints.
  - **ORTHO Mode**: Constraints to 0°, 90°, 180°, and 270°.
- **Drafting Tools**:
  - **Wall Tool**: Live rubberbanding, distance tags, exterior (`230mm`) & interior (`115mm`) wall thickness.
  - **Doors & Windows**: Associated wall openings with 90° swing arcs and double-line window frames.
  - **Columns**: Square/rectangular structural columns with cross hatching.
  - **Dimensions**: Linear & aligned dimension witness lines with dynamic measurement formatting.
  - **Rooms**: Automatic room label, area ($m^2$), and perimeter calculations.

### 2. 🏛️ 3D Building Modelling Engine (Three.js / React Three Fiber)
- **Automatic 2D-to-3D Conversion**: Real-time solid extrusion of 2D walls into 3D meshes with elevation offsets.
- **Multi-Level Support**: Ground Floor, First Floor, and upper stories with story height and slab thickness.
- **Structural Slabs & Columns**: Automatically generated floor slabs under building footprints and 3D columns.
- **Lighting & Shadows**: Realistic directional sunlight casting soft shadows, ambient lighting, and ground plane.
- **Camera Controls**: OrbitControls (orbit, pan, zoom) with polar angle limit and presets:
  - **Isometric 3D**, **Top (Plan)**, **Front (Elevation)**, and **Right**.
- **Synchronized Split View**: Side-by-side interactive 2D CAD layout and 3D BIM model with instant updates.

### 3. 📊 Construction Cost Takeoff & BOQ Engine
- **Quantity Calculations**:
  - Concrete volume takeoff ($m^3$) for footings, columns, beams, and slabs.
  - Steel reinforcement takeoff ($kg$ and metric tons).
  - Masonry brick count and plastering/painting surface area ($m^2$).
  - Flooring finish tiles area ($m^2$).
- **Itemized BOQ Table**: Configurable unit rates, labour percentages, contingency, and total budget summary.
- **Multi-Currency Support**: USD ($), INR (₹), EUR (€), and GBP (£).

### 4. 🤖 AI Architect Assistant
- **Natural Language Planning**: Translates prompt requirements (e.g., *"40x60 plot 4-bedroom modern 2-storey house"*) into structured zoning and floor plans.
- **Geometric Verification**: Checks plot boundaries, mandatory setbacks, and coverage percentages before applying.
- **User Confirmation**: Allows users to inspect and approve AI proposals before adding them to the project.

### 5. 💾 Native Persistence & Interoperability
- **Spring Boot 3 + SQLite**: Robust local database persistence (`buildcraft_studio.db`) with offline capability.
- **Native `.bcs` Package**: JSON project serialization storing plot, levels, layers, walls, openings, and components.
- **AutoCAD DXF Export**: Generates standard vector `.dxf` drawings for AutoCAD and LibreCAD.

---

## 📁 Repository Structure

```
c:\BuildCraft Studio\
├── backend/                                   # Spring Boot 3 Java Desktop Backend
│   ├── pom.xml                                # Maven configuration (Spring Boot, SQLite, JPA)
│   └── src/main/java/com/buildcraftstudio/
│       ├── BuildCraftStudioApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/                        # ProjectController, EstimateController, AIArchitectController, HealthController
│       ├── dto/                               # DTO models
│       ├── entity/ProjectEntity.java          # JPA SQLite entity
│       ├── repository/ProjectRepository.java
│       └── service/                           # ProjectService, TemplateFactory, EstimationService, AIArchitectService
├── frontend/                                  # React + Electron Desktop Application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── electron/
│   │   ├── main.js                            # Electron main process & IPC handlers
│   │   └── preload.js                         # Secure Context Bridge
│   └── src/
│       ├── app/App.jsx                        # Master Application Shell
│       ├── components/
│       │   ├── layout/                        # TopMenuBar, QuickAccessToolbar, StatusBar, CommandLine
│       │   └── dialogs/                       # NewProjectModal, AIPlannerModal, EstimatesModal, ExportModal
│       ├── modules/
│       │   ├── cad2d/                         # 2D CAD Canvas & Toolbar
│       │   ├── modelling3d/                   # Three.js 3D Viewport & Scene
│       │   ├── properties/                    # Properties Inspector
│       │   └── dashboard/                     # Project Hub & Templates
│       ├── engines/                           # Geometry transforms, Snapping & Undo/Redo command manager
│       ├── stores/                            # Zustand stores (project, cad, ui)
│       └── services/apiService.js             # Backend REST client
├── start-buildcraft.bat                       # One-click Windows launcher
├── DEVELOPMENT_PROGRESS.md                    # Roadmap & milestone status
├── ARCHITECTURE.md                            # Detailed system architecture document
├── DATABASE_SCHEMA.md                         # Relational SQLite database schema
├── API_DOCUMENTATION.md                       # REST API endpoint documentation
├── TESTING.md                                 # Testing strategy & checklist
└── CHANGELOG.md                               # Version release changelog
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node.js v24 & npm 11)
- **Java**: JDK 17+ (Eclipse Adoptium Temurin 17 or higher)
- **Apache Maven**: 3.8+ (included in system or user path)
- **OS**: Windows 10 / 11 (64-bit)

### Quick Launch
Simply run the one-click batch script:
```bat
start-buildcraft.bat
```

Or start the services manually:

#### 1. Start Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
```
*Backend runs on `http://127.0.0.1:8080` and creates `buildcraft_studio.db`.*

#### 2. Start Frontend & Electron Desktop App
```powershell
cd frontend
npm install
npm start
```

---

## 📄 License
This project is proprietary and confidential.  
© 2026 BuildCraft Studio Team. All rights reserved.
