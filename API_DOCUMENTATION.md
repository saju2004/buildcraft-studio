# BuildCraft Studio — REST API Documentation

Base URL: `http://127.0.0.1:8080/api`

## 1. Project Endpoints

### `GET /api/projects`
Retrieves all projects with metadata, thumbnail, and last modified date.
- **Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Modern Residential Villa",
    "clientName": "John Doe",
    "location": "Green Valley Plot 14",
    "category": "RESIDENTIAL",
    "unitSystem": "METRIC",
    "lengthUnit": "METERS",
    "createdAt": "2026-10-30T10:00:00",
    "updatedAt": "2026-10-30T10:00:00",
    "thumbnailData": "data:image/png;base64,...",
    "stats": {
      "levelCount": 2,
      "wallCount": 16,
      "roomCount": 6,
      "totalArea": 185.4
    }
  }
]
```

### `POST /api/projects`
Creates a new project.
- **Payload**:
```json
{
  "name": "Compact Two-Storey Residence",
  "clientName": "Jane Smith",
  "location": "Metro Heights",
  "category": "RESIDENTIAL",
  "unitSystem": "METRIC",
  "lengthUnit": "METERS",
  "plotWidth": 12.0,
  "plotLength": 18.0,
  "floorCount": 2,
  "templateType": "MODERN_TWO_STOREY"
}
```

### `GET /api/projects/{id}`
Returns full project model including plot, levels, walls, doors, windows, rooms, structure, and estimates.

### `PUT /api/projects/{id}`
Updates project metadata, plot, and scene graph.

### `DELETE /api/projects/{id}`
Deletes project and associated entities.

### `POST /api/projects/{id}/export/bcs`
Exports the native `.bcs` project package (JSON compressed).

### `POST /api/projects/import/bcs`
Imports a native `.bcs` file.

---

## 2. Engineering & Structural Endpoints

### `POST /api/projects/{id}/estimates/calculate`
Calculates concrete volume takeoff (m³), reinforcement steel takeoff (kg/metric tons), brick masonry count, and creates a BOQ with configured regional unit rates.

### `POST /api/projects/{id}/civil/structural-grid`
Generates or updates structural grid coordinates, column schedules, and footing layouts.

---

## 3. AI Architect Endpoints

### `POST /api/ai/plan`
Accepts natural language requirements, returns structured room arrangements and 2D floor plan proposals with geometric constraints.
- **Request**:
```json
{
  "projectId": "uuid",
  "prompt": "Design a 40x60 ft modern 2-storey house with 4 bedrooms, 1 master bedroom on ground floor, modular kitchen, 2-car garage, and garden setback.",
  "plotDimensions": { "width": 12.19, "length": 18.28 }
}
```
- **Response**: Structured JSON design proposal with proposed walls, rooms, openings, and rationale for user review.

### `POST /api/ai/proposals/{proposalId}/apply`
Applies an accepted AI proposal into the active project after user confirmation.
