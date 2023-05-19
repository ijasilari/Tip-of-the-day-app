describe('Authentication', () => {
    beforeEach(() => {
      cy.visit('/auth');
    });
  
    it('Displays the login form', () => {
      cy.get('[data-testid="authPage"]').should('be.visible');
      cy.contains('Login').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Password').should('be.visible');
      cy.contains('LOGIN').should('be.visible');
      cy.contains('SignUp instead?').should('be.visible');
    });
  
    it('Toggles to the sign-up form', () => {
      cy.contains('SignUp instead?').click();
      cy.contains('Sign Up').should('be.visible');
      cy.contains('Name').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Password').should('be.visible');
      cy.contains('SIGNUP').should('be.visible');
      cy.contains('Login instead?').should('be.visible');
    });
  
    it('Performs a successful sign-up', () => {
      cy.contains('SignUp instead?').click();
      cy.get('#name').type('John Doe');
      cy.get('#email').type('newuser@example.com');
      cy.get('#password').type('password');
      cy.contains('SIGNUP').click();
      cy.get('#name').should('have.css', 'background-color', 'rgb(212, 237, 218)');
      cy.get('#email').should('have.css', 'background-color', 'rgb(212, 237, 218)');
      cy.get('#password').should('have.css', 'background-color', 'rgb(212, 237, 218)');
      cy.url().should('eq', 'http://localhost/auth');
    });
    
    it('Performs a successful login', () => {
      cy.get('#email').type('newuser@example.com');
      cy.get('#password').type('password');
      cy.contains('LOGIN').click();
      cy.url().should('eq', 'http://localhost/'); 
    }); 

  });