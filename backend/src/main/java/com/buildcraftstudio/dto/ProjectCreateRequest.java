package com.buildcraftstudio.dto;

public class ProjectCreateRequest {
    private String name;
    private String clientName;
    private String location;
    private String category;
    private String unitSystem;
    private String lengthUnit;
    private Double plotWidth;
    private Double plotLength;
    private Integer floorCount;
    private String templateType; // EMPTY, SMALL_HOUSE, MODERN_TWO_STOREY, VILLA
    private String projectDataJson;
    private String thumbnailData;

    public ProjectCreateRequest() {}

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

    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }

    public String getProjectDataJson() { return projectDataJson; }
    public void setProjectDataJson(String projectDataJson) { this.projectDataJson = projectDataJson; }

    public String getThumbnailData() { return thumbnailData; }
    public void setThumbnailData(String thumbnailData) { this.thumbnailData = thumbnailData; }
}
