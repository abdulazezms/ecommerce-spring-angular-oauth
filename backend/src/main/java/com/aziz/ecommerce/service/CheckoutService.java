package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;

public interface CheckoutService {
    PurchaseResponseDto placeOrder(PurchaseRequestDto purchaseRequestDto);
}
