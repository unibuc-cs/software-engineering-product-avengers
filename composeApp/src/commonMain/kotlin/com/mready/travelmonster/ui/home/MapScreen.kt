package com.mready.travelmonster.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.koin.koinNavigatorScreenModel
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import com.mready.travelmonster.getPlatform
import com.mready.travelmonster.ui.detail.ItineraryScreen


class MapScreen : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
       // val screenModel = koinScreenModel<HomeScreenModel>()
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = navigator.koinNavigatorScreenModel<MapScreenModel>()  // asta e scoped navigator screen model

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
            val destinations by screenModel.destinations.collectAsState()
            Text(text = "Hello $key ${getPlatform()}")
            Button(
                onClick = {
                    navigator.push(ItineraryScreen())
                }
            ) {
                Text("Go to Detail")
            }
            destinations.forEach { destination ->
                Text(text = destination.city)
            }
        }
    }
}