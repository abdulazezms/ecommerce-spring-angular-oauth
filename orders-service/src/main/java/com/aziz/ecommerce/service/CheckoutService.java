package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dto.PaymentInfoDto;
import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponseDto placeOrder(PurchaseRequestDto purchaseRequestDto);
    PaymentIntent createPaymentIntent(PaymentInfoDto paymentInfoDto) throws StripeException;

}
