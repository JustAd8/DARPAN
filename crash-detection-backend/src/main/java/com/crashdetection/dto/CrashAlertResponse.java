package com.crashdetection.dto;

import lombok.Data;

@Data
public class CrashAlertResponse {

    private Long crashId;
    private String status;
    private String message;

}