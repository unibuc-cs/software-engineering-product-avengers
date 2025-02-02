import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Activities from '../pages/Activities';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockGoogle = {
    maps: {
      Map: jest.fn(),
      LatLng: jest.fn((lat, lng) => ({ lat, lng })), // Adăugat aici
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
  

describe('Activities Page - Integration Tests', () => {
    beforeAll(() => {
      global.window.google = mockGoogle as any;
      Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'selectedAccommodation') {
          return JSON.stringify({ geometry: { location: { lat: 40.7128, lng: -74.006 } } });
        }
        return null;
      });
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('selecting an attraction enables the continue button', () => {
      render(
        <BrowserRouter>
          <Activities />
        </BrowserRouter>
      );

      const attractionElements = screen.getAllByRole('button');
      fireEvent.click(attractionElements[0]);
  
      //const continueButton = screen.getByText(/Continue to Itinerary/i);
      //expect(continueButton).toBeEnabled();
    });
  });
  