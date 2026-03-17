package com.crashdetection.dto;

import lombok.Data;

@Data
public class CrashAlertRequest {

    private String vehicleId;
    private double latitude;
    private double longitude;
    private double speed;
    private double impactForce;

}