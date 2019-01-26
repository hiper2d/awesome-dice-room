package com.hiper2d.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "test")
data class TestDto(@Id val id: String? = null, val x: Int)
