package com.campusconnect.repository;

import com.campusconnect.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    @Query("{ 'isActive': true, 'category': ?0, 'date': { $gte: ?1, $lte: ?2 } }")
    Page<Event> findActiveByFiltersCategoryAndDate(String category, Instant from, Instant to, Pageable pageable);

    @Query("{ 'isActive': true, 'category': ?0 }")
    Page<Event> findActiveByCategory(String category, Pageable pageable);

    @Query("{ 'isActive': true, 'date': { $gte: ?0, $lte: ?1 } }")
    Page<Event> findActiveByDate(Instant from, Instant to, Pageable pageable);

    @Query("{ 'isActive': true }")
    Page<Event> findAllActive(Pageable pageable);

    @Query("{ $text: { $search: ?0 }, 'isActive': true }")
    Page<Event> searchActive(String search, Pageable pageable);

    List<Event> findAllByOrderByCreatedAtDesc();
}
