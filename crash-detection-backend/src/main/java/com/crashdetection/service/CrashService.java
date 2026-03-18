package com.crashdetection.service;

import com.crashdetection.dto.CrashAlertRequest;
import com.crashdetection.model.CrashEvent;
import com.crashdetection.model.EmergencyServiceEntity;
import com.crashdetection.repository.CrashEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CrashService {

    private final CrashEventRepository crashRepository;
    private final LocationService locationService;

    public EmergencyServiceEntity processCrash(CrashAlertRequest request) {

        CrashEvent event = CrashEvent.builder()
                .vehicleId(request.getVehicleId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speed(request.getSpeed())
                .impactForce(request.getImpactForce())
                .timestamp(LocalDateTime.now())
                .build();

        CrashEvent saved = crashRepository.save(event);

        // 🔥 Find nearest emergency service
        EmergencyServiceEntity nearest = locationService.findNearest(
                request.getLatitude(),
                request.getLongitude()
        );

        return nearest;
    }
}