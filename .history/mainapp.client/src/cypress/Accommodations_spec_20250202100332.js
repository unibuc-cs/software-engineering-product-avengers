describe('Accommodations Page - E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/accommodations'); // Accesează pagina de cazări
    });
  
    it('loads the page and displays the title', () => {
      cy.contains('Find Your Perfect Stay').should('be.visible');
    });
  
    it('selects a sorting option', () => {
      cy.get('select').select('reviews');
      cy.get('select').should('have.value', 'reviews');
    });
  
    it('selects a hotel and enables the continue button', () => {
      cy.get('.hotel-card').first().click();
      cy.contains('Continue to Activities').should('not.be.disabled');
    });
  });
  