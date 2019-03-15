package com.hiper2d.router

import com.hiper2d.handler.AuthHandler
import com.hiper2d.handler.PlayerHandler
import com.hiper2d.handler.RoomHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.router

@Configuration
class GameRouter {

    @Bean
    fun loginRoute(authHandler: AuthHandler): RouterFunction<ServerResponse> = router {
        POST("/api/token").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, authHandler::generateToken)
        }
        POST("/api/signup").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, authHandler::signUp)
        }
    }

    @Bean
    fun roomRoute(roomHandler: RoomHandler): RouterFunction<ServerResponse> = router {
        GET("/api/rooms/{id}").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::findRoom)
        }
        GET("/api/rooms").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::allRooms)
        }
        DELETE("/api/rooms/{id}/player-id/{playerId}").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::removePlayerIdFromRoom)
        }
        DELETE("/api/rooms/{id}").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::removeRoom)
        }
        PUT("/api/rooms").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::updateRoom)
        }
        POST("/api/rooms").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, roomHandler::createRoom)
        }
    }

    @Bean
    fun playerRoute(playerHandler: PlayerHandler): RouterFunction<ServerResponse> = router {
        GET("/api/players/{id}").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, playerHandler::findPlayer)
        }
        PUT("/api/players").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, playerHandler::updatePlayer)
        }
        POST("/api/players/find-or-create").nest {
            accept(MediaType.APPLICATION_JSON_UTF8, playerHandler::findOrCreate)
        }
    }
}
