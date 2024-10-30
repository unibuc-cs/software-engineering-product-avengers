package com.mready.travelmonster.di

import com.mready.travelmonster.api.MockApi
import com.mready.travelmonster.ui.detail.ItineraryScreenModel
import com.mready.travelmonster.ui.home.MapScreenModel
import org.koin.core.context.startKoin
import org.koin.dsl.module

val commonModule = module {
    factory { MapScreenModel(get()) }
    factory { ItineraryScreenModel(get()) }
    single { MockApi() }
}

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}