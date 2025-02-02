import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Flights from '../pages/Flights';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the global fetch function
const mockFetch = (data: any, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
        ok,
        json: jest.fn().mockResolvedValue(data), // Mock json method once
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: jest.fn(), // Mock the clone method
        body: null, // Mock body as null
        bodyUsed: false, // Mock bodyUsed property
        arrayBuffer: jest.fn(), // Mock arrayBuffer
        blob: jest.fn(), // Mock blob
        formData: jest.fn(), // Mock formData
        text: jest.fn(), // Mock text
    } as unknown as Response) // Cast the object to match the Response type
  );
};

describe('Flights Page - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search form with input fields', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    //expect(screen.getByLabelText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Return Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passengers/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Flights/i })).toBeInTheDocument();
  });

  test('can input search parameters', async () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Use the appropriate type assertion for the input elements
    const originInput = screen.getByLabelText(/Origin/i) as HTMLInputElement;
    const destinationInput = screen.getByLabelText(/Destination/i) as HTMLInputElement;
    const departureDateInput = screen.getByLabelText(/Departure Date/i) as HTMLInputElement;

    fireEvent.change(originInput, { target: { value: 'JFK' } });
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });
    fireEvent.change(departureDateInput, { target: { value: '2025-02-15' } });

    expect(originInput.value).toBe('JFK');
    expect(destinationInput.value).toBe('LAX');
    expect(departureDateInput.value).toBe('2025-02-15');
  });
});
