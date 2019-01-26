package com.hiper2d.repository

import com.hiper2d.model.TestDto
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface TestRepository: ReactiveMongoRepository<TestDto, String>
