describe('Flights Page', () => {
    beforeEach(() => {
      cy.visit('/flights');
    });
  
    it('should load the flights page correctly', () => {
      cy.contains('Find Your Perfect Flight').should('be.visible');
      cy.get('form').should('be.visible');
    });
  
    it('should show an error message when no flights are available', () => {
      // Simulate an error response from the API
      cy.intercept('GET', '**/api/flights/offers*', {
        statusCode: 500,
        body: { message: 'Server Error' }
      }).as('getFlights');
  
      cy.get('form').submit();
      cy.wait('@getFlights');
      
      cy.contains('No flights available for this period and destination.').should('be.visible');
    });
  
    it('should search flights and display results', () => {
      // Mock the flight data API response
      cy.intercept('GET', '**/api/flights/offers*', {
        statusCode: 200,
        body: [
          {
            id: '1',
            itineraries: [{
              segments: [{
                departureAirport: 'JFK',
                arrivalAirport: 'LAX',
                departureTime: '2025-02-10T10:00:00',
                arrivalTime: '2025-02-10T13:00:00',
                flightNumber: 'AA100',
                duration: 180
              }],
              price: 150.00
            }]
          }
        ]
      }).as('getFlights');
  
      cy.get('input[placeholder="e.g., JFK"]').type('JFK');
      cy.get('input[placeholder="e.g., CDG"]').type('LAX');
      cy.get('input[type="date"]').first().type('2025-02-10');
      cy.get('input[type="number"]').type('1');
      cy.get('form').submit();
  
      cy.wait('@getFlights');
  
      cy.contains('Flight 1').should('be.visible');
      cy.contains('150.00 EUR').should('be.visible');
    });
  
    it('should add a bookmark when the heart button is clicked', () => {
      cy.intercept('GET', '**/api/flights/offers*', {
        statusCode: 200,
        body: [
          {
            id: '1',
            itineraries: [{
              segments: [{
                departureAirport: 'JFK',
                arrivalAirport: 'LAX',
                departureTime: '2025-02-10T10:00:00',
                arrivalTime: '2025-02-10T13:00:00',
                flightNumber: 'AA100',
                duration: 180
              }],
              price: 150.00
            }]
          }
        ]
      }).as('getFlights');
  
      cy.get('input[placeholder="e.g., JFK"]').type('JFK');
      cy.get('input[placeholder="e.g., CDG"]').type('LAX');
      cy.get('form').submit();
  
      cy.wait('@getFlights');
  
      cy.get('.absolute.top-4.right-4').click();
  
      cy.get('.text-red-500').should('be.visible');  // Ensure the bookmark icon is red after clicking
    });
  
    it('should navigate to accommodations page after selecting a flight', () => {
      cy.intercept('GET', '**/api/flights/offers*', {
        statusCode: 200,
        body: [
          {
            id: '1',
            itineraries: [{
              segments: [{
                departureAirport: 'JFK',
                arrivalAirport: 'LAX',
                departureTime: '2025-02-10T10:00:00',
                arrivalTime: '2025-02-10T13:00:00',
                flightNumber: 'AA100',
                duration: 180
              }],
              price: 150.00
            }]
          }
        ]
      }).as('getFlights');
  
      cy.get('input[placeholder="e.g., JFK"]').type('JFK');
      cy.get('input[placeholder="e.g., CDG"]').type('LAX');
      cy.get('form').submit();
  
      cy.wait('@getFlights');
  
      cy.get('.bg-white.p-6').first().click();  // Click on the first flight item
  
      cy.url().should('include', '/accommodations');  // Ensure it navigates to accommodations page
    });
  });
  