package com.tms.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
public class SystemController {

    @Value("${INSTANCE_NAME:local}")
    private String instanceName;

    @GetMapping("/instance")
    public Map<String, String> instance() {
        return Map.of("instance", instanceName);
    }

}
