# BuildCraft Studio — Testing Strategy & Verification Checklist

## 1. Unit & Regression Tests

### 1.1 Geometry & CAD Math Verification
- [ ] World-to-Screen and Screen-to-World coordinate transformation invertibility
- [ ] Grid snapping accuracy across zoom levels (0.1x to 10.0x)
- [ ] Endpoint and midpoint snapping within radius threshold
- [ ] Orthogonal angle constraint (0°, 90°, 180°, 270°)
- [ ] Room polygon boundary identification and shoelace formula area calculation
- [ ] Unit conversions:
  - 1 meter = 1000 mm = 100 cm
  - 1 meter = 3.28084 feet = 39.3701 inches
  - Area: m² <-> sq.ft (1 m² = 10.7639 sq.ft)

### 1.2 3D Generation & Sync
- [ ] Wall extrusion creates 3D solids matching 2D start/end coordinates and thickness
- [ ] Door opening cutouts positioned accurately along wall tangent
- [ ] Window opening cutouts respect sill height and window height
- [ ] Floor slab geometry generates under room/building footprints
- [ ] Multi-story level elevations stack correctly without overlapping

### 1.3 Civil & Quantity Takeoffs
- [ ] Concrete volume calculation for footings: `Length * Width * Depth * Count`
- [ ] Column concrete: `Width * Depth * Height * Count`
- [ ] Slab concrete: `Area * Thickness`
- [ ] Steel weight estimation: `(Diameter^2 / 162.2) * TotalLengthInMeters`
- [ ] Masonry brick calculation based on standard brick dimensions + mortar allowance

### 1.4 Persistence & System Resilience
- [ ] SQLite schema migrations and auto-table generation
- [ ] Project save, reload, and integrity verification
- [ ] Electron native window management and child process management
- [ ] Command pattern Undo/Redo stack depth and state invariance
