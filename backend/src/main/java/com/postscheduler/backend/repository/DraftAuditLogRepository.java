package com.postscheduler.backend.repository;

import com.postscheduler.backend.model.DraftAuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DraftAuditLogRepository extends JpaRepository<DraftAuditLogEntry, String> {
}
