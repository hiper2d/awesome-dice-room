package com.hiper2d.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.hiper2d.util.DiceRoller
import com.hiper2d.util.WebSocketMessageType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import kotlin.random.Random

internal data class WsMessage(
    val type: String,
    val data: String = "",
    val senderId: String = "",
    val direct: Boolean = false,
    val to: String = ""
)

@Component
class EchoWebSocketHandler: WebSocketHandler {

    private val processor = EmitterProcessor.create<WsMessage>(false)
    private val outputEvents = Flux.from(processor)
    private val mapper = ObjectMapper().registerKotlinModule()
    private val diceRoller = DiceRoller()

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext {
                val inMsg = mapper.readValue<WsMessage>(it.payloadAsText)

                if (inMsg.type == WebSocketMessageType.MESSAGE.toString() && DiceRoller.isRoll(inMsg.data)) {
                    processor.onNext(inMsg)
                    processor.onNext(
                        WsMessage(
                            type = WebSocketMessageType.ROLL.toString(),
                            data = diceRoller.roll(inMsg.data),
                            senderId = inMsg.senderId
                        )
                    )
                } else {
                    processor.onNext(inMsg)
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
