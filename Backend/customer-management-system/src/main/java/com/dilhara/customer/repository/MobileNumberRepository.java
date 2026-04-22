package com.dilhara.customer.repository;

import com.dilhara.customer.model.MobileNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MobileNumberRepository extends JpaRepository<MobileNumber, Long> {
}
