describe('SignUp Component', () => {
    // Run before each test to set up mock responses if needed
    beforeEach(() => {
      cy.intercept('POST', '/api/signup', (req) => {
        if (req.body.email === 'duplicate@example.com') {
          req.reply({
            statusCode: 400,
            body: [{ code: 'DuplicateEmail', description: 'Email already exists.' }]
          });
        } else {
          req.reply({
            statusCode: 200,
            body: { message: 'Account registered successfully' }
          });
        }
      });
  
      cy.visit('/signup');
    });
  
    // Test case for rendering the form correctly
    it('should render the signup form correctly', () => {
      cy.get('h2').should('contain.text', 'Create Account');
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('input[name="lastName"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button').should('contain.text', 'Sign Up');
    });
  
    // Test case for form submission with valid data
    it('should submit the form with valid data and show success message', () => {
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="password"]').type('Valid123!');
  
      cy.get('button').click();
  
      // Assert that the API call was made and the user is redirected
      cy.url().should('include', '/login');
      cy.get('div').should('contain.text', 'Account registered successfully');
    });
  
    // Test case for form submission with invalid email (duplicate email)
    it('should show an error message when the email is already taken', () => {
      cy.get('input[name="firstName"]').type('Jane');
      cy.get('input[name="lastName"]').type('Smith');
      cy.get('input[name="email"]').type('duplicate@example.com');
      cy.get('input[name="password"]').type('Valid123!');
  
      cy.get('button').click();
  
      // Assert error message for duplicate email
      cy.get('.mt-4').should('contain.text', 'Email already exists.');
    });
  
    // Test case for password validation
    it('should show password validation errors when the password does not meet requirements', () => {
      cy.get('input[name="firstName"]').type('Alice');
      cy.get('input[name="lastName"]').type('Wonder');
      cy.get('input[name="email"]').type('alice@example.com');
      cy.get('input[name="password"]').type('short');
  
      cy.get('button').click();
  
      // Assert that the password requirements are not met
      cy.get('.text-gray-500').should('contain.text', 'At least 8 characters');
      cy.get('.text-gray-500').should('contain.text', 'At least one uppercase letter');
      cy.get('.text-gray-500').should('contain.text', 'At least one number');
      cy.get('.text-gray-500').should('contain.text', 'At least one special character');
    });
  
    // Test case for showing general error messages
    it('should show a general error message if an error occurs during sign up', () => {
      cy.intercept('POST', '/api/signup', {
        statusCode: 500,
        body: { message: 'An error occurred during registration' }
      });
  
      cy.get('input[name="firstName"]').type('Bob');
      cy.get('input[name="lastName"]').type('Builder');
      cy.get('input[name="email"]').type('bob.builder@example.com');
      cy.get('input[name="password"]').type('BobBuilder123!');
  
      cy.get('button').click();
  
      // Assert that a generic error message is displayed
      cy.get('.mt-4').should('contain.text', 'An error occurred during registration');
    });
  
    // Test case for form reset after successful signup
    it('should reset the form after successful signup', () => {
      cy.get('input[name="firstName"]').type('Tom');
      cy.get('input[name="lastName"]').type('Hanks');
      cy.get('input[name="email"]').type('tom.hanks@example.com');
      cy.get('input[name="password"]').type('TomHanks123!');
  
      cy.get('button').click();
  
      // Assert the form is cleared after successful sign up
      cy.get('input[name="firstName"]').should('have.value', '');
      cy.get('input[name="lastName"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('input[name="password"]').should('have.value', '');
    });
  
    // Test case for checking form responsiveness on mobile devices
    it('should display the form correctly on mobile view', () => {
      cy.viewport(375, 667);
  
      cy.get('h2').should('contain.text', 'Create Account');
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('input[name="lastName"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button').should('contain.text', 'Sign Up');
    });
  });
  