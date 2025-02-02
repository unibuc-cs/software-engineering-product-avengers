import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Flights from '../pages/Flights';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Flights Page - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  test('performs flight search and displays results', async () => {
    const mockFlights = [
      {
        id: '1',
        itineraries: [{
          segments: [{
            departureAirport: 'JFK',
            departureTime: '2024-02-02T10:00:00',
            arrivalAirport: 'CDG',
            arrivalTime: '2024-02-02T22:00:00',
            flightNumber: 'AF123',
            duration: 480
          }],
          price: 500
        }]
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlights,
    });

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Fill in search form
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., JFK/i), { 
      target: { value: 'JFK' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., CDG/i), { 
      target: { value: 'CDG' } 
    });
    
    const departureDateInput = screen.getByLabelText(/Departure Date/i);
    fireEvent.change(departureDateInput, { 
      target: { value: '2024-02-02' } 
    });

    // Submit search
    const searchButton = screen.getByText(/Search Flights/i);
    fireEvent.click(searchButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('AF123')).toBeInTheDocument();
      expect(screen.getByText('500.00 EUR')).toBeInTheDocument();
    });
  });

  test('handles flight selection and navigation', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    const mockFlights = [{
      id: '1',
      itineraries: [{
        segments: [{
          departureAirport: 'JFK',
          departureTime: '2024-02-02T10:00:00',
          arrivalAirport: 'CDG',
          arrivalTime: '2024-02-02T22:00:00',
          flightNumber: 'AF123',
          duration: 480
        }],
        price: 500
      }]
    }];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlights,
    });

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Perform search
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., JFK/i), { 
      target: { value: 'JFK' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., CDG/i), { 
      target: { value: 'CDG' } 
    });
    fireEvent.click(screen.getByText(/Search Flights/i));

    // Wait for results and select flight
    await waitFor(() => {
      const flightCard = screen.getByText('AF123').closest('div[role="button"]');
      if (flightCard) {
        fireEvent.click(flightCard);
      }
    });

    expect(mockNavigate).toHaveBeenCalledWith('/accommodations');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test('handles bookmark toggling', async () => {
    const mockFlights = [{
      id: '1',
      itineraries: [{
        segments: [{
          departureAirport: 'JFK',
          departureTime: '2024-02-02T10:00:00',
          arrivalAirport: 'CDG',
          arrivalTime: '2024-02-02T22:00:00',
          flightNumber: 'AF123',
          duration: 480
        }],
        price: 500
      }]
    }];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlights,
    });

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Perform search to get flights displayed
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., JFK/i), { 
      target: { value: 'JFK' } 
    });
    fireEvent.click(screen.getByText(/Search Flights/i));

    // Wait for results and toggle bookmark
    await waitFor(() => {
      const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
      fireEvent.click(bookmarkButton);
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});