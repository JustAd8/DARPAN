package com.crashdetection.repository;

import com.crashdetection.model.CrashEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrashEventRepository 
        extends JpaRepository<CrashEvent, Long> {
}