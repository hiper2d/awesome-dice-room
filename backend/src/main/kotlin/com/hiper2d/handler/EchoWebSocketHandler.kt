package com.hiper2d.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import kotlin.random.Random

internal data class InputMessage(val type: String, val data: String, val uuid: String)

@Component
class EchoWebSocketHandler: WebSocketHandler {

    private val processor = EmitterProcessor.create<String>(false)
    private val outputEvents = Flux.from(processor)
    private val mapper = ObjectMapper().registerKotlinModule()

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext {
                val json = it.payloadAsText
                val message = mapper.readValue<InputMessage>(json)
                if (message.type == "roll") {
                    val data = message.data
                        .split(";")
                        .joinToString(";") {
                            Random.nextInt(1, 6).toString()
                        }
                    processor.onNext(data)
                }
            }
            .then()

        val output = session.send(
            outputEvents.map(session::textMessage)
        )
        return Mono.zip(input, output).then()
    }
}