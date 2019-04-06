import com.bmuschko.gradle.docker.tasks.image.DockerBuildImage
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    val kotlinVersion = "1.3.21"
    val springBootVersion = "2.1.3.RELEASE"
    val springDependencyManagementVersion = "1.0.6.RELEASE"
    val dockerPlugin = "4.1.0"

    kotlin("jvm") version kotlinVersion
    id("io.spring.dependency-management") version springDependencyManagementVersion
    id("org.springframework.boot") version springBootVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("com.bmuschko.docker-remote-api") version dockerPlugin
}

val activationVersion: String by project
val disruptorVersion: String by project
val jaxbVersion: String by project
val kotlinJacksonVersion: String by project
val junitJupiterVersion: String by project
val jjwtVersion: String = "0.9.+"

repositories {
    jcenter()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$kotlinJacksonVersion")
    implementation("io.jsonwebtoken:jjwt:$jjwtVersion")
    implementation("com.lmax:disruptor:$disruptorVersion") // Log4j2 async appender

    implementation("org.springframework.boot:spring-boot-starter-log4j2")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")

    testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo")
    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "junit")
    }
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")
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

    create<DockerBuildImage>("buildDockerImage") {
        inputDir.set(file("."))
        tag.set("hiper2d/dice-room-backend:latest")
    }

    get("build").finalizedBy("buildDockerImage")
}
