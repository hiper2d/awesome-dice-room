plugins {
    id("com.bmuschko.docker-remote-api") version "4.6.2" apply false
}

subprojects {
    group = "com.hiper2d"
    version = "1.0"

    apply {
        plugin("com.bmuschko.docker-remote-api")
    }
}
