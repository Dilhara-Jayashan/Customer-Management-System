package com.dilhara.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileNumberDTO {

    private Long id;

    @NotBlank(message = "Mobile number is required")
    @Size(min = 7, max = 10, message = "Mobile number must be between 7 and 10 characters")
    private String number;
}
