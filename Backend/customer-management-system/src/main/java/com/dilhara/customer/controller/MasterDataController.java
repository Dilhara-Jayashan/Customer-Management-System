package com.dilhara.customer.controller;

import com.dilhara.customer.dto.CityDTO;
import com.dilhara.customer.dto.CountryDTO;
import com.dilhara.customer.service.MasterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
@CrossOrigin
public class MasterDataController {
    
    private final MasterDataService masterDataService;
    
   
    @GetMapping("/countries")
    public ResponseEntity<List<CountryDTO>> getAllCountries() {
        List<CountryDTO> countries = masterDataService.getAllCountries();
        return new ResponseEntity<>(countries, HttpStatus.OK);
    }
    
    @GetMapping("/countries/{id}")
    public ResponseEntity<CountryDTO> getCountry(@PathVariable Long id) {
        CountryDTO country = masterDataService.getCountryById(id);
        return new ResponseEntity<>(country, HttpStatus.OK);
    }


    
    @GetMapping("/cities")
    public ResponseEntity<List<CityDTO>> getAllCities() {
        List<CityDTO> cities = masterDataService.getAllCities();
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }
    
    @GetMapping("/cities/country/{countryId}")
    public ResponseEntity<List<CityDTO>> getCitiesByCountry(@PathVariable Long countryId) {
        List<CityDTO> cities = masterDataService.getCitiesByCountry(countryId);
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }
    
    @GetMapping("/cities/{id}")
    public ResponseEntity<CityDTO> getCity(@PathVariable Long id) {
        CityDTO city = masterDataService.getCityById(id);
        return new ResponseEntity<>(city, HttpStatus.OK);
    }
}
