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
    // Visit the My tips page
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
  
  describe('Testing the Profile page', () => {  
    it('displays the user profile information', () => {
      //authenticate
      cy.login('newuser@example.com', 'password')
      // Visit the Profilepage
      cy.contains('ProfilePage').click()

      cy.contains('Profile');
      cy.contains('Created:');
      cy.contains('Last updated:');
      cy.contains('Username: John Doe');
      cy.contains('Email: newuser@example.com');
      cy.wait(2000);
    });
  
    it('allows changing the password', () => {
      //authenticate
      cy.login('newuser@example.com', 'password')
      // Visit the Profilepage
      cy.contains('ProfilePage').click()

      //change password
      cy.contains('Change Password').click();
  
      // enter invalid passwords and password pairs
      cy.get('input[name="password"]').type('short');
      cy.contains('Password must be atleast 8 characters or more').should('be.visible');
      cy.contains('Required re-enter new password').should('be.visible');
      cy.get('input[name="newpassword"]').type('shortpassword');
      cy.contains('Passwords arent same').should('be.visible');
      cy.get('input[name="password"]').clear();
      cy.contains('Required new password').should('be.visible');
      
      // Enter new password
      cy.get('input[name="password"]').clear().type('newpassword');
      cy.get('input[name="newpassword"]').clear().type('newpassword');
  
      // Submit the form
      cy.get('button[type="submit"]').click();

      cy.contains('LOGOUT').click();
    });

    it('allows changing the email', () => {
      //authenticate
      cy.login('newuser@example.com', 'newpassword')
      // Visit the Profilepage
      cy.contains('ProfilePage').click()
      
      // change email
      cy.contains('Change Email').click();
  
      // Enter invalid emails
      cy.get('input[name="email"]').type('newemail@example');
      cy.contains('Invalid email address').should('be.visible');
      cy.get('input[name="email"]').clear();
      cy.contains('Required email address').should('be.visible');
      //already existing email??

      // Enter valid new email
      cy.get('input[name="email"]').type('newemail@example.com');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the email was changed successfully
      cy.contains('newemail@example.com').should('be.visible');
    });

    it('allows changing the username', () => {
      //authenticate
      cy.login('newemail@example.com', 'newpassword')
      // Visit the Profilepage
      cy.contains('ProfilePage').click()

      // change username
      cy.contains('Change Username').click();
  
      // Enter new username
      cy.get('input[name="username"]').type('newusername');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the username was changed successfully
      cy.contains('newusername').should('be.visible');
    });

    it('test login with new information', () => {
      //authenticate
      cy.login('newemail@example.com', 'newpassword')
      // Visit the AddTip page
      cy.contains('ProfilePage').click()

      cy.contains('Profile');
      cy.contains('Created:');
      cy.contains('Last updated:');
      cy.contains('Username: newusername');
      cy.contains('Email: newemail@example.com');
    });

    it('allows deleting the account', () => {
      //authenticate
      cy.login('newemail@example.com', 'newpassword')
      // Visit the AddTip page
      cy.contains('ProfilePage').click()
      
      cy.contains('Delete Account').click();
  
      // Confirm the deletion
      cy.get('[data-testid="deleteCheckbox"]').click();
      cy.get('[data-testid="deleteButton"]').click();
  
      // Assert that the account was deleted and user is redirected
      cy.url().should('eq', 'http://localhost/');
      cy.contains('Login');
    });
  });