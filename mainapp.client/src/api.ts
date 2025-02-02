// src/api.js (or src/utils/api.js or src/services/api.js)
const API_URL = 'https://localhost:5193/api/IdentityUser'; // Update with your backend URL

interface SignUpData {
  email: string;
  password: string;
  firstName: string;  // Required for signup
  lastName: string;   // Required for signup
}

interface LoginData {
  email: string;
  password: string;
}

export const signUp = async (userData: SignUpData) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw the error data directly
    throw {
      response: {
        data: data // This will contain the array of errors from the backend
      }
    };
  }

  return data;
};

export const logIn = async (userData: LoginData) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to log in');
  }

  const data = await response.json();
  return {
    user: data.user,
    token: data.token,
    message: data.message
  };
};

const createAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token 
    ? { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    : { 'Content-Type': 'application/json' };
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${API_URL}/myProfile`, {
    method: 'GET',
    headers: {
      ...createAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
};
