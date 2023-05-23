describe('testing homepage', () => {
  it('loads and contains HomePage, homepage text, View All Tips nav and Login nav', () => {
    cy.visit('http://localhost')
    cy.contains('HomePage').should('be.visible');
    cy.contains('Welcome to TOTD (Tip Of The Day) Application').should('be.visible');
    cy.contains('View All Tips').should('be.visible')
    cy.contains('Login').should('be.visible')
  })
})

describe('testing view all tips', () => {
  it('check to see if view all tips page works', () => {
    cy.visit('http://localhost');
    cy.get('[href="/viewtips"]').click();
    cy.url().should('include', 'viewtips');

    // Spy on the fetchDataByCategory function
    /*cy.window().then((win) => {
      cy.spy(win.ViewTips, 'fetchDataByCategory').as('fetchDataByCategory');
    });*/
  
    // Select category and click on the IconButton 
    cy.get('.dropdown-input').click();
    cy.get('.dropdown-item').contains('JavaScript').click();
    cy.get('[data-testid="fetchDataButton"]').click();
  
    // Assert that the fetchDataByCategory function was called
    //cy.get('@fetchDataByCategory').should('have.been.called');
   
    cy.contains('Tip Id').should('be.visible');
    cy.contains('Description').should('be.visible');
    cy.contains('Functions').should('be.visible');
  });
});

describe('Testing the AddTip page', () => {
  beforeEach(() => {
    //authenticate
    cy.login('newuser@example.com', 'password')
    // Visit the AddTip page
    cy.contains('Add Tip').click();
    cy.contains('Add New Tip To The List').should('be.visible');
  });


  it('should add a new tip', () => {
    // Open the dropdown
    cy.get('.dropdown-input').click();
    // Select the category
    cy.get('.dropdown-item').contains('JavaScript').click();
    // Enter tip description
    cy.get('textarea[name="description"]').type('This is a test tip from cypress');
    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check that the tip is on the view all tips -page
    cy.visit('/viewtips')
    cy.get('.dropdown-input').click();
    cy.get('.dropdown-item').contains('JavaScript').click();
    cy.get('[data-testid="fetchDataButton"]').click();
    cy.contains('This is a test tip from cypress').should('be.visible');
  });

  it('should display validation errors for empty form fields', () => {
    // Submit the form without entering any data
    cy.get('button[type="submit"]').click();

    // Assert that validation errors are displayed for category and description fields
    cy.contains('Required tip category').should('be.visible');
    cy.contains('Required tip description').should('be.visible');
  });
});


describe('Testing the My Tips page', () => {
  beforeEach(() => {
    //authenticate
    cy.login('newuser@example.com', 'password')
    // Visit the AddTip page
    cy.contains('My Tips').click()
  });

    it('check to see if my tips page works', () => {
      
      // Select category and click on the IconButton 
      cy.get('.dropdown-input').click();
      cy.get('.dropdown-item').contains('JavaScript').click();
      cy.get('[data-testid="fetchDataButton"]').click();
    
      cy.contains('This is a test tip from cypress').should('be.visible');
    });

    it('test the edit button', () => {
      cy.contains('Edit').click()

      cy.get('textarea[name="description"]').clear();
      cy.contains('Change Tip Description').click();
      //cy.contains('Required tip category').should('be.visible');
      cy.contains('Required tip description').should('be.visible');

      cy.get('.dropdown-input').click({multiple: true, force: true});
      cy.get('.dropdown-item').contains('Java').click();

      cy.get('textarea[name="description"]').clear().type('This is an edited test tip from cypress');
    
      cy.contains('Change Tip Description').click();
      cy.wait(2000);
      cy.contains('This is an edited test tip from cypress').should('be.visible');
    });

    it('test the delete button', () => {
      cy.contains('Delete').click()

      cy.get('This is an edited test tip from cypress').should('not.exist');
    });
  });
  