package com.mready.travelmonster.di

import com.mready.travelmonster.getPlatform
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

val platformModule = module {
    singleOf(::getPlatform)
}