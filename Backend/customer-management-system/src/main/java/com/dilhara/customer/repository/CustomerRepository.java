package com.dilhara.customer.repository;

import com.dilhara.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByNicNumber(String nicNumber);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.nicNumber = :nicNumber AND c.id != :customerId")
    boolean existsByNicNumberAndIdNot(@Param("nicNumber") String nicNumber, @Param("customerId") Long customerId);
}
