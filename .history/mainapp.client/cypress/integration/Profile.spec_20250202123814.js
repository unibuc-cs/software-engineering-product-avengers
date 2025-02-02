describe('Profile Component', () => {
    beforeEach(() => {
      // Mocking the logged-in state by setting user data in localStorage or state (this will depend on how your app stores authentication)
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
      }));
  
      // Visit the profile page
      cy.visit('/profile');
    });
  
    it('should load profile and display user information', () => {
      cy.get('h1').should('have.text', 'John Doe');
      cy.get('p').should('have.text', 'john.doe@example.com');
      cy.get('img').should('have.attr', 'src').should('include', 'https://randomuser.me/api/portraits/men/75.jpg');
    });
  
    it('should allow logging out', () => {
      // Check if the logout button is present
      cy.contains('Log Out').should('exist');
  
      // Click the logout button
      cy.contains('Log Out').click();
  
      // After logging out, check if the user is redirected to login page
      cy.url().should('include', '/login');
    });
  
    it('should display and remove bookmarks correctly', () => {
      // Mock the bookmarked items (stored in localStorage or Redux)
      const mockBookmarks = [
        { id: '1', type: 'attraction', name: 'Eiffel Tower', details: 'Paris, France' },
        { id: '2', type: 'hotel', name: 'Hotel Paris', details: 'Located in central Paris' }
      ];
      localStorage.setItem('bookmarkedItems', JSON.stringify(mockBookmarks));
  
      // Reload the profile page
      cy.reload();
  
      // Check if bookmarks are displayed
      cy.contains('Your Bookmarks').should('exist');
      cy.get('.p-4').should('have.length', 2); // Ensure two items are rendered
  
      // Remove a bookmark
      cy.get('.text-red-500').first().click();
  
      // Ensure the bookmark is removed
      cy.get('.p-4').should('have.length', 1);
    });
  
    it('should display travel history correctly', () => {
      // Mock the travel history data
      const mockHistory = [
        {
          id: '1',
          destination: 'Paris, France',
          date: '2024-01-15',
          duration: '7 days',
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80'
        }
      ];
      localStorage.setItem('travelHistory', JSON.stringify(mockHistory));
  
      // Reload the profile page
      cy.reload();
  
      // Check if the travel history section is rendered
      cy.contains('Travel History').should('exist');
      cy.get('img').should('have.attr', 'src').should('include', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80');
      cy.contains('Paris, France').should('exist');
      cy.contains('7 days').should('exist');
    });
  
    it('should redirect to login if the user is not authenticated', () => {
      // Remove the current user data from localStorage to simulate a logged-out state
      localStorage.removeItem('currentUser');
  
      // Visit the profile page
      cy.visit('/profile');
  
      // Check if redirected to the login page
      cy.url().should('include', '/login');
    });
  });
  