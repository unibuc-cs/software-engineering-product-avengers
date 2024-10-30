package com.mready.travelmonster.ui.detail

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.mready.travelmonster.api.MockApi
import com.mready.travelmonster.models.Destination
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ItineraryScreenModel(private val mockApi: MockApi) : ScreenModel {
    var destinations = MutableStateFlow<List<Destination>>(emptyList())
        private set

    init {
        screenModelScope.launch { destinations.update { getDestinations() } }
    }

    private suspend fun getDestinations() = mockApi.getDestinations()
}