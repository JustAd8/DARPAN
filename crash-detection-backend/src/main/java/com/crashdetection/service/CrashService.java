package com.crashdetection.service;

import com.crashdetection.dto.CrashAlertRequest;
import com.crashdetection.model.CrashEvent;
import com.crashdetection.repository.CrashEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CrashService {

    private final CrashEventRepository repository;

    public CrashEvent saveCrash(CrashAlertRequest request) {

        CrashEvent event = CrashEvent.builder()
                .vehicleId(request.getVehicleId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speed(request.getSpeed())
                .impactForce(request.getImpactForce())
                .timestamp(LocalDateTime.now())
                .build();

        return repository.save(event);
    }
}