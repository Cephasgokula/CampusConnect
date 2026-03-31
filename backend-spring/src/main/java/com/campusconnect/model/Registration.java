package com.campusconnect.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "registrations")
@CompoundIndex(name = "student_event_idx", def = "{'student': 1, 'event': 1}", unique = true)
public class Registration {

    @Id
    private String id;

    private String student; // User id

    private String event; // Event id

    private String status = "registered"; // registered, cancelled, attended

    private Instant registeredAt = Instant.now();

    private Instant checkedInAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
