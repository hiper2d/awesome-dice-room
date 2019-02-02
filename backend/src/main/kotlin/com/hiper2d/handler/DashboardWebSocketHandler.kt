package com.hiper2d.handler

import com.fasterxml.jackson.module.kotlin.readValue
import com.hiper2d.util.WsMessage
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono

@Component
class DashboardWebSocketHandler: WsHandler<WsMessage>() {

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = session.receive()
            .doOnNext{
                val inMsg = mapper.readValue<WsMessage>(it.payloadAsText)
                echoMessage(inMsg)
            }
            .then()

        val output = session.send(
            outputEvents.map { session.textMessage(mapper.writeValueAsString(it)) }
        )

        return Mono.zip(input, output).then()
    }
}
