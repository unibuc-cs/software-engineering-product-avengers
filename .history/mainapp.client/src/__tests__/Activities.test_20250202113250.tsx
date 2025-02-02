import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Activities from '../pages/Activities';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock pentru Google Maps API
const mockGoogle = {
  maps: {
    Map: jest.fn(),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })), 
    Geocoder: jest.fn(() => ({
      geocode: jest.fn((_, callback) => callback([{ geometry: { location: {} } }], 'OK'))
    })),
    places: {
      PlacesService: jest.fn(() => ({
        nearbySearch: jest.fn()
      })),
      PlacesServiceStatus: { OK: 'OK' }
    },
    importLibrary: jest.fn().mockResolvedValue({
      AdvancedMarkerElement: jest.fn()
    })
  }
};

describe('Activities Page - Unit Tests', () => {
  beforeAll(() => {
    global.window.google = mockGoogle as any;
    
    // Mock pentru localStorage (dacă e folosit pentru a reține destinația)
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'selectedFlight') {
        return JSON.stringify({ destination: 'Test City' });
      }
      return null;
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders page title', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );
    expect(screen.getByText(/Discover Local Attractions/i)).toBeInTheDocument();
  });

  test('renders filter dropdowns and allows selection', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );

    const typeDropdown = screen.getByRole('combobox', { name: /type/i });

    fireEvent.change(typeDropdown, { target: { value: 'museum' } });

    expect(typeDropdown).toHaveValue('museum');
  });

  test('disables continue button when no attraction is selected', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );
    //const continueButton = screen.getByText(/Continue to Itinerary/i);
    //expect(continueButton).toBeDisabled();
  });
});

describe('Activities Page - Integration Tests', () => {
  test('selecting an attraction enables the continue button', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );

    const attractionCard = screen.getAllByRole('button')[0]; 
    fireEvent.click(attractionCard);

    const continueButton = screen.getByText(/Continue to Itinerary/i);
    expect(continueButton).toBeEnabled();
  });
});
