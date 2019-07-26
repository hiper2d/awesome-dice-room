plugins {
    id("com.bmuschko.docker-remote-api") version "4.10.0" apply false
}

subprojects {
    group = "com.hiper2d"
    version = "1.0"

    apply {
        plugin("com.bmuschko.docker-remote-api")
    }
}
