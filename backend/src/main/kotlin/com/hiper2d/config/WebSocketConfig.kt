package com.hiper2d.config

import com.hiper2d.handler.EchoWebSocketHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter

@Configuration
class WebSocketConfig(val echoWebSocketHandler: EchoWebSocketHandler) {

    @Bean
    fun webSocketHandlerAdapter() = WebSocketHandlerAdapter()

    @Bean
    fun webSocketURLMapping(): HandlerMapping {
        val mapping = SimpleUrlHandlerMapping()
        mapping.urlMap = mapOf("/ws/echo" to echoWebSocketHandler)
        mapping.order = 10
        mapping.setCorsConfigurations(
            mapOf("*" to CorsConfiguration().applyPermitDefaultValues())
        )
        return mapping
    }
}