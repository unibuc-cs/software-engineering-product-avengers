package com.mready.travelmonster.ui.expect

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
expect fun MapView(
    modifier: Modifier = Modifier,
    onMapLoaded: () -> Unit = {}
)