describe("Test the programme view", () => {
  before(() => {
    cy.visit("/");
    cy.get("[data-cypress=loginEmail]").type("kylevh@nanodyn.co.za");
    cy.get("[data-cypress=loginPassword]").type("13579Moya.");
    cy.get("[data-cypress=loginBtn]").click();
    cy.wait(5000);
    cy.get("[data-cypress=ProgrammeCard]")
      .first()
      .click();
  });

  after(() => {
    cy.get("[data-cypress=logoutBtn]").click();
  });

  it("Test if elements render", () => {
    cy.get("[data-cypress=searchbar]").should("exist");
    cy.get("[data-cypress=progressCircle]").should("exist");
    cy.get("[data-cypress=programmeBoardLink]").should("exist");
    cy.get("[data-cypress=productCard]").should("exist");
  });

  it("Test if products show", () => {
    cy.get("[data-cypress=productCard]").should("exist");
    cy.get("[data-cypress=productCard]").contains("Cypress Item");
    cy.get("[data-cypress=productCard]").contains("Kyle Van Heerden");
  });

  it("Test searchbar", () => {
    cy.get("[data-cypress=searchbar]").type("yellow");
    cy.get("[data-cypress=productContainer]")
      .children()
      .should("have.length", 0);
    cy.get("[data-cypress=searchbar]").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}"
    );
  });

  it("Test if programme board link works", () => {
    cy.get("[data-cypress=productCard]").click();
    cy.url().should("include", "/product/");
  });
});
