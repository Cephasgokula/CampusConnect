package com.campusconnect.repository;

import com.campusconnect.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration, String> {

    Optional<Registration> findByStudentAndEvent(String studentId, String eventId);

    List<Registration> findByStudentAndStatusNotOrderByRegisteredAtDesc(String studentId, String status);

    List<Registration> findByEventAndStatusNotOrderByRegisteredAtDesc(String eventId, String status);
}
