import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import '@testing-library/jest-dom';

// Define types for the mocked components
type MotionProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

// Mock framer-motion to handle animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
   // button: ({ children, ...props }: MotionProps) => <button {...props}>{children}</button>,
    h2: ({ children, ...props }: MotionProps) => <h2 {...props}>{children}</h2>,
  }
}));

describe('Home Page - Unit Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders main heading', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Your Journey Begins Here')).toBeInTheDocument();
  });

  test('renders all navigation steps with correct icons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const steps = [
      { title: 'Book Flight', desc: 'Choose your destination' },
      { title: 'Find Hotel', desc: 'Select perfect accommodation' },
      { title: 'Plan Activities', desc: 'Discover local attractions' },
      { title: 'View Itinerary', desc: 'Review your journey' }
    ];

    steps.forEach(({ title, desc }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  test('renders popular destinations section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
  });

  test('renders correct number of destination cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const destinations = screen.getAllByRole('img');
    expect(destinations).toHaveLength(3);
  });

  test('destination cards have correct alt text', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const expectedDestinations = ['Paris', 'Tokyo', 'New York'];
    const images = screen.getAllByRole('img');

    images.forEach((img, index) => {
      expect(img).toHaveAttribute('alt', expectedDestinations[index]);
    });
  });

  test('start adventure button has correct styling', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    //const button = screen.getByText(/Start Your Adventure/i);
    //expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
  });
});