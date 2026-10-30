package com.buildcraftstudio.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ProjectResponse {
    private String id;
    private String name;
    private String clientName;
    private String location;
    private String category;
    private String unitSystem;
    private String lengthUnit;
    private Double plotWidth;
    private Double plotLength;
    private Integer floorCount;
    private String thumbnailData;
    private String projectDataJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, Object> stats;

    public ProjectResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUnitSystem() { return unitSystem; }
    public void setUnitSystem(String unitSystem) { this.unitSystem = unitSystem; }

    public String getLengthUnit() { return lengthUnit; }
    public void setLengthUnit(String lengthUnit) { this.lengthUnit = lengthUnit; }

    public Double getPlotWidth() { return plotWidth; }
    public void setPlotWidth(Double plotWidth) { this.plotWidth = plotWidth; }

    public Double getPlotLength() { return plotLength; }
    public void setPlotLength(Double plotLength) { this.plotLength = plotLength; }

    public Integer getFloorCount() { return floorCount; }
    public void setFloorCount(Integer floorCount) { this.floorCount = floorCount; }

    public String getThumbnailData() { return thumbnailData; }
    public void setThumbnailData(String thumbnailData) { this.thumbnailData = thumbnailData; }

    public String getProjectDataJson() { return projectDataJson; }
    public void setProjectDataJson(String projectDataJson) { this.projectDataJson = projectDataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }
}
