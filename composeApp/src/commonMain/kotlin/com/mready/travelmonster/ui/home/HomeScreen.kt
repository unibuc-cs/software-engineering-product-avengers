package com.mready.travelmonster.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.koin.getScreenModel
import cafe.adriel.voyager.koin.koinScreenModel
import com.mready.travelmonster.getPlatform


class HomeScreen : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val screenModel = koinScreenModel<HomeScreenModel>()
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
           val destinations = screenModel.getDestinations()
            Text(text = "Hello ${getPlatform()}")
            destinations.forEach {
                Text(text = it.city)
            }
        }
    }
}