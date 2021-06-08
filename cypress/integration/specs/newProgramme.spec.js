describe("Test the NewProgramme component", () => {
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

  it("Test if modal works", () => {
    cy.get("[data-cypress=addNewProgrammeBtn]").click();
    cy.get("[data-cypress=newProgrammeModal]").should("be.visible");

    cy.get("[data-cypress=newProgrammeCancelBtn]").click();
    cy.get("[data-cypress=newProgrammeModal]").should("not.be.visible");
  });

  //   it("Test if new programme is added", () => {
  //     cy.get("[data-cypress=addNewProgrammeBtn]").click();

  //     cy.get("[data-cypress=newProgTechnicalAuth]")
  //       .parent()
  //       .click();

  //     cy.get(".v-list-item")
  //       .eq(6)
  //       .click();

  //     cy.get("[data-cypress=newProgProcurer]")
  //       .parent()
  //       .click();

  //     cy.get(".v-list-item")
  //       .eq(9)
  //       .click();

  //     cy.get("[data-cypress=newProgPurchaseAuth]")
  //       .parent()
  //       .click();

  //     cy.get(".v-list-item")
  //       .eq(12)
  //       .click();

  //     cy.get("[data-cypress=newProgrammeTitle]").type("Cypress");
  //     cy.get("[data-cypresss=newProgrammeTeam]").type("Cypress Team");
  //     cy.get("[data-cypress=budgetValue]").type("1000000.00");

  //     cy.get("[data-cypress=newProgrammeAddBtn]").click();

  //     cy.wait(1000);
  //     cy.get("[data-cypress=ProgrammeCard]").contains("Cypress");
  //   });

  it("Test if error show with validation rules", () => {
    cy.get("[data-cypress=addNewProgrammeBtn]").click();

    cy.get("[data-cypress=newProgTechnicalAuth]")
      .parent()
      .click();

    cy.get("[data-cypress=newProgProcurer]")
      .parent()
      .click();

    cy.get(".v-messages__message").contains("Required");
    cy.get("[data-cypress=newProgPurchaseAuth]")
      .parent()
      .click();
    cy.get(".v-messages__message").contains("Required");

    cy.get("[data-cypress=newProgrammeTitle]").type(" ");
    cy.get(".v-messages__message").contains("Minimum length is 3 characters");
    cy.get("[data-cypresss=newProgrammeTeam]").type(" ");
    cy.get(".v-messages__message").contains("Minimum length is 3 characters");
    cy.get("[data-cypress=budgetValue]").type(" ");
    cy.get(".v-messages__message").contains("Must be in the format R0.00");

    cy.get("[data-cypress=newProgrammeCancelBtn]").click();
  });
});
