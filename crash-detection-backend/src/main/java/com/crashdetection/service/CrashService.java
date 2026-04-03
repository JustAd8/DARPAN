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
    private final NotificationService notificationService;

    
    public EmergencyServiceEntity processCrash(CrashAlertRequest request) {

        CrashEvent event = CrashEvent.builder()
                .vehicleId(request.getVehicleId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speed(request.getSpeed())
                .impactForce(request.getImpactForce())
                .timestamp(LocalDateTime.now())
                .build();

        crashRepository.save(event);

        EmergencyServiceEntity nearest =
                locationService.findNearest(
                        request.getLatitude(),
                        request.getLongitude()
                );

        //  Send Notification
        String message = "Crash detected at: "
                + request.getLatitude() + ", " + request.getLongitude();

        // FCM token of my android phone
        String dummyToken = "dyHzgPC7SnqrLipCSY5mwy:APA91bF43AW6gWZgFPE4Lv9B7_1vtMJkipK69qDkcLbu5CtF-Tm_R9rTCvCZxmwaIqD-f99Bg2RyQxXw9i1zdwWpCLD5OE8IzG07xERKW9ClGenImiKW0qU"; 

        System.out.println("Sending notification...");
        notificationService.sendCrashAlert(dummyToken, message);

        return nearest;
    }
}