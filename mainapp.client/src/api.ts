// src/api.js (or src/utils/api.js or src/services/api.js)
const API_URL = 'http://localhost:5190/api/IdentityUser'; // Update with your backend URL

interface UserData {
  email: string;
  password: string;
  firstName?: string;  // Optional for login
  lastName?: string;   // Optional for login
}

export const signUp = async (userData: UserData) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // If the response contains error data, throw it
    if (Array.isArray(data)) {
      throw { 
        response: { 
          data: data 
        } 
      };
    } else if (data.message) {
      throw { 
        response: { 
          data: { message: data.message } 
        } 
      };
    }
    throw new Error('Failed to sign up');
  }

  return data;
};

export const logIn = async (userData: UserData) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData), // Send user data as JSON
  });

  if (!response.ok) {
    throw new Error('Failed to log in'); // Handle error
  }

  return await response.json(); // Return response data
};

export const fetchUserProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/myProfile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Include token in authorization header
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile'); // Handle error
  }

  return await response.json(); // Return response data
};
