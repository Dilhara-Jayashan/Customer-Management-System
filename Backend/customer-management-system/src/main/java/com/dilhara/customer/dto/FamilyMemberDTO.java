package com.dilhara.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {
    
    private Long id;
    
    @NotNull(message = "Family member customer ID is required")
    private Long familyCustomerId;
    
    private String familyCustomerName;
    
    private String relationship;
}
