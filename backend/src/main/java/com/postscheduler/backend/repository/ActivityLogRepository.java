package com.postscheduler.backend.repository;

import com.postscheduler.backend.model.ActivityLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLogEntry, String> {
    List<ActivityLogEntry> findAllByOrderByTimestampDesc();
}
