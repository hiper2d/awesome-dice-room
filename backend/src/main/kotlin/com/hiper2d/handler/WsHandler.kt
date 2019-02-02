package com.hiper2d.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.web.reactive.socket.WebSocketHandler
import reactor.core.publisher.EmitterProcessor
import reactor.core.publisher.Flux

abstract class WsHandler<T>: WebSocketHandler {
    protected val processor = EmitterProcessor.create<T>(false)
    protected val mapper = ObjectMapper().registerKotlinModule()
    protected val outputEvents = Flux.from(processor)

    protected fun echoMessage(inMsg: T) {
        processor.onNext(inMsg)
    }
}
