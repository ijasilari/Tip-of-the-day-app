describe("Testing the Profile page", () => {
  it("displays the user profile information", () => {
    //authenticate
    cy.login("newuser@example.com", "password");
    // Visit the Profilepage
    cy.contains("ProfilePage").click();

    cy.contains("Profile");
    cy.contains("Created:");
    cy.contains("Last updated:");
    cy.contains("Username: John Doe");
    cy.contains("Email: newuser@example.com");
    cy.wait(2000);
  });

  it("allows changing the password", () => {
    //authenticate
    cy.login("newuser@example.com", "password");
    // Visit the Profilepage
    cy.contains("ProfilePage").click();

    //change password
    cy.contains("Change Password").click();

    // enter invalid passwords and password pairs
    cy.get('input[name="password"]').type("short");
    cy.contains("Password must be atleast 8 characters or more").should(
      "be.visible"
    );
    cy.contains("Required re-enter new password").should("be.visible");
    cy.get('input[name="newpassword"]').type("shortpassword");
    cy.contains("Passwords arent same").should("be.visible");
    cy.get('input[name="password"]').clear();
    cy.contains("Required new password").should("be.visible");

    // Enter new password
    cy.get('input[name="password"]').clear().type("newpassword");
    cy.get('input[name="newpassword"]').clear().type("newpassword");

    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.contains("LOGOUT").click();
  });

  it("allows changing the email", () => {
    //authenticate
    cy.login("newuser@example.com", "newpassword");
    // Visit the Profilepage
    cy.contains("ProfilePage").click();

    // change email
    cy.contains("Change Email").click();

    // Enter invalid emails
    cy.get('input[name="email"]').type("newemail@example");
    cy.contains("Invalid email address").should("be.visible");
    cy.get('input[name="email"]').clear();
    cy.contains("Required email address").should("be.visible");

    // Enter valid new email
    cy.get('input[name="email"]').type("newemail@example.com");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the email was changed successfully
    cy.contains("newemail@example.com").should("be.visible");
  });

  it("allows changing the username", () => {
    //authenticate
    cy.login("newemail@example.com", "newpassword");
    // Visit the Profilepage
    cy.contains("ProfilePage").click();

    // change username
    cy.contains("Change Username").click();

    // Enter new username
    cy.get('input[name="username"]').type("newusername");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the username was changed successfully
    cy.contains("newusername").should("be.visible");
  });

  it("test login with new information", () => {
    //authenticate
    cy.login("newemail@example.com", "newpassword");
    // Visit the Profile page
    cy.contains("ProfilePage").click();

    cy.contains("Profile");
    cy.contains("Created:");
    cy.contains("Last updated:");
    cy.contains("Username: newusername");
    cy.contains("Email: newemail@example.com");
  });

  it("change all information at once", () => {
    //authenticate
    cy.login("newemail@example.com", "newpassword");
    // Visit the Profile page
    cy.contains("ProfilePage").click();

    //change password
    cy.contains("Change Password").click();

    // Enter new password
    cy.get('input[name="password"]').clear().type("password3");
    cy.get('input[name="newpassword"]').clear().type("password3");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // change email
    cy.contains("Change Email").click();

    // Enter valid new email
    cy.get('input[name="email"]').type("user.email@example.com");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the email was changed successfully
    cy.contains("user.email@example.com").should("be.visible");

    // change username
    cy.contains("Change Username").click();

    // Enter new username
    cy.get('input[name="username"]').type("User Name");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the username was changed successfully
    cy.contains("User Name").should("be.visible");
  });

  it("test login with new information", () => {
    //authenticate
    cy.login("user.email@example.com", "password3");
    // Visit the Profile page
    cy.contains("ProfilePage").click();

    cy.contains("Profile");
    cy.contains("Created:");
    cy.contains("Last updated:");
    cy.contains("Username: User Name");
    cy.contains("Email: user.email@example.com");
  });

  it("allows deleting the account", () => {
    //authenticate
    cy.login("user.email@example.com", "password3");
    // Visit the Profile page
    cy.contains("ProfilePage").click();

    cy.contains("Delete Account").click();

    // Confirm the deletion
    cy.get('[data-testid="deleteCheckbox"]').click();
    cy.get('[data-testid="deleteButton"]').click();

    // Assert that the user is redirected and the account was deleted
    cy.url().should("eq", "http://localhost/");
    cy.contains("Login");

    cy.login("user.email@example.com", "password3");
    cy.contains("Wrong credentials").should("be.visible");
  });
});
