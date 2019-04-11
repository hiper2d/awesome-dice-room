import com.bmuschko.gradle.docker.tasks.image.DockerBuildImage
import com.moowork.gradle.node.NodeExtension
import com.moowork.gradle.node.yarn.YarnTask

plugins {
    id("com.moowork.node") version "1.3.1"
}

configure<NodeExtension> {
    download = false
}

tasks {
    create<Delete>("clean") {
        delete("dist")
    }

    val yarnBuild = create<YarnTask>("build") {
        args = mutableListOf("build")
    }

    create<DockerBuildImage>("docker") {
        inputDir.set(file("."))
        tags.add("hiper2d/dice-room-frontend:latest")
        dependsOn(yarnBuild)
    }
}
