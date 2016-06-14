package com.kaazing.xignite.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@ComponentScan(basePackages = { "com.kaazing.xignite.api","com.kaazing.xignite.web",
		"com.kaazing.xignite.datapoller.config", "com.kaazing.xignite.datapoller.sender" })
@SpringBootApplication
@EnableScheduling
public class Application {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class);
    }
}