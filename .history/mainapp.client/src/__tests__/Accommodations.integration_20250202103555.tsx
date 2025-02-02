//integration test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accommodations from '../pages/Accommodations';
import { BrowserRouter } from 'react-router-dom';


describe('Accommodations Page - Integration Tests', () => {
  test('selecting a hotel enables the continue button', () => {
    render(
      <BrowserRouter>
        <Accommodations />
      </BrowserRouter>
    );

    const hotelCard = screen.getAllByRole('button')[0]; 
    fireEvent.click(hotelCard);

    const continueButton = screen.getByText(/Continue to Activities/i);
    expect(continueButton).toBeEnabled();
  });
});
