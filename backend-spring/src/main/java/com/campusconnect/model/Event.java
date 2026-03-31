package com.campusconnect.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    @TextIndexed
    private String title;

    @TextIndexed
    private String description;

    private String category; // workshop, seminar, cultural, sports, technical, other

    private Instant date;

    private Instant endDate;

    private String venue;

    private int capacity;

    private int registeredCount;

    private String banner;

    private String organizer; // User id

    @TextIndexed
    private List<String> tags = new ArrayList<>();

    private boolean isActive = true;

    private boolean isCancelled;

    private String cancelReason;

    private Instant registrationDeadline;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
