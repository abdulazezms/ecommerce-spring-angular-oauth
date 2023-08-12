package com.aziz.ecommerce.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
public class OrderHistoryDto {
    private Date dateCreated;
    private String orderTrackingNumber;
    private BigDecimal totalPrice;
    private Long totalQuantity;
    private String status;
}
