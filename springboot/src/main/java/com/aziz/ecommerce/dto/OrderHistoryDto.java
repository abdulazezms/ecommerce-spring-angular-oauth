package com.aziz.ecommerce.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryDto {
    private Date dateCreated;
    private String orderTrackingNumber;
    private BigDecimal totalPrice;
    private Long totalQuantity;
    private String status;
}
