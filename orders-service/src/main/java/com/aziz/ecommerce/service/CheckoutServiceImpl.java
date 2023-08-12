package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.CustomerDao;
import com.aziz.ecommerce.domain.*;
import com.aziz.ecommerce.dto.PaymentInfoDto;
import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;
import com.aziz.ecommerce.producer.OrderEventsProducer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CustomerService customerService;

    private final OrderNotificationService orderNotificationService;


    public CheckoutServiceImpl(CustomerService customerService,
                               @Value("${stripe.key.secret}") String secretKey,
                                OrderNotificationService orderNotificationService) {
        Stripe.apiKey = secretKey;
        this.customerService = customerService;
        this.orderNotificationService = orderNotificationService;
    }

    /**
     * place a new order for a given authenticated customer.
     * If the customer doesn't exist, a new one will be created based on the unique email.
     * @param purchaseRequestDto
     * @return
     */

    @Override
    @Transactional
    public PurchaseResponseDto placeOrder(PurchaseRequestDto purchaseRequestDto) {
        Jwt authenticationPrincipal = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = authenticationPrincipal.getSubject();

        //storing the user in case we have a new user.
        Customer customer = customerService.findByEmail(email).orElseGet(() -> customerService.save(Customer.builder().email(email).build()));

        Order order = purchaseRequestDto.getOrder();
        String orderTrackingNumber = UUID.randomUUID().toString();
        order.setStatus(OrderEventStatus.CONFIRMED.name());
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchaseRequestDto.getOrderItems();
        orderItems.forEach(order::add);

        order.setBillingAddress(purchaseRequestDto.getBillingAddress());
        order.setShippingAddress(purchaseRequestDto.getShippingAddress());

        customer.add(order);
        customerService.save(customer);
        orderNotificationService.createOrderNotification(authenticationPrincipal, OrderEventStatus.CONFIRMED);
        return PurchaseResponseDto.builder().orderTrackingNumber(orderTrackingNumber).build();
    }

    /**
     * Place a payment intent. A payment intent is all about the payment components: payment method, amount, currency, etc.
     * @param paymentInfoDto: the components of a payment intent.
     * @return a payment intent object that includes a client secret; a unique key generated by the payment
     * processor for this payment intent, to be used for making the actual transaction in the next request.
     * @throws StripeException:
     */

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfoDto paymentInfoDto) throws StripeException {
        System.out.println("Creating the payment intent");
        Map<String, Object> parameters = Map.of(
                "payment_method_types", List.of(paymentInfoDto.getPaymentMethod()),
                "amount", paymentInfoDto.getAmount(),
                "currency", paymentInfoDto.getCurrency(),
                "description", "ecommerce app purchase"
        );
        //calling stripe service to retrieve a payment intent populated with the client secret.
        return PaymentIntent.create(parameters);
    }


}