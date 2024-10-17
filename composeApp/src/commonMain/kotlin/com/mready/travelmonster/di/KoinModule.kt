package com.mready.travelmonster.di

import com.mready.travelmonster.ui.home.HomeScreenModel
import org.koin.dsl.module

fun appModule() = listOf(commonModule, platformModule)