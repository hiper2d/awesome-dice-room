package com.hiper2d

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories


@SpringBootApplication
@EnableReactiveMongoRepositories(basePackages = ["com.hiper2d.repository"] )
class Application

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
