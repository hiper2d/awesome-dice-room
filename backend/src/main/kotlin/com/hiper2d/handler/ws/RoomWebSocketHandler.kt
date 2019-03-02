package com.hiper2d.handler.ws

import com.fasterxml.jackson.module.kotlin.readValue
import com.hiper2d.util.DiceRoller
import com.hiper2d.util.WebSocketMessageType
import com.hiper2d.util.WsRoomMessage
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono

@Component
class RoomWebSocketHandler: AbstractWebSocketHandler<WsRoomMessage>() {
    private val diceRoller = DiceRoller()

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext {
                val inMsg = mapper.readValue<WsRoomMessage>(it.payloadAsText)
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

    private fun isSameRoom(iMsg: WsRoomMessage, session: WebSocketSession) =
        iMsg.roomId == session.handshakeInfo.uri.path.substringAfterLast("/")

    private fun processRollMessage(inMsg: WsRoomMessage) {
        echoMessage(inMsg)
        processor.onNext(
            WsRoomMessage(
                type = WebSocketMessageType.ROLL.toString(),
                roomId = inMsg.roomId,
                data = diceRoller.roll(inMsg.data as String),
                sender = inMsg.sender
            )
        )
    }

    private fun isRollMessage(inMsg: WsRoomMessage) =
        inMsg.type == WebSocketMessageType.CHAT_MESSAGE.toString() && DiceRoller.isRoll(inMsg.data as String)
}
