package com.mready.travelmonster

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.mready.travelmonster.di.initKoin

fun main() {
    initKoin()
    application {
        Window(
            onCloseRequest = ::exitApplication,
            title = "TravelMonster",
        ) {
            App()
        }
    }
}