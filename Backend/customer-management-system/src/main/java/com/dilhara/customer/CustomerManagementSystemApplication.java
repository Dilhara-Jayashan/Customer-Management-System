package com.dilhara.customer;

import com.dilhara.customer.model.Customer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CustomerManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerManagementSystemApplication.class, args);

        Customer cu = new Customer();
        cu.setName("j");
        System.out.println(cu.getName());
    }

}

