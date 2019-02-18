package com.hiper2d.repository

import com.hiper2d.model.Room
import org.springframework.data.mongodb.repository.ReactiveMongoRepository

interface RoomRepository: ReactiveMongoRepository<Room, String>, RoomRepositoryCustom
