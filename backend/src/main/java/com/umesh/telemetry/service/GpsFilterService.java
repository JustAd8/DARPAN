package com.umesh.telemetry.service;

import org.springframework.stereotype.Service;

@Service
public class GpsFilterService {

    private double lastLat = 0;
    private double lastLon = 0;

    private final double alpha = 0.2;

    public double[] smooth(double lat, double lon) {

        if (lastLat == 0 && lastLon == 0) {
            lastLat = lat;
            lastLon = lon;
            return new double[]{lat, lon};
        }

        double filteredLat = alpha * lat + (1 - alpha) * lastLat;
        double filteredLon = alpha * lon + (1 - alpha) * lastLon;

        lastLat = filteredLat;
        lastLon = filteredLon;

        return new double[]{filteredLat, filteredLon};
    }
}