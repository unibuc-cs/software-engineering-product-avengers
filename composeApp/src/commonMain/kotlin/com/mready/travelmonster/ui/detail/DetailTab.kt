package com.mready.travelmonster.ui.detail

import androidx.compose.runtime.Composable
import cafe.adriel.voyager.navigator.Navigator
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions
import com.mready.travelmonster.ui.home.HomeScreen
import org.jetbrains.compose.resources.painterResource
import travelmonster.composeapp.generated.resources.Res
import travelmonster.composeapp.generated.resources.compose_multiplatform

object DetailTab : Tab {
    override val options: TabOptions
        @Composable
        get() = TabOptions(
            index = 1u,
            title = "Detail",
            icon = painterResource(Res.drawable.compose_multiplatform)
        )

    @Composable
    override fun Content() {
        Navigator(DetailScreen())
    }
}