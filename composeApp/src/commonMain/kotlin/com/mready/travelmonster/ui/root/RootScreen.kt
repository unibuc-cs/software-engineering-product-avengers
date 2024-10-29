package com.mready.travelmonster.ui.root

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material.Icon
import androidx.compose.material.NavigationRail
import androidx.compose.material.NavigationRailItem
import androidx.compose.material.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.Navigator
import cafe.adriel.voyager.navigator.tab.CurrentTab
import cafe.adriel.voyager.navigator.tab.TabNavigator
import com.mready.travelmonster.getPlatform
import com.mready.travelmonster.ui.components.BottomBarNavigationItem
import com.mready.travelmonster.ui.components.NavigationRailItemWrapper
import com.mready.travelmonster.ui.detail.DetailTab
import com.mready.travelmonster.ui.home.HomeTab
import org.jetbrains.compose.resources.painterResource
import travelmonster.composeapp.generated.resources.Res
import travelmonster.composeapp.generated.resources.compose_multiplatform

class RootScreen : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val platform = getPlatform().name
        when {
            platform.contains("Android", ignoreCase = true) -> {
                TabNavigator(HomeTab) {
                    Scaffold(modifier = Modifier.background(Color(0xFF13171B))
                        .navigationBarsPadding().statusBarsPadding(), bottomBar = {
                        BottomNavigation(
                            modifier = Modifier, backgroundColor = Color(0xFF13171B)
                        ) {
                            BottomBarNavigationItem(
                                tab = HomeTab
                            )
                            BottomBarNavigationItem(
                                tab = DetailTab
                            )
                        }
                    }) { innerPadding ->
                        Box(
                            modifier = Modifier.padding(innerPadding)
                        ) {
                            CurrentTab()
                        }
                    }
                }
            }

            platform.contains("Java", ignoreCase = true) -> {
                TabNavigator(HomeTab) {
                    Row(modifier = Modifier.fillMaxSize()) {
                        NavigationRail(
                            modifier = Modifier
                                .fillMaxHeight()
                                .width(64.dp),
                            elevation = 8.dp,
                            backgroundColor = Color(0xFF13171B)
                        ) {
                            Icon(
                                modifier = Modifier.padding(bottom = 12.dp),
                                painter = painterResource(Res.drawable.compose_multiplatform),
                                tint = Color.White,
                                contentDescription = null
                            )

                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                NavigationRailItemWrapper(tab = HomeTab) // map tab

                                NavigationRailItemWrapper(tab = DetailTab) // itinerary tab

                                Spacer(modifier = Modifier.weight(1f)) // sa incerc sa fac fara weight ca pare sa lagheze in spate culoarea

                                Icon(
                                    modifier = Modifier.size(36.dp)
                                        .align(CenterHorizontally),   // placeholder pt profile tab
                                    painter = painterResource(Res.drawable.compose_multiplatform),
                                    tint = Color.White,
                                    contentDescription = null
                                )
                            }
                        }
                        Box(modifier = Modifier.weight(1f)) {
                            CurrentTab()
                        }
                    }
                }
            }

            else -> {
                Navigator(RootScreen())
            }
        }
    }
}

//todo schimb numele la chestii, sa testez fara aia cu weight, sa fac niste google maps acu rapid la sto, si sa mai vad cum structurez ecranele pe desktop
// sa vad cum fac cu resursele ca nu m am prins inca