package com.crashdetection.controller;

import com.crashdetection.dto.CrashAlertRequest;
import com.crashdetection.dto.CrashAlertResponse;
import com.crashdetection.model.EmergencyServiceEntity;
import com.crashdetection.service.CrashService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CrashController {

    private final CrashService crashService;

    @PostMapping("/crash")
    public CrashAlertResponse detectCrash(
            @RequestBody CrashAlertRequest request) {

        EmergencyServiceEntity nearest =
                crashService.processCrash(request);

        CrashAlertResponse response = new CrashAlertResponse();
        response.setCrashId(1L); // temp
        response.setStatus("ALERT_TRIGGERED");
        response.setMessage("Nearest: " + nearest.getName());

        return response;
    }
}