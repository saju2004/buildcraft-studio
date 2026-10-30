package com.buildcraftstudio.service;

import com.buildcraftstudio.dto.ProjectCreateRequest;
import com.buildcraftstudio.dto.ProjectResponse;
import com.buildcraftstudio.entity.ProjectEntity;
import com.buildcraftstudio.repository.ProjectRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTemplateFactory templateFactory;

    public ProjectService(ProjectRepository projectRepository, ProjectTemplateFactory templateFactory) {
        this.projectRepository = projectRepository;
        this.templateFactory = templateFactory;
    }

    @PostConstruct
    public void initSampleProjectsIfEmpty() {
        if (projectRepository.count() == 0) {
            // Seed a high quality sample residential villa
            ProjectCreateRequest sample = new ProjectCreateRequest();
            sample.setName("Green Haven Residential Villa");
            sample.setClientName("Alexander & Elena Vance");
            sample.setLocation("14 Whispering Pines Blvd, Oakridge");
            sample.setCategory("RESIDENTIAL");
            sample.setUnitSystem("METRIC");
            sample.setLengthUnit("METERS");
            sample.setPlotWidth(18.0);
            sample.setPlotLength(24.0);
            sample.setFloorCount(2);
            sample.setTemplateType("MODERN_TWO_STOREY");
            createProject(sample);

            // Also seed a compact single-storey home
            ProjectCreateRequest sample2 = new ProjectCreateRequest();
            sample2.setName("Sunridge Modern Bungalow");
            sample2.setClientName("Sarah Jenkins");
            sample2.setLocation("82 Horizon Valley Way");
            sample2.setCategory("RESIDENTIAL");
            sample2.setUnitSystem("METRIC");
            sample2.setLengthUnit("METERS");
            sample2.setPlotWidth(15.0);
            sample2.setPlotLength(18.0);
            sample2.setFloorCount(1);
            sample2.setTemplateType("SMALL_HOUSE");
            createProject(sample2);
        }
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByUpdatedAtDesc().stream()
                .map(this::toResponseSummary)
                .collect(Collectors.toList());
    }

    public Optional<ProjectResponse> getProjectById(String id) {
        return projectRepository.findById(id).map(this::toFullResponse);
    }

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest req) {
        String id = UUID.randomUUID().toString();
        String json = req.getProjectDataJson();
        if (json == null || json.isBlank()) {
            json = templateFactory.generateTemplateJson(
                    req.getTemplateType(),
                    req.getPlotWidth(),
                    req.getPlotLength(),
                    req.getFloorCount()
            );
        }

        ProjectEntity entity = new ProjectEntity(
                id,
                req.getName() != null ? req.getName() : "Untitled Project",
                req.getClientName(),
                req.getLocation(),
                req.getCategory() != null ? req.getCategory() : "RESIDENTIAL",
                req.getUnitSystem() != null ? req.getUnitSystem() : "METRIC",
                req.getLengthUnit() != null ? req.getLengthUnit() : "METERS",
                req.getPlotWidth() != null ? req.getPlotWidth() : 15.0,
                req.getPlotLength() != null ? req.getPlotLength() : 20.0,
                req.getFloorCount() != null ? req.getFloorCount() : 1,
                req.getThumbnailData(),
                json,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        ProjectEntity saved = projectRepository.save(entity);
        return toFullResponse(saved);
    }

    @Transactional
    public Optional<ProjectResponse> updateProject(String id, ProjectCreateRequest req) {
        return projectRepository.findById(id).map(existing -> {
            if (req.getName() != null) existing.setName(req.getName());
            if (req.getClientName() != null) existing.setClientName(req.getClientName());
            if (req.getLocation() != null) existing.setLocation(req.getLocation());
            if (req.getCategory() != null) existing.setCategory(req.getCategory());
            if (req.getUnitSystem() != null) existing.setUnitSystem(req.getUnitSystem());
            if (req.getLengthUnit() != null) existing.setLengthUnit(req.getLengthUnit());
            if (req.getPlotWidth() != null) existing.setPlotWidth(req.getPlotWidth());
            if (req.getPlotLength() != null) existing.setPlotLength(req.getPlotLength());
            if (req.getFloorCount() != null) existing.setFloorCount(req.getFloorCount());
            if (req.getThumbnailData() != null) existing.setThumbnailData(req.getThumbnailData());
            if (req.getProjectDataJson() != null) existing.setProjectDataJson(req.getProjectDataJson());
            existing.setUpdatedAt(LocalDateTime.now());
            return toFullResponse(projectRepository.save(existing));
        });
    }

    @Transactional
    public boolean deleteProject(String id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<ProjectResponse> duplicateProject(String id) {
        return projectRepository.findById(id).map(original -> {
            String newId = UUID.randomUUID().toString();
            ProjectEntity copy = new ProjectEntity(
                    newId,
                    original.getName() + " (Copy)",
                    original.getClientName(),
                    original.getLocation(),
                    original.getCategory(),
                    original.getUnitSystem(),
                    original.getLengthUnit(),
                    original.getPlotWidth(),
                    original.getPlotLength(),
                    original.getFloorCount(),
                    original.getThumbnailData(),
                    original.getProjectDataJson(),
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );
            return toFullResponse(projectRepository.save(copy));
        });
    }

    private ProjectResponse toResponseSummary(ProjectEntity e) {
        ProjectResponse r = new ProjectResponse();
        r.setId(e.getId());
        r.setName(e.getName());
        r.setClientName(e.getClientName());
        r.setLocation(e.getLocation());
        r.setCategory(e.getCategory());
        r.setUnitSystem(e.getUnitSystem());
        r.setLengthUnit(e.getLengthUnit());
        r.setPlotWidth(e.getPlotWidth());
        r.setPlotLength(e.getPlotLength());
        r.setFloorCount(e.getFloorCount());
        r.setThumbnailData(e.getThumbnailData());
        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedAt(e.getUpdatedAt());
        r.setStats(calculateStats(e.getProjectDataJson()));
        return r;
    }

    private ProjectResponse toFullResponse(ProjectEntity e) {
        ProjectResponse r = toResponseSummary(e);
        r.setProjectDataJson(e.getProjectDataJson());
        return r;
    }

    private Map<String, Object> calculateStats(String json) {
        Map<String, Object> stats = new HashMap<>();
        if (json != null) {
            int wallCount = countOccurrences(json, "\"startX\"");
            int doorCount = countOccurrences(json, "\"wallId\"");
            int roomCount = countOccurrences(json, "\"floorMaterial\"");
            stats.put("wallCount", wallCount);
            stats.put("doorWindowCount", doorCount);
            stats.put("roomCount", roomCount);
        }
        return stats;
    }

    private int countOccurrences(String str, String findStr) {
        int lastIndex = 0;
        int count = 0;
        while (lastIndex != -1) {
            lastIndex = str.indexOf(findStr, lastIndex);
            if (lastIndex != -1) {
                count++;
                lastIndex += findStr.length();
            }
        }
        return count;
    }
}
