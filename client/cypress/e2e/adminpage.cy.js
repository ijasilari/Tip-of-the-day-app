describe("Testing the Admin page", () => {
  it("create a new user and tip for admin testing", () => {
    cy.visit("/auth");
    cy.contains("SignUp instead?").click();
    cy.get("#name").type("Test User");
    cy.get("#email").type("test.user@gmail.com");
    cy.get("#password").type("testuser");
    cy.contains("SIGNUP").click();
    cy.url().should("eq", "http://localhost/");

    // Visit the AddTip page to add a new tip
    cy.contains("Add Tip").click();
    // Open the dropdown
    cy.get(".dropdown-input").click();
    // Select the category
    cy.get(".dropdown-item").contains("JavaScript").click();
    // Enter tip description
    cy.get('textarea[name="description"]').type(
      "This is a test tip from cypress"
    );
    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.visit("/viewtips");
    cy.contains("This is a test tip from cypress").should("be.visible");
  });

  it("displays all the user information", () => {
    //authenticate
    cy.login("admin@gmail.com", "admin");
    // Visit the Adminpage
    cy.contains("AdminPage").click();

    // contains admin and test user information
    cy.contains("Admin Page").should("be.visible");
    cy.contains("Username: admin").should("be.visible");
    cy.contains("Email: admin@gmail.com").should("be.visible");
    cy.contains("Role: admin").should("be.visible");
    cy.wait(1000);

    cy.contains("Username: Test User").should("be.visible");
    cy.contains("Email: test.user@gmail.com").should("be.visible");
    cy.contains("Role: guest").should("be.visible");
    cy.wait(1000);

    cy.contains("Change Password").should("be.visible");
    cy.contains("Change Email").should("be.visible");
    cy.contains("Change Username").should("be.visible");
    cy.contains("Change Role").should("be.visible");
    cy.contains("Delete Account").should("be.visible");
  });

  it("Allows changing all the information of a user", () => {
    //authenticate
    cy.login("admin@gmail.com", "admin");
    // Visit the Adminpage
    cy.contains("AdminPage").click();

    //change password
    cy.contains("Change Password").click();

    // Enter new password
    cy.get('input[name="password"]').clear().type("password");
    cy.get('input[name="newpassword"]').clear().type("password");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // change email
    cy.contains("Change Email").click();

    // Enter valid new email
    cy.get('input[name="email"]').type("user.email@gmail.com");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the email was changed successfully
    cy.contains("user.email@gmail.com").should("be.visible");

    // change username
    cy.contains("Change Username").click();

    // Enter new username
    cy.get('input[name="username"]').type("User Name");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the username was changed successfully
    cy.contains("User Name").should("be.visible");

    // change role
    cy.contains("Change Role").click();

    // Enter new role
    cy.get(".dropdown-input").click({ multiple: true, force: true });
    cy.get(".dropdown-item").contains("admin").click();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert that the role was changed successfully
    cy.wait(1000);
    cy.contains("Role: admin").should("be.visible");
  });

  it("test login with new user information", () => {
    //authenticate
    cy.login("user.email@gmail.com", "password");
    // Visit the Admin page
    cy.contains("AdminPage").click();

    cy.contains("Username: User Name").should("be.visible");
    cy.contains("Email: user.email@gmail.com").should("be.visible");
    cy.contains("Role: admin").should("be.visible");
    cy.wait(1000);
  });

  it("allows deleting the account", () => {
    //authenticate
    cy.login("admin@gmail.com", "admin");
    // Visit the Admin page
    cy.contains("AdminPage").click();

    cy.contains("Delete Account").click();

    // Confirm the deletion
    cy.get('[data-testid="deleteCheckbox"]').click({ force: true });
    cy.get('[data-testid="deleteButton"]').click({ force: true });
  });

  it("can edit and delete any tips", () => {
    //authenticate
    cy.login("admin@gmail.com", "admin");
    cy.wait(2000);

    // Visit the view all tips page
    cy.contains("View All Tips").click();

    // should see edit and delete buttons
    cy.contains("Edit").should("be.visible");
    cy.contains("Delete").should("be.visible");

    // Can edit
    cy.contains("Edit").click();

    cy.get(".dropdown-input").click({ multiple: true, force: true });
    cy.get(".dropdown-item").contains("Java").click();

    cy.contains("Update Tip Description/Category").click({ force: true });
    cy.wait(2000);
    cy.contains("Java").eq(0);
    cy.wait(1000);

    // Can delete
    cy.contains("Delete").click();

    cy.get("This is a test tip from cypress").should("not.exist");
  });
});
