package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * The main class of the Spring Boot application.
 */
@EnableMethodSecurity
@org.springframework.boot.autoconfigure.SpringBootApplication
public class SpringBootApplication {
    /**
     * The main method of the Spring Boot application.
     *
     * @param args The command-line arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(SpringBootApplication.class, args);
    }
}
