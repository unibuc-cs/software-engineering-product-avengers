describe('Activities Page - E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/activities');
    });
  
    it('loads the page and displays the title', () => {
      cy.contains('Discover Local Attractions').should('be.visible');
    });
  
    it('selects a sorting option (rating)', () => {
      cy.get('select').eq(1).select('rating');
      cy.get('select').eq(1).should('have.value', 'rating');
    });
  
    it('selects a sorting option (reviews)', () => {
      cy.get('select').eq(1).select('reviews');
      cy.get('select').eq(1).should('have.value', 'reviews');
    });
  
    it('selects a sorting option (name)', () => {
      cy.get('select').eq(1).select('name');
      cy.get('select').eq(1).should('have.value', 'name');
    });
  
    it('selects an attraction and enables the continue button', () => {
      cy.get('.hotel-card').first().click();
      cy.contains('Continue to Itinerary').should('not.be.disabled');
    });
  
    it('filters attractions based on type (restaurants)', () => {
      cy.get('select').eq(0).select('restaurant');
      cy.get('.hotel-card').each(($el) => {
        cy.wrap($el).should('contain.text', 'Restaurant');
      });
    });
  
    it('filters attractions based on type (museums)', () => {
      cy.get('select').eq(0).select('museum');
      cy.get('.hotel-card').each(($el) => {
        cy.wrap($el).should('contain.text', 'Museum');
      });
    });
  
    it('toggles attraction selection and activates the continue button', () => {
      cy.get('.hotel-card').first().click();
      cy.get('input[type="checkbox"]').first().check();
      cy.contains('Continue to Itinerary').should('not.be.disabled');
    });
  
    it('disables continue button if no attraction is selected', () => {
      cy.contains('Continue to Itinerary').should('be.disabled');
    });
  });
  