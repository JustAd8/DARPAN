package com.umesh.telemetry.model;

public class TelemetryMessage {

    private String deviceId;
    private long seq;
    private long timestampDevice;

    private double lat;
    private double lon;

    public TelemetryMessage() {}

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public long getSeq() {
        return seq;
    }

    public void setSeq(long seq) {
        this.seq = seq;
    }

    public long getTimestampDevice() {
        return timestampDevice;
    }

    public void setTimestampDevice(long timestampDevice) {
        this.timestampDevice = timestampDevice;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }
}