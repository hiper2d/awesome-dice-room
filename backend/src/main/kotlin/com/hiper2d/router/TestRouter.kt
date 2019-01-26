package com.hiper2d.router

import com.hiper2d.handler.EchoHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.server.router

@Configuration
class TestRouter {

    @Bean
    fun router(EchoHandler: EchoHandler) = router {
        GET("/api/tests").nest {
            accept(MediaType.TEXT_HTML, EchoHandler::readAll)
        }
        POST("/api/test").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, EchoHandler::saveX)
        }
    }
}
