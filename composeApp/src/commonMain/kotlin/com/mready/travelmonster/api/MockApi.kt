package com.mready.travelmonster.api

import com.mready.travelmonster.models.Destination

class MockApi {
    fun getDestinations() = listOf(
        Destination("Paris", "France"),
        Destination("New York", "USA"),
        Destination("Tokyo", "Japan"),
        Destination("Sydney", "Australia"),
        Destination("Rio de Janeiro", "Brazil"),
        Destination("Cape Town", "South Africa"),
        Destination("Barcelona", "Spain"),
        Destination("Berlin", "Germany"),
        Destination("Rome", "Italy"),
        Destination("Amsterdam", "Netherlands")
    )
}