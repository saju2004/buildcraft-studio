package com.buildcraftstudio.controller;

import com.buildcraftstudio.service.AIArchitectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIArchitectController {

    private final AIArchitectService aiArchitectService;

    public AIArchitectController(AIArchitectService aiArchitectService) {
        this.aiArchitectService = aiArchitectService;
    }

    @PostMapping("/plan")
    public ResponseEntity<Map<String, Object>> plan(@RequestBody Map<String, Object> req) {
        String prompt = (String) req.getOrDefault("prompt", "");
        Double plotWidth = req.get("plotWidth") instanceof Number ? ((Number) req.get("plotWidth")).doubleValue() : 15.0;
        Double plotLength = req.get("plotLength") instanceof Number ? ((Number) req.get("plotLength")).doubleValue() : 20.0;
        Integer floors = req.get("floors") instanceof Number ? ((Number) req.get("floors")).intValue() : 2;

        Map<String, Object> proposal = aiArchitectService.planHouse(prompt, plotWidth, plotLength, floors);
        return ResponseEntity.ok(proposal);
    }
}
