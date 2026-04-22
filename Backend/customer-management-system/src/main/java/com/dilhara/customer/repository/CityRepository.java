package com.dilhara.customer.repository;

import com.dilhara.customer.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT c FROM City c WHERE c.name = :name AND c.country.id = :countryId")
    Optional<City> findByNameAndCountryId(@Param("name") String name, @Param("countryId") Long countryId);
}
