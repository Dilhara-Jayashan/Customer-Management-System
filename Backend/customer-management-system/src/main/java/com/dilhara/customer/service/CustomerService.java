package com.dilhara.customer.service;

import com.dilhara.customer.dto.*;
import com.dilhara.customer.exception.DuplicateNICException;
import com.dilhara.customer.exception.ResourceNotFoundException;
import com.dilhara.customer.model.*;
import com.dilhara.customer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final MobileNumberRepository mobileNumberRepository;
    private final AddressRepository addressRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        // Check for duplicate NIC
        if (customerRepository.findByNicNumber(customerDTO.getNicNumber()).isPresent()) {
            throw new DuplicateNICException("A customer with NIC number " + customerDTO.getNicNumber() + " already exists");
        }
        
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setNicNumber(customerDTO.getNicNumber());

        final Customer savedCustomer = customerRepository.save(customer);
        
        // Add mobile numbers
        if (customerDTO.getMobileNumbers() != null && !customerDTO.getMobileNumbers().isEmpty()) {
            Set<MobileNumber> mobileNumbers = customerDTO.getMobileNumbers()
                    .stream()
                    .map(mobileDTO -> MobileNumber.builder()
                            .number(mobileDTO.getNumber())
                            .customer(savedCustomer)
                            .build())
                    .collect(Collectors.toSet());
            mobileNumberRepository.saveAll(mobileNumbers);
            savedCustomer.setMobileNumbers(mobileNumbers);
        }
        
        // Add addresses
        if (customerDTO.getAddresses() != null && !customerDTO.getAddresses().isEmpty()) {
            Set<Address> addresses = customerDTO.getAddresses()
                    .stream()
                    .map(addressDTO -> {
                        City city = cityRepository.findById(addressDTO.getCityId())
                                .orElseThrow(() -> new ResourceNotFoundException("City not found"));
                        Country country = countryRepository.findById(addressDTO.getCountryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Country not found"));
                        
                        return Address.builder()
                                .addressLine1(addressDTO.getAddressLine1())
                                .addressLine2(addressDTO.getAddressLine2())
                                .city(city)
                                .country(country)
                                .customer(savedCustomer)
                                .build();
                    })
                    .collect(Collectors.toSet());
            addressRepository.saveAll(addresses);
            savedCustomer.setAddresses(addresses);
        }
        
        // Add family members
        if (customerDTO.getFamilyMembers() != null && !customerDTO.getFamilyMembers().isEmpty()) {
            Set<FamilyMember> familyMembers = customerDTO.getFamilyMembers()
                    .stream()
                    .map(familyDTO -> {
                        Customer familyCustomer = customerRepository.findById(familyDTO.getFamilyCustomerId())
                                .orElseThrow(() -> new ResourceNotFoundException("Family member customer not found"));
                        
                        return FamilyMember.builder()
                                .customer(savedCustomer)
                                .familyCustomer(familyCustomer)
                                .relationship(familyDTO.getRelationship())
                                .build();
                    })
                    .collect(Collectors.toSet());
            familyMemberRepository.saveAll(familyMembers);
            savedCustomer.setFamilyMembers(familyMembers);
        }
        
        return mapToDTO(savedCustomer);
    }
    
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        
        // Check for duplicate NIC if NIC is being changed
        if (!customer.getNicNumber().equals(customerDTO.getNicNumber()) &&
                customerRepository.existsByNicNumberAndIdNot(customerDTO.getNicNumber(), id)) {
            throw new DuplicateNICException("A customer with NIC number " + customerDTO.getNicNumber() + " already exists");
        }
        
        customer.setName(customerDTO.getName());
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setNicNumber(customerDTO.getNicNumber());
        
        // Update mobile numbers - Fix: Copy before clearing
        Set<MobileNumber> oldMobileNumbers = new java.util.HashSet<>(customer.getMobileNumbers());
        customer.getMobileNumbers().clear();
        mobileNumberRepository.deleteAllInBatch(oldMobileNumbers);
        
        if (customerDTO.getMobileNumbers() != null && !customerDTO.getMobileNumbers().isEmpty()) {
            Set<MobileNumber> mobileNumbers = customerDTO.getMobileNumbers()
                    .stream()
                    .map(mobileDTO -> MobileNumber.builder()
                            .number(mobileDTO.getNumber())
                            .customer(customer)
                            .build())
                    .collect(Collectors.toSet());
            mobileNumberRepository.saveAll(mobileNumbers);
            customer.setMobileNumbers(mobileNumbers);
        }
        
        // Update addresses - Fix: Copy before clearing
        Set<Address> oldAddresses = new java.util.HashSet<>(customer.getAddresses());
        customer.getAddresses().clear();
        addressRepository.deleteAllInBatch(oldAddresses);
        
        if (customerDTO.getAddresses() != null && !customerDTO.getAddresses().isEmpty()) {
            Set<Address> addresses = customerDTO.getAddresses()
                    .stream()
                    .map(addressDTO -> {
                        City city = cityRepository.findById(addressDTO.getCityId())
                                .orElseThrow(() -> new ResourceNotFoundException("City not found"));
                        Country country = countryRepository.findById(addressDTO.getCountryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Country not found"));
                        
                        return Address.builder()
                                .addressLine1(addressDTO.getAddressLine1())
                                .addressLine2(addressDTO.getAddressLine2())
                                .city(city)
                                .country(country)
                                .customer(customer)
                                .build();
                    })
                    .collect(Collectors.toSet());
            addressRepository.saveAll(addresses);
            customer.setAddresses(addresses);
        }
        
        // Update family members - Fix: Copy before clearing
        Set<FamilyMember> oldFamilyMembers = new java.util.HashSet<>(customer.getFamilyMembers());
        customer.getFamilyMembers().clear();
        familyMemberRepository.deleteAllInBatch(oldFamilyMembers);
        
        if (customerDTO.getFamilyMembers() != null && !customerDTO.getFamilyMembers().isEmpty()) {
            Set<FamilyMember> familyMembers = customerDTO.getFamilyMembers()
                    .stream()
                    .map(familyDTO -> {
                        Customer familyCustomer = customerRepository.findById(familyDTO.getFamilyCustomerId())
                                .orElseThrow(() -> new ResourceNotFoundException("Family member customer not found"));
                        
                        return FamilyMember.builder()
                                .customer(customer)
                                .familyCustomer(familyCustomer)
                                .relationship(familyDTO.getRelationship())
                                .build();
                    })
                    .collect(Collectors.toSet());
            familyMemberRepository.saveAll(familyMembers);
            customer.setFamilyMembers(familyMembers);
        }
        
        final Customer updatecustomer = customerRepository.save(customer);
        return mapToDTO(updatecustomer);
    }
    
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        return mapToDTO(customer);
    }
    
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        customerRepository.delete(customer);
    }
    
    private CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setNicNumber(customer.getNicNumber());
        
        if (customer.getMobileNumbers() != null && !customer.getMobileNumbers().isEmpty()) {
            dto.setMobileNumbers(customer.getMobileNumbers()
                    .stream()
                    .map(m -> MobileNumberDTO.builder()
                            .id(m.getId())
                            .number(m.getNumber())
                            .build())
                    .collect(Collectors.toSet()));
        }
        
        if (customer.getAddresses() != null && !customer.getAddresses().isEmpty()) {
            dto.setAddresses(customer.getAddresses()
                    .stream()
                    .map(a -> AddressDTO.builder()
                            .id(a.getId())
                            .addressLine1(a.getAddressLine1())
                            .addressLine2(a.getAddressLine2())
                            .cityId(a.getCity().getId())
                            .cityName(a.getCity().getName())
                            .countryId(a.getCountry().getId())
                            .countryName(a.getCountry().getName())
                            .build())
                    .collect(Collectors.toSet()));
        }
        
        if (customer.getFamilyMembers() != null && !customer.getFamilyMembers().isEmpty()) {
            dto.setFamilyMembers(customer.getFamilyMembers()
                    .stream()
                    .map(f -> FamilyMemberDTO.builder()
                            .id(f.getId())
                            .familyCustomerId(f.getFamilyCustomer().getId())
                            .familyCustomerName(f.getFamilyCustomer().getName())
                            .relationship(f.getRelationship())
                            .build())
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
}
