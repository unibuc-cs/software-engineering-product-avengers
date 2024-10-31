package com.mready.travelmonster.ui.expect

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.google.maps.android.compose.GoogleMap

@Composable
actual fun MapView(
    modifier: Modifier,
    onMapLoaded: () -> Unit
) {
    GoogleMap(
        modifier = modifier,
        onMapLoaded = onMapLoaded
    )
}