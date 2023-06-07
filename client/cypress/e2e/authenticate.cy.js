describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/auth");
  });

  it("Displays the login form", () => {
    cy.get('[data-testid="authPage"]').should("be.visible");
    cy.contains("Login").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("LOGIN").should("be.visible");
    cy.contains("SignUp instead?").should("be.visible");
  });

  it("Toggles to the sign-up form", () => {
    cy.contains("SignUp instead?").click();
    cy.contains("Sign Up").should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("SIGNUP").should("be.visible");
    cy.contains("Login instead?").should("be.visible");
  });

  it("Performs a successful sign-up", () => {
    cy.contains("SignUp instead?").click();
    cy.get("#name").type("John Doe");
    cy.get("#email").type("newuser@example.com");
    cy.get("#password").type("password");
    cy.contains("SIGNUP").click();
    cy.url().should("eq", "http://localhost/");
  });

  it("Performs a successful login", () => {
    cy.get("#email").type("newuser@example.com");
    cy.get("#password").type("password");
    cy.contains("LOGIN").click();
    cy.url().should("eq", "http://localhost/");
  });

  it("Displays error messages for invalid inputs", () => {
    cy.contains("SignUp instead?").click();
    cy.contains("SIGNUP").click(); //Submit without entering any input
    cy.get("#name").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.get("#email").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.get("#password").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.contains('"name" is not allowed to be empty').should("be.visible");
    cy.contains('"email" is not allowed to be empty').should("be.visible");
    cy.contains('"password" is not allowed to be empty').should("be.visible");

    cy.get("#name").type("Na"); // Enter an invalid username
    cy.get("#email").type("invalidemail"); // Enter an invalid email
    cy.get("#password").type("short"); // Enter a short password
    cy.contains("SIGNUP").click();
    cy.get("#name").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.get("#email").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.get("#password").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.contains('"name" length must be at least 3 characters long').should(
      "be.visible"
    );
    cy.contains('"email" must be a valid email').should("be.visible");
    cy.contains('"password" length must be at least 8 characters long').should(
      "be.visible"
    );

    cy.get("#name").clear().type("Username"); // Enter valid username
    cy.get("#email").clear().type("newuser@example.com"); // Enter an already in use email
    cy.get("#password").clear().type("longpassword"); // Enter a valid password
    cy.contains("SIGNUP").click();
    cy.get("#name").should(
      "have.css",
      "background-color",
      "rgb(212, 237, 218)"
    );
    cy.get("#email").should(
      "have.css",
      "background-color",
      "rgb(250, 128, 114)"
    );
    cy.get("#password").should(
      "have.css",
      "background-color",
      "rgb(212, 237, 218)"
    );
    cy.contains("Email exists").should("be.visible");
  });

  it("Displays error message for wrong credentials", () => {
    cy.contains("LOGIN").click(); // Submit without entering any input
    cy.contains("Wrong credentials").should("be.visible");
    cy.get("#email").type("wrongemail@example.com"); // Enter wrong email
    cy.get("#password").type("wrongpassword"); // Enter wrong password
    cy.contains("LOGIN").click();
    cy.contains("Wrong credentials").should("be.visible");
  });
});
