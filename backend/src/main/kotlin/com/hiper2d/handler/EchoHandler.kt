package com.hiper2d.handler

import com.hiper2d.model.Echo
import com.hiper2d.repository.EchoRepository
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.web.reactive.function.server.bodyToMono

@Component
class EchoHandler(private val echoRepository: EchoRepository) {

    fun saveX(req: ServerRequest) =  ok().contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(req.bodyToMono<Echo>().flatMap { echoRepository.save(it) }, Echo::class.java)

    fun readAll(req: ServerRequest) = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(echoRepository.findAll(), Echo::class.java)
}
