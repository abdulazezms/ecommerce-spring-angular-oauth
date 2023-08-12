package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.PersistedProducerRecordDao;
import com.aziz.ecommerce.domain.PersistedProducerRecord;
import com.aziz.ecommerce.domain.ProducerRecordStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersistedProducerRecordServiceImpl implements PersistedProducerRecordService {

    private final PersistedProducerRecordDao persistedProducerRecordDao;

    public PersistedProducerRecordServiceImpl(PersistedProducerRecordDao persistedProducerRecordDao) {
        this.persistedProducerRecordDao = persistedProducerRecordDao;
    }

    @Override
    public void save(PersistedProducerRecord persistedProducerRecord) {
        this.persistedProducerRecordDao.save(persistedProducerRecord);
    }

    @Override
    public List<PersistedProducerRecord> findAllByStatus(ProducerRecordStatus status) {
        return this.persistedProducerRecordDao.findAllByStatus(status);
    }
}
