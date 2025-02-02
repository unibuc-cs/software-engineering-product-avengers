//unit test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accommodations from '../pages/Accommodations';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock pentru Google Maps API
const mockGoogle = {
  maps: {
    Map: jest.fn(),
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

describe('Accommodations Page - Unit Tests', () => {
  beforeAll(() => {
    // Setup global mocks
    global.window.google = mockGoogle as any;
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'selectedFlight') {
        return JSON.stringify({ destination: 'Test City' });
      }
      return null;
    });
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders page title', () => {
    render(
      <BrowserRouter>
        <Accommodations />
      </BrowserRouter>
    );
    expect(screen.getByText(/Find Your Perfect Stay/i)).toBeInTheDocument();
  });

  test('renders sort dropdown and selects an option', () => {
    render(
      <BrowserRouter>
        <Accommodations />
      </BrowserRouter>
    );
    const sortDropdown = screen.getByRole('combobox');
    fireEvent.change(sortDropdown, { target: { value: 'reviews' } });
    expect(sortDropdown).toHaveValue('reviews');
  });

  test('disables continue button when no hotel is selected', () => {
    render(
      <BrowserRouter>
        <Accommodations />
      </BrowserRouter>
    );
    const continueButton = screen.getByText(/Continue to Activities/i);
    expect(continueButton).toBeDisabled();
  });
});
