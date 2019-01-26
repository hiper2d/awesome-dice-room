package com.hiper2d.handler

import com.hiper2d.model.TestDto
import com.hiper2d.repository.TestRepository
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.web.reactive.function.server.bodyToMono

@Component
class TestHandler(private val testRepository: TestRepository) {

    fun saveX(req: ServerRequest) =  ok().contentType(MediaType.APPLICATION_JSON)
        .body(req.bodyToMono<TestDto>().flatMap { testRepository.save(it) }, TestDto::class.java)

    fun readAll(req: ServerRequest) = ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(testRepository.findAll(), TestDto::class.java)
}
