# DEMO
[TravelMonster Demo](https://we.tl/t-tqE23xsa7M)

# Product Vision

**FOR** travelers who want a simple and personalized way to explore new destinations,  
**WHO** need an efficient way to organize itineraries while managing budget constraints and personal preferences,  
**Travel Monster** is a comprehensive travel planning app  
**THAT** provides tailored recommendations and integrated booking options to create a seamless, customized travel experience.  
**UNLIKE** Booking, eSky, and AirPaz,  
**OUR PRODUCT** utilizes a carefully curated selection of real-time data and user inputs to deliver relevant suggestions, optimizing each trip based on preferences to enhance convenience, save time, and control costs.

# Product Features

## Flight Search

INPUT: Database of flights

ACTIVATION: User introduces details of the flight such as date, number of passengers

ACTION: App searches for flights, compares prices in real-time and filters options based on preferences

OUTPUT: A curated list of flight options

## Accommodation Recommendations

INPUT: Database of accommodations

ACTIVATION: User clicks on icon to find accommodations recommended for the location they wish to go to

ACTION: App retrieves and compares accommodation options from multiple booking platforms, filtering them by user preferences

OUTPUT: A list of personalized accommodations options with booking links and reviews

## Nearby Attractions and Activities

INPUT: User's location and personal interests

ACTIVATION: User accesses real time map on the phone 

ACTION: App generates a selection of attractions and activities, based on user interests, location, and current trends

OUTPUT: A map with nearby locations which the user can explore

## Itinerary 

INPUT: Data about the user's trip 

ACTIVATION: User clicks on the "itinerary" icon

ACTION: App organizes items in a daily schedule, syncs with the user's calendar and sets reminders for important events

OUTPUT: A day-by-day travel itinerary with booking details, activity times, and offline access

# User Stories



# Design

![image](C4_Diagram/img/C4.png)

## Context Diagram (level 1)

![image](C4_Diagram/img/lvl1.png)

The Context Diagram provides a high-level overview of the Travel Monster application and its interactions with external systems and users.

- **User**: Represents the person using the app to explore destinations, book flights, accommodations, and manage itineraries.
- **Travel Monster System**: The core application that offers travel recommendations, booking services, and itinerary management.
- **External Systems**:
  - **Amadeus API**: Supplies flight information with industry-grade data.
  - **Google APIs**: Offers location data, maps, and routes for nearby attractions.

### Relationships
- The user interacts with the Travel Monster System.
- The Travel Monster System retrieves flight information from the Amadeus API.
- The Travel Monster System fetches location and map data from Google APIs.


## Container Diagram (level 2)

![image](C4_Diagram/img/lvl2.png)

The Container Diagram details the internal architecture of the Travel Monster application, illustrating how different containers interact to serve user needs.

- **User**: Accesses the application via Web, Mobile, or Desktop.
- **Containers**:
  - **Web Application**: Built with React and TypeScript, provides the user interface for web users.
  - **Mobile App**: Developed using Kotlin Multiplatform for mobile user interaction.
  - **Desktop App**: Also developed using Kotlin Multiplatform for desktop user interaction.
  - **API Gateway**: Routes requests to backend services using .NET.
  - **Flight Service**: Handles flight searches and integrates with the Amadeus API.
  - **Accommodation Service**: Fetches and filters accommodations.
  - **Attractions Service**: Suggests location-based attractions.
  - **Itinerary Service**: Manages user itineraries.
  - **Database**: Stores user data, preferences, and itineraries.

### Relationships
- Users interact with the web, mobile, and desktop applications.
- Each frontend container communicates with the API Gateway, which routes requests to the appropriate backend services.


## Component Diagram (level 3)

![image](C4_Diagram/img/lvl3.png)

The Component Diagram breaks down the Travel Monster application into its key components, focusing on the interactions within the backend services.

- **User**: Utilizes the Travel Monster application to manage itineraries, with roles including Admin, Guest, and Registered User.
- **Key Components**:
  - **API Gateway**: Routes requests to the appropriate backend services.
  - **Authentication Service**: Manages user authentication and authorization.
  - **Logging Service**: Logs API requests and responses.
  - **Flight Service**: Contains controllers and repositories for handling flight-related requests.
  - **Accommodation Service**: Manages accommodation data.
  - **Attractions Service**: Handles attraction-related requests.
  - **Itinerary Service**: Manages user itineraries and interacts with the database.
  - **External APIs**: Integrates with Amadeus and Google APIs for flight and accommodation data.

### Relationships
- The user interacts with the API Gateway to make API requests.
- The API Gateway communicates with various services to handle user requests.
- Each service has its own controller and repository for managing data and operations .


# Requirements

# Backlog
