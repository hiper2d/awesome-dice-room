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

internal data class WsMessage(val type: String, val data: String = "", val uuid: String = "", val direct: Boolean = false, val to: String = "", val sessionId: String = "")

@Component
class EchoWebSocketHandler: WebSocketHandler {

    private val processor = EmitterProcessor.create<WsMessage>(false)
    private val outputEvents = Flux.from(processor)
    private val mapper = ObjectMapper().registerKotlinModule()

    //todo: I was drunk when developed this, redesign this shit to something beautiful
    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext {
                val json = it.payloadAsText
                val inMsg = mapper.readValue<WsMessage>(json)

                if (inMsg.type == "roll") {
                    val data = inMsg.data
                        .split(";")
                        .joinToString(";") {
                            Random.nextInt(1, 6).toString()
                        }
                    val responseMessage = WsMessage(type = inMsg.type, data = data)
                    processor.onNext(responseMessage)
                } else {
                    val outMsg = WsMessage(type = inMsg.type, data = inMsg.data, uuid = inMsg.uuid, direct = inMsg.direct, to = inMsg.to)
                    processor.onNext(outMsg)
                }
            }
            .then()

        val output = session.send(
            outputEvents.map {
                session.textMessage(mapper.writeValueAsString(it))
            }
        )
        return Mono.zip(input, output).then()
    }
}
