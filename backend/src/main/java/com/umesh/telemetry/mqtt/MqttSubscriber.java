//Connects to Mosquitto and forwards to processor

package com.umesh.telemetry.mqtt;

import com.umesh.telemetry.service.TelemetryProcessor;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Component;

@Component
public class MqttSubscriber {

    private final TelemetryProcessor processor;

    public MqttSubscriber(TelemetryProcessor processor) {
        this.processor = processor;
    }

    @PostConstruct
    public void init() throws Exception {

        MqttClient client = new MqttClient(
                "tcp://localhost:1883",
                MqttClient.generateClientId()
        );

        client.connect();

        client.subscribe("vehicle/telemetry", (topic, message) -> {

            String payload = new String(message.getPayload());

            processor.process(payload);
        });

        System.out.println("MQTT subscriber connected");
    }
}