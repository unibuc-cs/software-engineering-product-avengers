import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Flights from '../pages/Flights';
import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <button {...props}>{children}</button>,
    form: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <form {...props}>{children}</form>
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Flights Page - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search form with all inputs', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/e\.g\., JFK/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\., CDG/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Return Date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Number of adults/i)).toBeInTheDocument();
  });

  test('validates required fields', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Check that required fields are marked as required
    expect(screen.getByPlaceholderText(/e\.g\., JFK/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/e\.g\., CDG/i)).toBeRequired();
    expect(screen.getByLabelText(/Departure Date/i)).toBeRequired();
  });

  test('updates search parameters correctly', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    const originInput = screen.getByPlaceholderText(/e\.g\., JFK/i);
    fireEvent.change(originInput, { target: { value: 'JFK' } });
    expect(originInput).toHaveValue('JFK');

    const destinationInput = screen.getByPlaceholderText(/e\.g\., CDG/i);
    fireEvent.change(destinationInput, { target: { value: 'CDG' } });
    expect(destinationInput).toHaveValue('CDG');

    const passengersInput = screen.getByPlaceholderText(/Number of adults/i);
    fireEvent.change(passengersInput, { target: { value: '2' } });
    expect(passengersInput).toHaveValue('2');
  });

  test('displays error message when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText(/An error occurred while fetching flights\./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays loading spinner during fetch', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders back button', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('link', { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/');
  });
});