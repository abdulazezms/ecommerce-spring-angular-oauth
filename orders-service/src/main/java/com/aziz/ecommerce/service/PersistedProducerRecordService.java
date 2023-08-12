package com.aziz.ecommerce.service;

import com.aziz.ecommerce.domain.PersistedProducerRecord;
import com.aziz.ecommerce.domain.ProducerRecordStatus;

import java.util.List;

public interface PersistedProducerRecordService {
    void save(PersistedProducerRecord persistedProducerRecord);
    List<PersistedProducerRecord> findAllByStatus(ProducerRecordStatus status);
}
