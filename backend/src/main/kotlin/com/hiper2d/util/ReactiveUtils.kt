package com.hiper2d.util

import reactor.core.publisher.Mono

fun <T> Mono<T>.isEmpty(): Boolean = this == Mono.empty<T>()

fun <T, R> Mono<T?>.mapIfNotEmpty(f: (T) -> R): Mono<R> {
    return if (this.isEmpty()) Mono.empty()
    else this.map { v -> f(v!!) }
}

fun <T, R> Mono<T?>.flatMapIfNotEmpty(f: (T) -> Mono<R>): Mono<R> {
    return if (this.isEmpty()) Mono.empty()
    else this.flatMap { v -> f(v!!) }
}

fun <T> Mono<T?>.filterIfNotEmpty(p: (T) -> Boolean): Mono<T?> {
    return if (this.isEmpty()) return this
    else this.filter { v -> p(v!!) }
}
