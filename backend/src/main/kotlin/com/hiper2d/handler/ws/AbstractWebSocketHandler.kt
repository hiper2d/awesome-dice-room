package com.hiper2d.handler.ws

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.web.reactive.socket.WebSocketHandler
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Flux

abstract class AbstractWebSocketHandler<T>: WebSocketHandler {
    protected val processor: EmitterProcessor<T> = EmitterProcessor.create<T>(false)
    protected val mapper = ObjectMapper().registerKotlinModule()
    protected val outputEvents: Flux<T> = Flux.from(processor)

    protected fun echoMessage(inMsg: T) {
        processor.onNext(inMsg)
    }
}
