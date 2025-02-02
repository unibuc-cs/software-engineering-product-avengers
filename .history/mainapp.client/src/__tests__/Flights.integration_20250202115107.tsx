import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Flights from '../pages/Flights';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the global fetch function for integration tests
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

describe('Flights Page - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('user can search for flights and see results', async () => {
    // Mocking the API response
    const mockResponse = {
      flights: [
        { id: 1, origin: 'JFK', destination: 'LAX', departureDate: '2025-02-15', returnDate: '2025-02-20' },
        { id: 2, origin: 'JFK', destination: 'LAX', departureDate: '2025-02-16', returnDate: '2025-02-21' },
      ],
    };
    mockFetch(mockResponse);

    // Render the Flights page
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Ensure form elements are rendered
   // expect(screen.getByLabelText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Return Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Flights/i })).toBeInTheDocument();

    // Simulate user input
    const originInput = screen.getByLabelText(/Origin/i) as HTMLInputElement;
    const destinationInput = screen.getByLabelText(/Destination/i) as HTMLInputElement;
    const departureDateInput = screen.getByLabelText(/Departure Date/i) as HTMLInputElement;
    const returnDateInput = screen.getByLabelText(/Return Date/i) as HTMLInputElement;
    
    fireEvent.change(originInput, { target: { value: 'JFK' } });
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });
    fireEvent.change(departureDateInput, { target: { value: '2025-02-15' } });
    fireEvent.change(returnDateInput, { target: { value: '2025-02-20' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Search Flights/i }));

    // Wait for the flight results to be displayed
    await waitFor(() => {
      expect(screen.getByText(/JFK to LAX/i)).toBeInTheDocument();
      expect(screen.getByText(/2025-02-15/)).toBeInTheDocument();
      expect(screen.getByText(/2025-02-20/)).toBeInTheDocument();
      expect(screen.getByText(/JFK to LAX/i)).toBeInTheDocument();
      expect(screen.getByText(/2025-02-16/)).toBeInTheDocument();
      expect(screen.getByText(/2025-02-21/)).toBeInTheDocument();
    });
  });
});
