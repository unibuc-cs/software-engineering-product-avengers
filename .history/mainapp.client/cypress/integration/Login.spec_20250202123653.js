describe('Login Component', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the login form correctly', () => {
      cy.get('h1').should('contain', 'Log In');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Log In');
    });
  
    it('should show success message on successful registration', () => {
      cy.visit('/login', {
        onBeforeLoad(win) {
          win.history.pushState(
            { registrationSuccess: true, message: 'Registration successful! Please log in.' },
            ''
          );
        },
      });
      
      cy.get('.bg-green-100').should('contain', 'Registration successful! Please log in.');
    });
  
    it('should show error message for invalid login', () => {
      cy.get('input[type="email"]').type('invalidemail@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('form').submit();
  
      cy.get('.bg-red-100').should('contain', 'Invalid email or password.');
    });
  
    it('should navigate to profile page after successful login', () => {
      cy.intercept('POST', '/api/login', { statusCode: 200 }).as('loginRequest');
  
      cy.get('input[type="email"]').type('validemail@example.com');
      cy.get('input[type="password"]').type('correctpassword');
      cy.get('form').submit();
  
      cy.wait('@loginRequest');
      cy.url().should('include', '/profile');
    });
  });
  