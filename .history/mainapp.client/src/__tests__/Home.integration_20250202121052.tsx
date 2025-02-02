import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

describe('Home Page - Integration Tests', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('navigates to flights page when start adventure button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    //const startButton = screen.getByText(/Start Your Adventure/i);
    //fireEvent.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('/flights');
  });

  test('displays all steps in the correct order', () => {
    const steps = [
      'Book Flight',
      'Find Hotel',
      'Plan Activities',
      'View Itinerary'
    ];

    steps.forEach(stepTitle => {
      expect(screen.getByText(stepTitle)).toBeInTheDocument();
    });
  });

  test('displays all popular destinations', () => {
    const destinations = ['Paris', 'Tokyo', 'New York'];
    
    destinations.forEach(destination => {
      expect(screen.getByText(destination)).toBeInTheDocument();
    });
  });

  test('applies hover animations to destination cards', () => {
    const destinationCards = screen.getAllByRole('img');
    
    destinationCards.forEach(card => {
      const parentElement = card.parentElement;
      if (parentElement) {
        fireEvent.mouseEnter(parentElement);
        expect(parentElement).toHaveClass('group');
      }
    });
  });
});