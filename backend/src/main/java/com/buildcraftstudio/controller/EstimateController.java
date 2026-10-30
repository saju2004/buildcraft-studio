package com.buildcraftstudio.controller;

import com.buildcraftstudio.service.EstimationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/estimates")
public class EstimateController {

    private final EstimationService estimationService;

    public EstimateController(EstimationService estimationService) {
        this.estimationService = estimationService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculate(@RequestBody Map<String, Object> payload) {
        Map<String, Object> projectData = (Map<String, Object>) payload.getOrDefault("projectData", payload);
        String currency = (String) payload.getOrDefault("currency", "USD");
        Map<String, Double> rates = (Map<String, Double>) payload.get("rates");

        Map<String, Object> estimate = estimationService.calculateEstimate(projectData, currency, rates);
        return ResponseEntity.ok(estimate);
    }
}
