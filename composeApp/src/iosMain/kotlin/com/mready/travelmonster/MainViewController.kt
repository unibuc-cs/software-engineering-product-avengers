package com.mready.travelmonster

import androidx.compose.ui.window.ComposeUIViewController
import com.mready.travelmonster.di.initKoin

fun MainViewController() = ComposeUIViewController {
    initKoin()
    App()
}