package com.mready.travelmonster.ui.components

import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.size
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import cafe.adriel.voyager.navigator.tab.LocalTabNavigator
import cafe.adriel.voyager.navigator.tab.Tab
import org.jetbrains.compose.resources.painterResource
import travelmonster.composeapp.generated.resources.Res
import travelmonster.composeapp.generated.resources.compose_multiplatform

@Composable
fun RowScope.BottomBarNavigationItem(tab: Tab) {
    val tabNavigator = LocalTabNavigator.current

    BottomNavigationItem(
        modifier = Modifier
            .size(48.dp)
            .align(CenterVertically),
        selected = tabNavigator.current == tab,
        onClick = { tabNavigator.current = tab },
        selectedContentColor = Color(0xFFFFDDFF),
        unselectedContentColor = Color(0xFF7C0262),
        icon = {
            Icon(
                painter = painterResource(Res.drawable.compose_multiplatform),
                tint = if (tabNavigator.current == tab) Color(0xFFFFDDFF) else Color(0xFFB38BB5),
                contentDescription = null
            )
        }
    )
}