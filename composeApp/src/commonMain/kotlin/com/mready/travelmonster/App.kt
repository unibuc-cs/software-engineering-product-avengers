package com.mready.travelmonster

import androidx.compose.material.MaterialTheme
import androidx.compose.runtime.Composable

import cafe.adriel.voyager.navigator.Navigator
import com.mready.travelmonster.ui.root.RootScreen
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
@Preview
fun App() {
    MaterialTheme {
        val platform = getPlatform().name
        when {
            platform.contains("Android", ignoreCase = true) -> {
                Navigator(RootScreen())
            }
            platform.contains("Java", ignoreCase = true) -> {
                Navigator(RootScreen())
            }
            else -> {
                Navigator(RootScreen())
            }
        }
    }
}