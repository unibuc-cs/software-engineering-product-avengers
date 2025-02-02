import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Flights from '../pages/Flights';
import '@testing-library/jest-dom';

// Mock BackButton component
jest.mock('../components/common/BackButton', () => {
  return function MockBackButton() {
    return <button>Back</button>;
  };
});

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

  // Previous tests remain the same...

  test('renders back button', () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    const backButton = screen.getByText('Back');
    expect(backButton).toBeInTheDocument();
  });

  test('displays loading spinner during fetch', async () => {
    // Mock fetch to create a pending promise
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., JFK/i), { 
      target: { value: 'JFK' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\., CDG/i), { 
      target: { value: 'CDG' } 
    });
    fireEvent.change(screen.getByLabelText(/Departure Date/i), { 
      target: { value: '2024-02-02' } 
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    // Check for the loading spinner div with the animate-spin class
    const loadingSpinner = await screen.findByRole('status', {
      hidden: true
    });
    
    expect(loadingSpinner).toHaveClass('animate-spin');
  });

  // Rest of the tests remain the same...
});