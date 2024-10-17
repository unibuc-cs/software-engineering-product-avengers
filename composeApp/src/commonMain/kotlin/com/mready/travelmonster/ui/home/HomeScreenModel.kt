package com.mready.travelmonster.ui.home

import cafe.adriel.voyager.core.model.ScreenModel
import com.mready.travelmonster.Platform
import com.mready.travelmonster.api.MockApi

class HomeScreenModel(private val mockApi: MockApi) : ScreenModel {
     fun getDestinations() = mockApi.getDestinations()
}