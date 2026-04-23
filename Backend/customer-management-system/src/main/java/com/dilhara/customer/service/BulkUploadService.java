package com.dilhara.customer.service;

import com.dilhara.customer.dto.BulkUploadResponseDTO;
import com.dilhara.customer.dto.CustomerDTO;
import com.dilhara.customer.dto.MobileNumberDTO;
import com.dilhara.customer.exception.BulkUploadException;
import com.dilhara.customer.exception.DuplicateNICException;
import com.dilhara.customer.model.Customer;
import com.dilhara.customer.model.MobileNumber;
import com.dilhara.customer.repository.CustomerRepository;
import com.dilhara.customer.repository.MobileNumberRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BulkUploadService {
    
    private static final int BATCH_SIZE = 100;
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    
    private final CustomerRepository customerRepository;
    private final MobileNumberRepository mobileNumberRepository;

    @Transactional
    public BulkUploadResponseDTO uploadCustomersFromExcel(MultipartFile file) {
        BulkUploadResponseDTO response = new BulkUploadResponseDTO();

        try {
            validateFile(file);
            List<CustomerDTO> customers = parseExcelFile(file);
            response.setTotalRecords(customers.size());

            int successCount = 0;
            int failureCount = 0;

            List<Customer> batchToSave = new ArrayList<>();
            List<CustomerDTO> batchDTOs = new ArrayList<>(); // Track DTOs perfectly in parallel
            Set<String> processedNICs = new HashSet<>();

            for (CustomerDTO customerDTO : customers) {
                try {
                    validateCustomerDTO(customerDTO);

                    if (processedNICs.contains(customerDTO.getNicNumber())) {
                        throw new DuplicateNICException("Duplicate NIC in file: " + customerDTO.getNicNumber());
                    }
                    if (customerRepository.findByNicNumber(customerDTO.getNicNumber()).isPresent()) {
                        throw new DuplicateNICException("Customer with NIC " + customerDTO.getNicNumber() + " already exists");
                    }

                    Customer customer = new Customer();
                    customer.setName(customerDTO.getName());
                    customer.setDateOfBirth(customerDTO.getDateOfBirth());
                    customer.setNicNumber(customerDTO.getNicNumber());

                    batchToSave.add(customer);
                    batchDTOs.add(customerDTO);
                    processedNICs.add(customerDTO.getNicNumber());

                    // Save in batches of 100
                    if (batchToSave.size() >= BATCH_SIZE) {
                        List<Customer> savedCustomers = customerRepository.saveAll(batchToSave);
                        for (int j = 0; j < savedCustomers.size(); j++) {
                            if (batchDTOs.get(j).getMobileNumbers() != null) {
                                saveMobileNumbers(savedCustomers.get(j), batchDTOs.get(j).getMobileNumbers());
                            }
                        }
                        successCount += batchToSave.size();
                        batchToSave.clear();
                        batchDTOs.clear();
                    }
                } catch (Exception e) {
                    failureCount++;
                }
            }

            // Save remaining leftover batch safely
            if (!batchToSave.isEmpty()) {
                List<Customer> savedCustomers = customerRepository.saveAll(batchToSave);
                for (int j = 0; j < savedCustomers.size(); j++) {
                    if (batchDTOs.get(j).getMobileNumbers() != null) {
                        saveMobileNumbers(savedCustomers.get(j), batchDTOs.get(j).getMobileNumbers());
                    }
                }
                successCount += batchToSave.size();
            }

            response.setSuccessCount(successCount);
            response.setFailureCount(failureCount);
            response.setMessage(String.format("Bulk upload completed. Success: %d, Failure: %d", successCount, failureCount));

        } catch (Exception e) {
            throw new BulkUploadException("Error processing bulk upload: " + e.getMessage(), e);
        }
        return response;
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BulkUploadException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BulkUploadException("File size exceeds maximum limit of 10MB");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
            throw new BulkUploadException("File must be in Excel format (.xlsx or .xls)");
        }
    }
    
    private List<CustomerDTO> parseExcelFile(MultipartFile file) throws Exception {
        List<CustomerDTO> customers = new ArrayList<>();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip header row
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                
                if (row == null) {
                    continue;
                }
                
                try {
                    CustomerDTO customer = new CustomerDTO();
                    
                    // Read mandatory fields
                    String name = getCellValueAsString(row.getCell(0));
                    if (name == null || name.trim().isEmpty()) {
                        continue; // Skip empty rows
                    }
                    customer.setName(name);
                    
                    LocalDate dateOfBirth = getCellValueAsDate(row.getCell(1));
                    if (dateOfBirth == null) {
                        throw new Exception("Date of birth is mandatory");
                    }
                    customer.setDateOfBirth(dateOfBirth);
                    
                    String nicNumber = getCellValueAsString(row.getCell(2));
                    if (nicNumber == null || nicNumber.trim().isEmpty()) {
                        throw new Exception("NIC number is mandatory");
                    }
                    customer.setNicNumber(nicNumber);
                    
                    // Read optional mobile numbers
                    String mobile = getCellValueAsString(row.getCell(3));
                    if (mobile != null && !mobile.trim().isEmpty()) {
                        Set<MobileNumberDTO> mobiles = new HashSet<>();
                        mobiles.add(MobileNumberDTO.builder().number(mobile).build());
                        customer.setMobileNumbers(mobiles);
                    }
                    
                    customers.add(customer);
                    
                } catch (Exception e) {
                    // Skip problematic rows and continue
                    continue;
                }
            }
        }
        
        return customers;
    }
    
    private void validateCustomerDTO(CustomerDTO customerDTO) {
        if (customerDTO.getName() == null || customerDTO.getName().trim().isEmpty()) {
            throw new BulkUploadException("Name is mandatory");
        }
        
        if (customerDTO.getDateOfBirth() == null) {
            throw new BulkUploadException("Date of birth is mandatory");
        }
        
        if (customerDTO.getNicNumber() == null || customerDTO.getNicNumber().trim().isEmpty()) {
            throw new BulkUploadException("NIC number is mandatory");
        }
    }
    
    private String getCellValueAsString(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            default:
                return null;
        }
    }
    
    private LocalDate getCellValueAsDate(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) {
            return null;
        }
        
        try {
            if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                return cell.getDateCellValue()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
            } else if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                String dateStr = cell.getStringCellValue();
                return LocalDate.parse(dateStr);
            }
        } catch (Exception e) {
            return null;
        }
        
        return null;
    }
    
    private void saveMobileNumbers(Customer customer, Set<MobileNumberDTO> mobileNumbers) {
        if (mobileNumbers != null && !mobileNumbers.isEmpty()) {
            List<MobileNumber> mobiles = new ArrayList<>();
            for (MobileNumberDTO mobileDTO : mobileNumbers) {
                mobiles.add(MobileNumber.builder()
                        .number(mobileDTO.getNumber())
                        .customer(customer)
                        .build());
            }
            mobileNumberRepository.saveAll(mobiles);
        }
    }
}
