package com.crashdetection.controller;

import com.crashdetection.dto.CrashAlertRequest;
import com.crashdetection.dto.CrashAlertResponse;
import com.crashdetection.model.CrashEvent;
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

        CrashEvent savedEvent = crashService.saveCrash(request);

        CrashAlertResponse response = new CrashAlertResponse();
        response.setCrashId(savedEvent.getId());
        response.setStatus("RECORDED");
        response.setMessage("Crash event saved");

        return response;
    }
}