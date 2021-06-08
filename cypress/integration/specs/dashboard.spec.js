describe("Tests for the dashboard page", () => {
  before(() => {
    cy.visit("/");
    cy.get("[data-cypress=loginEmail]").type("kylevh@nanodyn.co.za");
    cy.get("[data-cypress=loginPassword]").type("13579Moya.");
    cy.get("[data-cypress=loginBtn]").click();
    cy.wait(1000);
  });

  after(() => {
    cy.get("[data-cypress=logoutBtn]").click();
  });

  it("Test all elements render", () => {
    cy.get("[data-cypress=ProgrammeCard]").should("exist");
    cy.get("[data-cypress=ProgrammeCard]").contains("Cypress");
    cy.get("[data-cypress=ProgrammeCard]").contains("Cypress Team");
    cy.get("[data-cypress=addNewProgrammeBtn]").should("exist");
  });

  it("Test the programme card leads to right link", () => {
    cy.get("[data-cypress=ProgrammeCard]")
      .first()
      .click();
    cy.url().should("include", "/programme");
    cy.get("[data-cypress=homeLink]").click();
  });
});
