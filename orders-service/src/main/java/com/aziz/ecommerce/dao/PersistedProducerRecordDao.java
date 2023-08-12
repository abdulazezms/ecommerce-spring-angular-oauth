package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.PersistedProducerRecord;
import com.aziz.ecommerce.domain.ProducerRecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersistedProducerRecordDao extends JpaRepository<PersistedProducerRecord, Integer> {

    List<PersistedProducerRecord> findAllByStatus(ProducerRecordStatus status);
}
