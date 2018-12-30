import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    val kotlinVersion = "1.3.11"
    val springBootVersion = "2.1.1.RELEASE"
    val springDependencyManagementVersion = "1.0.6.RELEASE"

    kotlin("jvm") version kotlinVersion
    id("io.spring.dependency-management") version springDependencyManagementVersion
    id("org.springframework.boot") version springBootVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
}

val activationVersion: String by project
val disruptorVersion: String by project
val jaxbVersion: String by project
val kotlinJacksonVersion: String by project

repositories {
    jcenter()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$kotlinJacksonVersion")
    implementation("org.springframework.boot:spring-boot-starter-log4j2")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("com.lmax:disruptor:$disruptorVersion") // Log4j2 async appender
}

configurations.all {
    exclude(module = "spring-boot-starter-logging")
    exclude(module = "spring-boot-starter-tomcat") // we use Netty server
}

tasks {
    withType<KotlinCompile> {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }

    withType<BootJar> {
        mainClassName = "com.hiper2d.ApplicationKt"
    }
}