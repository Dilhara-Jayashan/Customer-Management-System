package com.dilhara.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    
    private Long id;
    
    @NotBlank(message = "Address Line 1 is required")
    private String addressLine1;
    
    private String addressLine2;
    
    @NotNull(message = "City is required")
    private Long cityId;
    
    private String cityName;
    
    @NotNull(message = "Country is required")
    private Long countryId;
    
    private String countryName;
}
