import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accommodations from '../pages/Accommodations';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';


describe('Accommodations Page - Unit Tests', () => {
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
