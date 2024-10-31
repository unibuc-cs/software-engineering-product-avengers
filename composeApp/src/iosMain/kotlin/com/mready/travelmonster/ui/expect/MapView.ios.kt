package com.mready.travelmonster.ui.expect

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.interop.UIKitView
import kotlinx.cinterop.ExperimentalForeignApi
import platform.MapKit.MKMapView
import platform.CoreLocation.CLLocationCoordinate2DMake

@OptIn(ExperimentalForeignApi::class)
@Composable
actual fun MapView(
    modifier: Modifier,
    onMapLoaded: () -> Unit
) {
    UIKitView(
        factory = {
            MKMapView().apply {
                // Configure map settings
                setShowsUserLocation(true)
                setShowsCompass(true)

                // Set initial location (e.g., London)
                val coordinate = CLLocationCoordinate2DMake(
                    latitude = 51.5074,
                    longitude = -0.1278
                )
            }
        },
        modifier = modifier,
        update = { view ->
            onMapLoaded()
        }
    )
}