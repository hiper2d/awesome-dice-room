package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Echo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

internal class EchoHandlerTest: BaseTest() {

    @Test
    fun testReading() {
        val echo = Echo(x = 5)
        val req = mapper.writeValueAsString(echo)
        val res = webClient.post().uri("/api/test")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(req), String::class.java))
            .exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
            .expectBody(Echo::class.java)
            .returnResult()

        val echoRes = res.responseBody
        assertEquals(echo.x, echoRes?.x)
        assertNotNull(echoRes?.id)
    }
}
