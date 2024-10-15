package com.mready.travelmonster

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform