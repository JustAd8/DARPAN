package com.crashdetection.repository;

import com.crashdetection.model.EmergencyServiceEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface EmergencyServiceRepository 
        extends JpaRepository<EmergencyServiceEntity, Long> {

    @Query(value = """
        SELECT * FROM emergency_service_entity
        ORDER BY location <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
        LIMIT 1
        """, nativeQuery = true)
    EmergencyServiceEntity findNearest(
            @Param("lat") double lat,
            @Param("lon") double lon
    );
}