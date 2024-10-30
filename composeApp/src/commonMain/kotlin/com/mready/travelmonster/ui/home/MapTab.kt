package com.mready.travelmonster.ui.home

import androidx.compose.runtime.Composable
import cafe.adriel.voyager.navigator.Navigator
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions
import org.jetbrains.compose.resources.painterResource
import travelmonster.composeapp.generated.resources.Res
import travelmonster.composeapp.generated.resources.compose_multiplatform

object MapTab : Tab {
    override val options: TabOptions
        @Composable
        get() = TabOptions(
            index = 0u,
            title = "Home",
            icon = painterResource(Res.drawable.compose_multiplatform)
        )

    @Composable
    override fun Content() {
        Navigator(MapScreen())
    }
}