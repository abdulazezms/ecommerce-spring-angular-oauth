package com.aziz.ecommerce.dto;


import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class PurchaseResponseDto {
    private String orderTrackingNumber;
}
