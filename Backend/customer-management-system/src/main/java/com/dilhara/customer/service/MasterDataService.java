package com.dilhara.customer.service;

import com.dilhara.customer.dto.CityDTO;
import com.dilhara.customer.dto.CountryDTO;
import com.dilhara.customer.exception.ResourceNotFoundException;
import com.dilhara.customer.model.City;
import com.dilhara.customer.model.Country;
import com.dilhara.customer.repository.CityRepository;
import com.dilhara.customer.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MasterDataService {
    
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    
    @Transactional
    public CountryDTO createCountry(CountryDTO countryDTO) {
        Country country = Country.builder()
                .name(countryDTO.getName())
                .code(countryDTO.getCode())
                .build();
        
        country = countryRepository.save(country);
        return mapCountryToDTO(country);
    }
    
    @Transactional(readOnly = true)
    public List<CountryDTO> getAllCountries() {
        return countryRepository.findAll()
                .stream()
                .map(this::mapCountryToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public CountryDTO getCountryById(Long id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country not found with id " + id));
        return mapCountryToDTO(country);
    }
    
    @Transactional
    public CityDTO createCity(CityDTO cityDTO) {
        Country country = countryRepository.findById(cityDTO.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("Country not found"));
        
        City city = City.builder()
                .name(cityDTO.getName())
                .country(country)
                .build();
        
        city = cityRepository.save(city);
        return mapCityToDTO(city);
    }
    
    @Transactional(readOnly = true)
    public List<CityDTO> getAllCities() {
        return cityRepository.findAll()
                .stream()
                .map(this::mapCityToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CityDTO> getCitiesByCountry(Long countryId) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("Country not found"));
        
        return cityRepository.findAll()
                .stream()
                .filter(city -> city.getCountry().getId().equals(countryId))
                .map(this::mapCityToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public CityDTO getCityById(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id " + id));
        return mapCityToDTO(city);
    }
    
    private CountryDTO mapCountryToDTO(Country country) {
        return CountryDTO.builder()
                .id(country.getId())
                .name(country.getName())
                .code(country.getCode())
                .build();
    }
    
    private CityDTO mapCityToDTO(City city) {
        return CityDTO.builder()
                .id(city.getId())
                .name(city.getName())
                .countryId(city.getCountry().getId())
                .countryName(city.getCountry().getName())
                .build();
    }
}
