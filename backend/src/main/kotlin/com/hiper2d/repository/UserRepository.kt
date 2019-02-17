package com.hiper2d.repository

import com.hiper2d.model.User
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import reactor.core.publisher.Mono

interface UserRepository: ReactiveMongoRepository<User, String> {

    fun findByName(name: String): Mono<User>
}
