package com.hiper2d.repository

import com.hiper2d.model.Echo
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface EchoRepository: ReactiveMongoRepository<Echo, String>
