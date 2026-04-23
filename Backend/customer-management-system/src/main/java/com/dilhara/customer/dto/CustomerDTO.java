package com.dilhara.customer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    
    private Long id;
    
    @NotBlank(message = "Name is mandatory")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Date of birth is mandatory")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "NIC number is mandatory")
    @Size(min = 5, max = 20, message = "NIC number must be between 5 and 20 characters")
    private String nicNumber;
    
    @Valid
    private Set<MobileNumberDTO> mobileNumbers;
    
    @Valid
    private Set<AddressDTO> addresses;
    
    @Valid
    private Set<FamilyMemberDTO> familyMembers;
}
