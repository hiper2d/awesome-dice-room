package com.hiper2d.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.hiper2d.config.WsRequest
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import kotlin.random.Random

@Component
class EchoWebSocketHandler: WebSocketHandler {

    override fun handle(session: WebSocketSession): Mono<Void> {
        val processor = EmitterProcessor.create<String>(false)
        val outputEvents = Flux.from(processor)
        val mapper = ObjectMapper().registerKotlinModule()

        val input = session.receive()
            .doOnNext {
                val json = it.payloadAsText
                val request = mapper.readValue<WsRequest>(json)
                if (request.message == "1d6") {
                    processor.onNext(Random.nextInt(1, 6).toString())
                }
            }
            .then()

        val output = session.send(
            outputEvents.map(session::textMessage)
        )
        return Mono.zip(input, output).then()
    }
}