describe("Shows Appeteasers", () => {
  it("Connects to Dev Server", () => {
    cy.visit("https://hangryhippo.quantic.host/");
  });

  it("Selects Handhelds", () => {
    cy.contains("Handhelds").click();
    cy.contains("Cheese Burger");
    cy.contains("Fajita Tacos");
  });

  it("Selects Appeteasers", () => {
    cy.contains("Appeteasers").click();

    // Example items to check
    cy.contains("Tater Tots");
    cy.contains("Buffalo Wings");

    // Ensure Handhelds items are not visible
    cy.contains("Cheese Burger").should("not.exist");
    cy.contains("Fajita Tacos").should("not.exist");
  });
});
