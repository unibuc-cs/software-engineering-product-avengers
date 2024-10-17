package com.mready.travelmonster.di

import com.mready.travelmonster.api.MockApi
import com.mready.travelmonster.ui.home.HomeScreenModel
import org.koin.core.context.startKoin
import org.koin.dsl.module

val commonModule = module {
    factory { HomeScreenModel(get()) }
    single { MockApi() }
}

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}