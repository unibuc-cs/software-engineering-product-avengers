describe('Itinerary Component', () => {
    beforeEach(() => {
      // Set up the required data in localStorage to simulate real-world scenario
      const flightData = {
        flight: {
          itineraries: [
            {
              segments: [
                {
                  arrivalTime: '2025-02-01T10:00:00',
                  duration: 120,
                },
              ],
            },
            {
              segments: [
                {
                  departureTime: '2025-02-10T15:00:00',
                  duration: 120,
                },
              ],
            },
          ],
        },
      };
      const accommodationData = { hotel: { name: 'Test Hotel' } };
      const attractionsData = [
        { place_id: '1', name: 'Test Attraction', types: ['attraction'] },
      ];
  
      localStorage.setItem('selectedFlight', JSON.stringify(flightData));
      localStorage.setItem('selectedAccommodation', JSON.stringify(accommodationData));
      localStorage.setItem('selectedAttractions', JSON.stringify(attractionsData));
  
      cy.visit('/itinerary'); // Make sure the page loads
    });
  
    it('should load the itinerary page', () => {
      // Check if the title is rendered
      cy.contains('Plan Your Journey').should('be.visible');
  
      // Check if Day navigation buttons are visible
      cy.get('button').contains('Day 1').should('be.visible');
      cy.get('button').contains('Day 2').should('be.visible');
    });
  
    it('should navigate between days correctly', () => {
      // Initially, Day 1 should be selected
      cy.contains('Day 1 of 10').should('be.visible');
      
      // Navigate to the next day
      cy.get('button').contains('→').click();
      cy.contains('Day 2 of 10').should('be.visible');
  
      // Navigate back to Day 1
      cy.get('button').contains('←').click();
      cy.contains('Day 1 of 10').should('be.visible');
    });
  
    it('should add an activity to a time slot', () => {
      // Open the modal by clicking an available time slot
      cy.get('.text-gray-600').contains('08:00').click();
      
      // Check if the activity modal appears
      cy.get('div').contains('Available Activities').should('be.visible');
      
      // Add an activity
      cy.get('.p-4').contains('Test Attraction').click();
  
      // Check if the activity is added
      cy.get('.bg-blue-50').contains('Test Attraction').should('be.visible');
    });
  
    it('should remove an activity from a time slot', () => {
      // Add an activity first
      cy.get('.text-gray-600').contains('08:00').click();
      cy.get('.p-4').contains('Test Attraction').click();
  
      // Check if the activity appears
      cy.get('.bg-blue-50').contains('Test Attraction').should('be.visible');
  
      // Remove the activity
      cy.get('.bg-blue-50').contains('Test Attraction')
        .find('button')
        .click();
  
      // Check if the activity is removed
      cy.get('.bg-blue-50').contains('Test Attraction').should('not.exist');
    });
  
    it('should prevent adding activities outside the allowed time slots', () => {
      // Check if the time slot is available (before flight arrival time)
      cy.contains('07:00').should('have.class', 'text-gray-400');
      cy.get('.bg-gray-100').should('be.visible');
    });
  
    it('should save the trip to the backend', () => {
      cy.intercept('POST', 'YOUR_BACKEND_API_URL/trips', {
        statusCode: 200,
        body: { success: true },
      }).as('saveTrip');
      
      cy.get('button').contains('Save Trip').click();
      
      cy.wait('@saveTrip').its('response.statusCode').should('eq', 200);
  
      // Check that it navigates to the success page
      cy.url().should('include', '/trip-success');
    });
  });
  