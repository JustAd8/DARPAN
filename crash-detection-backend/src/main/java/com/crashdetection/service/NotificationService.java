// this particular file is connected with the firebase. 
//These codes are the basically the core logic of the firebase - notification system  

package com.crashdetection.service;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendCrashAlert(String token, String messageBody) {

        Message message = Message.builder()
                .setToken(token)
                .setNotification(
                        Notification.builder()
                                .setTitle("🚨 Crash Alert")
                                .setBody(messageBody)
                                .build()
                )
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Notification sent: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}