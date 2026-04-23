package com.dilhara.customer.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.dilhara.customer.dto.CustomerDTO;
import com.dilhara.customer.exception.DuplicateNICException;
import com.dilhara.customer.exception.ResourceNotFoundException;
import com.dilhara.customer.model.Customer;
import com.dilhara.customer.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock private CustomerRepository customerRepository;
    @Mock private MobileNumberRepository mobileNumberRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private FamilyMemberRepository familyMemberRepository;
    @Mock private CityRepository cityRepository;
    @Mock private CountryRepository countryRepository;

    @InjectMocks
    private CustomerService customerService;

    // ─── CREATE CUSTOMER TESTS ──────────────────────────────────────────

    @Test
    void createCustomer_Success() {
        // Arrange
        CustomerDTO requestDTO = new CustomerDTO();
        requestDTO.setName("John Doe");
        requestDTO.setNicNumber("123456789V");

        Customer savedCustomer = new Customer();
        savedCustomer.setId(1L);
        savedCustomer.setName("John Doe");
        savedCustomer.setNicNumber("123456789V");

        when(customerRepository.findByNicNumber("123456789V")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);

        // Act
        CustomerDTO result = customerService.createCustomer(requestDTO);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Doe", result.getName());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_DuplicateNIC_ThrowsException() {
        // Arrange
        CustomerDTO requestDTO = new CustomerDTO();
        requestDTO.setNicNumber("DuplicateNIC");

        when(customerRepository.findByNicNumber("DuplicateNIC")).thenReturn(Optional.of(new Customer()));

        // Act & Assert
        assertThrows(DuplicateNICException.class, () -> customerService.createCustomer(requestDTO));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    // ─── UPDATE CUSTOMER TESTS ──────────────────────────────────────────

    @Test
    void updateCustomer_Success() {
        // Arrange
        Long customerId = 1L;
        CustomerDTO requestDTO = new CustomerDTO();
        requestDTO.setName("Updated Name");
        requestDTO.setNicNumber("NewNIC");

        Customer existingCustomer = new Customer();
        existingCustomer.setId(customerId);
        existingCustomer.setNicNumber("OldNIC");
        // Initialize empty collections so .clear() doesn't throw NullPointerException
        existingCustomer.setMobileNumbers(new HashSet<>());
        existingCustomer.setAddresses(new HashSet<>());
        existingCustomer.setFamilyMembers(new HashSet<>());

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.existsByNicNumberAndIdNot("NewNIC", customerId)).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

        // Act
        CustomerDTO result = customerService.updateCustomer(customerId, requestDTO);

        // Assert
        assertNotNull(result);
        verify(customerRepository, times(1)).save(existingCustomer);
    }

    @Test
    void updateCustomer_DuplicateNIC_ThrowsException() {
        // Arrange
        Customer existingCustomer = new Customer();
        existingCustomer.setId(1L);
        existingCustomer.setNicNumber("OldNIC");

        CustomerDTO requestDTO = new CustomerDTO();
        requestDTO.setNicNumber("TakenNIC");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.existsByNicNumberAndIdNot("TakenNIC", 1L)).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateNICException.class, () -> customerService.updateCustomer(1L, requestDTO));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    // ─── GET CUSTOMER TESTS ─────────────────────────────────────────────

    @Test
    void getCustomerById_Success() {
        // Arrange
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("Jane Doe");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        // Act
        CustomerDTO result = customerService.getCustomerById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Jane Doe", result.getName());
    }

    @Test
    void getCustomerById_NotFound_ThrowsException() {
        // Arrange
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomerById(99L));
    }

    // ─── DELETE CUSTOMER TESTS ──────────────────────────────────────────

    @Test
    void deleteCustomer_Success() {
        // Arrange
        Customer customer = new Customer();
        customer.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        // Act
        customerService.deleteCustomer(1L);

        // Assert
        // Verify that family members linked to this customer are deleted first
        verify(familyMemberRepository, times(1)).deleteByFamilyCustomerId(1L);
        // Verify the customer itself is deleted
        verify(customerRepository, times(1)).delete(customer);
    }

    // ─── GET ALL CUSTOMERS TEST ─────────────────────────────────────────

    @Test
    void getAllCustomers_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("List User");

        Page<Customer> customerPage = new PageImpl<>(java.util.Collections.singletonList(customer));
        when(customerRepository.findAll(pageable)).thenReturn(customerPage);

        // Act
        Page<CustomerDTO> result = customerService.getAllCustomers(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("List User", result.getContent().get(0).getName());
        verify(customerRepository, times(1)).findAll(pageable);
    }
}