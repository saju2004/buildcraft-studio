package com.buildcraftstudio.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class ProjectEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "client_name")
    private String clientName;

    @Column(name = "location")
    private String location;

    @Column(name = "category")
    private String category;

    @Column(name = "unit_system")
    private String unitSystem;

    @Column(name = "length_unit")
    private String lengthUnit;

    @Column(name = "plot_width")
    private Double plotWidth;

    @Column(name = "plot_length")
    private Double plotLength;

    @Column(name = "floor_count")
    private Integer floorCount;

    @Column(name = "thumbnail_data", columnDefinition = "TEXT")
    private String thumbnailData;

    @Column(name = "project_data_json", columnDefinition = "TEXT")
    private String projectDataJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ProjectEntity() {
    }

    public ProjectEntity(String id, String name, String clientName, String location,
                         String category, String unitSystem, String lengthUnit,
                         Double plotWidth, Double plotLength, Integer floorCount,
                         String thumbnailData, String projectDataJson,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.clientName = clientName;
        this.location = location;
        this.category = category;
        this.unitSystem = unitSystem;
        this.lengthUnit = lengthUnit;
        this.plotWidth = plotWidth;
        this.plotLength = plotLength;
        this.floorCount = floorCount;
        this.thumbnailData = thumbnailData;
        this.projectDataJson = projectDataJson;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

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
}
