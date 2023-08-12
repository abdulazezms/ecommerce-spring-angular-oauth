package com.aziz.notificationsservice.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;


@RequiredArgsConstructor
@Slf4j
@Component
public class EmailMessagingUtils {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;


    public void sendMailOrderStatus(String to, String status) {

        log.info("Sending email to {}", to);

        String domainName = fromEmail.substring(fromEmail.lastIndexOf("@"));
        String noReply = "Ecommerce <noreply" + domainName + ">";

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            System.out.println("Sending the mail now");
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setText("", buildBody(to, status));
            helper.setFrom(noReply);
            helper.setTo(to);
            helper.setSubject("Your order status at the Ecommerce App");
            helper.setReplyTo(noReply);
            mailSender.send(mimeMessage);
            System.out.println("Email has been sent");
        } catch (MessagingException e) {
            throw new MailSendException("Mail sending operation failed: " + e.getMessage());
        }
    }

    private String buildBody(String to, String status){
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Aziz's Ecommerce App - Order Status</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            line-height: 1.6;\n" +
                "            background-color: #f2f2f2;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: 0 auto;\n" +
                "            padding: 20px;\n" +
                "            background-color: #fff;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n" +
                "        }\n" +
                "        .header {\n" +
                "            text-align: center;\n" +
                "            padding: 10px 0;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            width: 100px;\n" +
                "            height: auto;\n" +
                "        }\n" +
                "        .order-details {\n" +
                "            padding: 20px;\n" +
                "            border: 1px solid #ddd;\n" +
                "            border-radius: 8px;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "        .product-row {\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "            padding: 10px 0;\n" +
                "            border-bottom: 1px solid #ddd;\n" +
                "        }\n" +
                "        .product-name {\n" +
                "            flex: 2;\n" +
                "        }\n" +
                "        .product-quantity,\n" +
                "        .product-price {\n" +
                "            flex: 1;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .total-price {\n" +
                "            text-align: right;\n" +
                "            font-weight: bold;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            text-align: center;\n" +
                "            padding-top: 20px;\n" +
                "            color: #888;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>Order Status</h1>\n" +
                "        </div>\n" +
                "        <p>Hello "+ to +",</p>\n" +
                "        <p>Thank you for shopping at our Ecommerce App. Your order's status: " + status + "</p>\n" +
                "        \n" +
                "        <p>If you have any questions or concerns regarding your order, feel free to reach out to our support team.</p>\n" +
                "        <p>Thank you for choosing our Ecommerce App. We hope you enjoy your shopping experience with us!</p>\n" +
                "        \n" +
                "        <div class=\"footer\">\n" +
                "            <p>This is an automated message, please do not reply.</p>\n" +
                "            <p>Ecommerce App &copy; 2023. All rights reserved.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>\n";
    }


}
