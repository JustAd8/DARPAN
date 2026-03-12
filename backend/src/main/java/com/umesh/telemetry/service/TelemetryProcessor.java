
package com.umesh.telemetry.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umesh.telemetry.model.TelemetryMessage;
import com.umesh.telemetry.websocket.TelemetryWebSocketHandler;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
-
@Service
public class TelemetryProcessor {

    private final ObjectMapper mapper = new ObjectMapper();
    private final TelemetryWebSocketHandler webSocketHandler;
    private final GpsFilterService gpsFilter;

    // Track last sequence per device
    private final ConcurrentHashMap<String, Long> lastSeqMap = new ConcurrentHashMap<>();

    // Track last position per device
    private final ConcurrentHashMap<String, Double> lastLatMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Double> lastLonMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lastTimeMap = new ConcurrentHashMap<>();

    public TelemetryProcessor(
            TelemetryWebSocketHandler webSocketHandler,
            GpsFilterService gpsFilter) {

        this.webSocketHandler = webSocketHandler;
        this.gpsFilter = gpsFilter;
    }

    public void process(String payload) {

        try {

            TelemetryMessage msg =
                    mapper.readValue(payload, TelemetryMessage.class);

            long serverTime = System.currentTimeMillis();
            long latency = serverTime - msg.getTimestampDevice();

            String deviceId = msg.getDeviceId();

            //Packet Loss detection

            Long lastSeq = lastSeqMap.get(deviceId);

            if (lastSeq != null && msg.getSeq() != lastSeq + 1) {

                long lost = msg.getSeq() - lastSeq - 1;

                System.out.println(
                        "Packet loss detected for "
                                + deviceId +
                                " lost=" + lost
                );
            }

            lastSeqMap.put(deviceId, msg.getSeq());

            //GPS smoothening

            double[] filtered = gpsFilter.smooth(
                    msg.getLat(),
                    msg.getLon()
            );

            double lat = filtered[0];
            double lon = filtered[1];

            //for speed calculation

            double speed = 0;

            Double lastLat = lastLatMap.get(deviceId);
            Double lastLon = lastLonMap.get(deviceId);
            Long lastTime = lastTimeMap.get(deviceId);

            if (lastLat != null && lastLon != null && lastTime != null) {

                double distance =
                        haversine(lastLat, lastLon, lat, lon);

                long timeDiff = serverTime - lastTime;

                if (timeDiff > 0) {

                    speed = (distance / timeDiff) * 3600;
                }
            }

            lastLatMap.put(deviceId, lat);
            lastLonMap.put(deviceId, lon);
            lastTimeMap.put(deviceId, serverTime);

            //enriched telemetry message

            String enriched =
                    "{"
                            + "\"deviceId\":\"" + deviceId + "\","
                            + "\"seq\":" + msg.getSeq() + ","
                            + "\"latency\":" + latency + ","
                            + "\"lat\":" + lat + ","
                            + "\"lon\":" + lon + ","
                            + "\"speed\":" + speed
                            + "}";

            webSocketHandler.broadcast(enriched);

            System.out.println("Processed: " + enriched);

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
    
    // Haversine distance function
    private double haversine(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final int R = 6371000;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(Math.toRadians(lat1)) *
                                Math.cos(Math.toRadians(lat2)) *
                                Math.sin(dLon / 2) *
                                Math.sin(dLon / 2);

        double c =
                2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
