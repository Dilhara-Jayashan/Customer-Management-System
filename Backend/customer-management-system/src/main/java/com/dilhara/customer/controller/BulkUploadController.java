package com.dilhara.customer.controller;

import com.dilhara.customer.dto.BulkUploadResponseDTO;
import com.dilhara.customer.service.BulkUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/customers/bulk")
@RequiredArgsConstructor
@CrossOrigin
public class BulkUploadController {
    
    private final BulkUploadService bulkUploadService;
    
    @PostMapping("/upload")
    public ResponseEntity<BulkUploadResponseDTO> uploadCustomers(@RequestParam("file") MultipartFile file) {
        BulkUploadResponseDTO response = bulkUploadService.uploadCustomersFromExcel(file);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
