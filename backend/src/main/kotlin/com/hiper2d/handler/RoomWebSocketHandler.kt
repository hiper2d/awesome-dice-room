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

internal data class WsMessage(
    val type: String,
    val roomId: String,
    val data: String = "",
    val senderId: String = "",
    val direct: Boolean = false,
    val to: String = ""
)

@Component
class RoomWebSocketHandler: WebSocketHandler {

    private val processor = EmitterProcessor.create<WsMessage>(false)
    private val outputEvents = Flux.from(processor)
    private val mapper = ObjectMapper().registerKotlinModule()
    private val diceRoller = DiceRoller()

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext {
                val inMsg = mapper.readValue<WsMessage>(it.payloadAsText)
                when {
                    isRollMessage(inMsg) -> processRollMessage(inMsg)
                    else -> echoMessage(inMsg)
                }
            }
            .then()

        val output = session.send(
            outputEvents
                .filter { isSameRoom(it, session) }
                .map { session.textMessage(mapper.writeValueAsString(it)) }
        )

        return Mono.zip(input, output).then()
    }

    private fun isSameRoom(iMsg: WsMessage, session: WebSocketSession) =
        iMsg.roomId == session.handshakeInfo.uri.path.substringAfterLast("/")

    private fun processRollMessage(inMsg: WsMessage) {
        echoMessage(inMsg)
        processor.onNext(
            WsMessage(
                type = WebSocketMessageType.ROLL.toString(),
                roomId = inMsg.roomId,
                data = diceRoller.roll(inMsg.data),
                senderId = inMsg.senderId
            )
        )
    }

    private fun echoMessage(inMsg: WsMessage) {
        processor.onNext(inMsg)
    }

    private fun isRollMessage(inMsg: WsMessage) =
        inMsg.type == WebSocketMessageType.CHAT_MESSAGE.toString() && DiceRoller.isRoll(inMsg.data)
}
