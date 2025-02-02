import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../hooks/redux', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

describe('Profile Page - Integration Tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('redirects to login page if user is not authenticated', () => {
    useAppSelector.mockReturnValue({ currentUser: null });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const loginButton = screen.getByText(/Log In/i);
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('redirects to signup page if user clicks on Sign Up button', () => {
    useAppSelector.mockReturnValue({ currentUser: null });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const signupButton = screen.getByText(/Sign Up/i);
    fireEvent.click(signupButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('redirects to travel history page when clicking a history item', () => {
    useAppSelector.mockReturnValue({
      currentUser: { name: 'John Doe', email: 'johndoe@example.com', avatar: null },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const historyItem = screen.getByText(/Paris, France/i);
    fireEvent.click(historyItem);

    expect(mockNavigate).toHaveBeenCalledWith('/travel-history/1');
  });

  test('removes bookmark correctly when remove button is clicked', () => {
    const mockBookmarks = [
      { id: '1', type: 'attraction', name: 'Eiffel Tower', details: 'Paris' },
    ];

    useAppSelector.mockReturnValue({
      currentUser: { name: 'John Doe', email: 'johndoe@example.com', avatar: null },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Remove'));
    expect(screen.queryByText('Eiffel Tower')).not.toBeInTheDocument();
  });
});
