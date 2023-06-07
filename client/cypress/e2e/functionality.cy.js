describe("testing homepage", () => {
  it("loads and contains HomePage, homepage text, View All Tips nav and Login nav", () => {
    cy.visit("http://localhost");
    cy.contains("HomePage").should("be.visible");
    cy.contains("Welcome to TOTD (Tip Of The Day) Application").should(
      "be.visible"
    );
    cy.contains("View All Tips").should("be.visible");
    cy.contains("Add Tip").should("not.exist");
    cy.contains("My Tips").should("not.exist");
    cy.contains("ProfilePage").should("not.exist");
    cy.contains("Login").should("be.visible");
  });

  it("check that the light/dark theme works", () => {
    cy.visit("http://localhost");

    // Verify initial toggle theme state
    cy.get('[data-testid="themeSwitch"]').should("not.be.checked"); // The switch should be unchecked initially
    cy.get(".toggleLabel").should("contain", "Light Mode"); // The label should display 'Light Mode' initially

    // Test the 'light' theme
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)"); // Test the background color for the 'light' theme
    cy.get("h2, p, h5, h3, h1").should("have.css", "color", "rgb(0, 0, 0)"); // Test the text color for the 'light' theme

    // Toggle the switch
    cy.get('[data-testid="themeSwitch"]').click({ force: true }); // Simulate a click on the switch

    // Verify the updated state
    cy.get('[data-testid="themeSwitch"]').should("be.checked"); // The switch should be checked after clicking
    cy.get(".toggleLabel").should("contain", "Dark Mode"); // The label should display 'Dark Mode' after toggling

    // Test the 'dark' theme
    cy.get("#dark").should("have.css", "background-color", "rgb(0, 0, 0)"); // Test the background color for the 'dark' theme
    cy.get("h1, h2, h3, h4, h5, h6, hr, li, ol, p, ul").should(
      "have.css",
      "color",
      "rgb(236, 236, 236)"
    ); // Test the text color for the 'dark' theme

    // Toggle the switch back
    cy.get('[data-testid="themeSwitch"]').click({ force: true }); // Simulate another click on the switch

    // Verify the reverted state
    cy.get('[data-testid="themeSwitch"]').should("not.be.checked"); // The switch should be unchecked again
    cy.get(".toggleLabel").should("contain", "Light Mode"); // The label should display 'Light Mode' after toggling back
  });
});

describe("testing view all tips", () => {
  it("check to see if view all tips page works", () => {
    cy.visit("http://localhost");
    cy.contains("View All Tips").click();

    // Click the iconbutton without a category
    cy.get('[data-testid="fetchDataButton"]').click();
    cy.contains("Please choose a category.").should("be.visible");

    // Select category and click on the IconButton
    cy.get(".dropdown-input").click();
    cy.get(".dropdown-item").contains("JavaScript").click();
    cy.get('[data-testid="fetchDataButton"]').click();

    // Get all tips
    cy.get(".dropdown-input").click();
    cy.get(".dropdown-item").contains("All").click();
    cy.get('[data-testid="fetchDataButton"]').click();
  });
});

describe("Testing the AddTip page", () => {
  beforeEach(() => {
    //authenticate
    cy.login("newuser@example.com", "password");
    // Visit the AddTip page
    cy.contains("Add Tip").click();
  });

  it("should add a new tip", () => {
    // Check that everything is on the page
    cy.contains("Add New Tip To The List").should("be.visible");

    // Assert that the heading and text content are displayed correctly
    cy.get("h1.text").should("contain", "Attention!");
    cy.contains(
      "This page supports markdown and syntax highlight code. To create codeblock with highlight write:"
    ).should("exist");
    cy.contains("Example:").should("be.visible");
    cy.contains("Output:").should("be.visible");

    // Assert that the code block and syntax highlight are displayed correctly
    cy.get("pre").should("exist");
    cy.get("pre > code").should("exist");
    cy.get("pre > code")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("function() {");
      });

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

    // Check that the tip is on the view all tips -page
    cy.visit("/viewtips");
    cy.get(".dropdown-input").click();
    cy.get(".dropdown-item").contains("JavaScript").click();
    cy.get('[data-testid="fetchDataButton"]').click();
    cy.contains("This is a test tip from cypress").should("be.visible");
    cy.contains("Edit").should("be.visible");
    cy.contains("Delete").should("be.visible");
  });

  it("should display validation errors for empty form fields", () => {
    // Submit the form without entering any data
    cy.get('button[type="submit"]').click();

    // Assert that validation errors are displayed for category and description fields
    cy.contains("Required tip category").should("be.visible");
    cy.contains("Required tip description").should("be.visible");
  });
});

describe("Testing the My Tips page", () => {
  beforeEach(() => {
    //authenticate
    cy.login("newuser@example.com", "password");
    // Visit the My tips page
    cy.contains("My Tips").click();
  });

  it("check to see if my tips page works", () => {
    // Click the iconbutton without category
    cy.get('[data-testid="fetchDataButton"]').click();
    cy.contains("Please choose a category.").should("be.visible");

    cy.get(".dropdown-input").click();
    cy.get(".dropdown-item").contains("CSS").click();
    cy.get('[data-testid="fetchDataButton"]').click();

    // Select category and click on the IconButton
    cy.get(".dropdown-input").click();
    cy.get(".dropdown-item").contains("JavaScript").click();
    cy.get('[data-testid="fetchDataButton"]').click();

    cy.contains("This is a test tip from cypress").should("be.visible");
  });

  it("test the edit button", () => {
    cy.contains("Edit").click();

    cy.get('textarea[name="description"]').clear();
    cy.contains("Update Tip Description/Category").click();
    cy.contains("Required tip category").should("be.visible");
    cy.contains("Required tip description").should("be.visible");

    cy.get(".dropdown-input").click({ multiple: true, force: true });
    cy.get(".dropdown-item").contains("Java").click();

    cy.get('textarea[name="description"]')
      .clear()
      .type("This is an edited test tip from cypress");

    cy.contains("Update Tip Description/Category").click();
    cy.wait(2000);
    cy.contains("This is an edited test tip from cypress").should("be.visible");
  });

  it("test the delete button", () => {
    cy.contains("Delete").click();

    cy.get("This is an edited test tip from cypress").should("not.exist");
  });

  it("check that my tips page is empty", () => {
    cy.contains("You have not created any tips yet!").should("be.visible");
  });
});
