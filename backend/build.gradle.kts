import com.bmuschko.gradle.docker.tasks.image.DockerBuildImage
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.springframework.boot.gradle.tasks.run.BootRun

plugins {
    val kotlinVersion = "1.3.31"
    val springBootVersion = "2.1.5.RELEASE"
    val springDependencyManagementVersion = "1.0.6.RELEASE"

    kotlin("jvm") version kotlinVersion
    id("io.spring.dependency-management") version springDependencyManagementVersion
    id("org.springframework.boot") version springBootVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
}

val activationVersion = "1.1.1"
val disruptorVersion = "3.4.2"
val jaxbVersion = "2.3.0"
val kotlinJacksonVersion = "2.9.+"
val junitJupiterVersion = "5.3.+"
val jjwtVersion = "0.9.+"

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

    // These libs are required by Java 11 to avoid java.lang.NoClassDefFoundError: javax/xml/bind/DatatypeConverter
    implementation("javax.xml.bind:jaxb-api:$jaxbVersion")
    implementation("com.sun.xml.bind:jaxb-core:$jaxbVersion")
    implementation("com.sun.xml.bind:jaxb-impl:$jaxbVersion")

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
            jvmTarget = JavaVersion.VERSION_1_8.toString()
        }
    }

    getByName<BootRun>("bootRun") {
        main = "com.hiper2d.ApplicationKt"
        args = mutableListOf("--spring.profiles.active=local")
    }

    create<DockerBuildImage>("docker") {
        inputDir.set(file("."))
        tags.add("hiper2d/dice-room-backend:latest")
        dependsOn(getByName("build"))
    }

    named<Delete>("clean") {
        delete("out")
    }
}
