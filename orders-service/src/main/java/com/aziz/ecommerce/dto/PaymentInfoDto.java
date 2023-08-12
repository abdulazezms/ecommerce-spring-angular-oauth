package com.aziz.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentInfoDto {
    //Stripe API uses the lowest denomination. Once cent is the lowest denomination.
    private int amount;
    private String currency;
    private String paymentMethod;
}