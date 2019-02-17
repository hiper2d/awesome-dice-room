package com.hiper2d.config

import com.hiper2d.handler.ws.DashboardWebSocketHandler
import com.hiper2d.handler.ws.RoomWebSocketHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter

@Configuration
class WebSocketConfig(
    val roomWebSocketHandler: RoomWebSocketHandler,
    val dashboardWebSocketHandler: DashboardWebSocketHandler
) {

    @Bean
    fun webSocketHandlerAdapter() = WebSocketHandlerAdapter()

    @Bean
    fun webSocketRoomMapping(): HandlerMapping {
        val mapping = SimpleUrlHandlerMapping()
        mapping.urlMap = mapOf(
            "/ws/room/{roomId}" to roomWebSocketHandler,
            "/ws/dashboard" to dashboardWebSocketHandler
        )
        mapping.order = 10
        mapping.setCorsConfigurations(
            mapOf("*" to CorsConfiguration().applyPermitDefaultValues())
        )
        return mapping
    }
}
