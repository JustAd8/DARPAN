package com.crashdetection.service;

import com.crashdetection.model.EmergencyServiceEntity;
import com.crashdetection.repository.EmergencyServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final EmergencyServiceRepository repository;

    public EmergencyServiceEntity findNearest(double lat, double lon) {
        return repository.findNearest(lat, lon);
    }
}