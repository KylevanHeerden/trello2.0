describe("tests Navbar component", () => {
  it("Test Navbar if not logged in", () => {
    cy.visit("/");

    cy.get("[data-cypress=navDrawerBtn]").click();
    cy.get("[data-cypress=navDrawer]").should("not.visible");

    cy.get("[data-cypress=homeLink]").click();
    cy.url().should("include", "/login");

    cy.get("[data-cypress=notificationBell]").click();
    cy.get("[data-cypress=notificationDrawer]").should("not.visible");
  });

  it("Test Navbar when logged in", () => {
    cy.visit("/");
    cy.get("[data-cypress=loginEmail]").type("kylevh@nanodyn.co.za");
    cy.get("[data-cypress=loginPassword]").type("13579Moya.");
    cy.get("[data-cypress=loginBtn]").click();

    cy.wait(1000);

    cy.get("[data-cypress=navDrawerBtn]").click();
    cy.get("[data-cypress=navDrawer]").should("be.visible");
    cy.get(".v-overlay").click();

    cy.get("[data-cypress=homeLink]").click();
    cy.url().should("not.include", "/login");

    cy.get("[data-cypress=notificationBell]").click();
    cy.get("[data-cypress=notificationDrawer]").should("be.visible");

    cy.get(".v-overlay").click();
    cy.get("[data-cypress=logoutBtn]").click();
  });
});
