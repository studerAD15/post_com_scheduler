package com.postscheduler.backend.repository;

import com.postscheduler.backend.model.Draft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DraftRepository extends JpaRepository<Draft, String> {
    List<Draft> findAllByOrderByCreatedAtDesc();
}
