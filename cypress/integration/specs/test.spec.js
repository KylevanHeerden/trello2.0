describe("Some Test", () => {
  it("Adds document to test_hello_world collection of Firestore", () => {
    cy.visit("/");
    cy.logout();
    cy.login2("kylevh@nanodyn.co.za", "13579Moya.");

    cy.get("[data-cypress=Programme-Test]");
    cy.logout();
  });
});
