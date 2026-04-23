package com.dilhara.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkUploadResponseDTO {
    
    private int totalRecords;
    private int successCount;
    private int failureCount;
    private String message;
}
