package com.aziz.ecommerce.controller;

import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.domain.OrderEventStatus;
import com.aziz.ecommerce.dto.PaymentInfoDto;
import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;
import com.aziz.ecommerce.service.CheckoutService;
import com.aziz.ecommerce.service.OrderNotificationService;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;
    private final OrderNotificationService orderNotificationService;

    public CheckoutController(CheckoutService checkoutService, OrderNotificationService orderNotificationService) {
        this.checkoutService = checkoutService;
        this.orderNotificationService = orderNotificationService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoDto paymentInfoDto) throws StripeException {
        this.orderNotificationService.createOrderNotification(
                (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal(),
                OrderEventStatus.IN_PROGRESS);
        return new ResponseEntity<>(checkoutService.createPaymentIntent(paymentInfoDto).toJson(), HttpStatus.OK);
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponseDto> placeOrder(@RequestBody PurchaseRequestDto purchaseRequestDto){
        //notify the user about the order status.
        return new ResponseEntity<>(this.checkoutService.placeOrder(purchaseRequestDto), HttpStatus.CREATED);
    }
}
