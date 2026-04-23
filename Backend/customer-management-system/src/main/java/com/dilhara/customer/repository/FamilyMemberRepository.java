package com.dilhara.customer.repository;

import com.dilhara.customer.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    // Finds and deletes records where this customer is the target family member
    void deleteByFamilyCustomerId(Long familyCustomerId);
}
