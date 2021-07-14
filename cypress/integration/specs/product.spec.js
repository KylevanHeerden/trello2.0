describe("Test product page", () => {
  before(() => {
    cy.visit("/");
    cy.get("[data-cypress=loginEmail]").type("kylevh@nanodyn.co.za");
    cy.get("[data-cypress=loginPassword]").type("13579Moya.");
    cy.get("[data-cypress=loginBtn]").click();
    cy.wait(3000);
    cy.get("[data-cypress=ProgrammeCard]")
      .first()
      .click();

    cy.get("[data-cypress=productCard]")
      .first()
      .click();
  });

  after(() => {
    cy.get("[data-cypress=logoutBtn]").click();
  });

  it("Test the product page element renders", () => {
    let list_status = [
      "Quotes",
      "Technical",
      "Purchase",
      "Purchase",
      "FollowUp",
      "Quality",
    ];

    list_status.forEach((status) => {
      cy.get(`[data-cypress=column-${status}]`).should("exist");
    });

    cy.get("[data-cypress=card]").should("exist");
    cy.get("[data-cypress=card]").contains("Cypress Card");
  });

  it("Test if card opens with info", () => {
    cy.get("[data-cypress=card]").click();

    cy.get("[data-cypress=cardDialog]").should("exist");

    cy.get("[data-cypress=cardDialogCloseBtn]").click();
    cy.get("[data-cypress=cardDialog]").should("not.visible");
  });

  it("Test if new card dialog toggles", () => {
    cy.get("[data-cypress=addNewCardBtn1]").click();
    cy.get("[data-cypress=addNewCardDialog]").should("exist");
    cy.get("[data-cypress=cancelNewCardBtn]").click();
    cy.get("[data-cypress=addNewCardDialog]").should("not.visible");

    cy.get("[data-cypress=addNewCardBtn1]").click();

    cy.get("[data-cypress=newCardName]").type("Cypress Card");

    cy.get("[data-cypress=newCardSupplier]")
      .parent()
      .click();

    cy.get(".v-list-item")
      .eq(4)
      .click();

    cy.get("[data-cypress=newCardContactPerson]").should(
      "have.value",
      "PersonA"
    );
    cy.get("[data-cypress=newCardContactNum]").should(
      "have.value",
      "0833750434"
    );
    cy.get("[data-cypress=newCardSuppEmail]").should(
      "have.value",
      "personA@supplierA.com"
    );

    cy.get("[data-cypress=newCardQuoteRef]").type("Cypress123");
    cy.get("[data-cypress=newCardItemDescrp]").type("Cypress Item");
    cy.get("[data-cypress=newCardLineItemNumber]").type("123");
    cy.get("[data-cypress=newCardLineItemName]").type("Cypress Item");
    cy.get("[data-cypress=newCardLineItemQuantity]").type("1");
    cy.get("[data-cypress=newCardLineItemPrice]").type("10.00");
    cy.get("[data-cypress=newCardLeadTime]").type("10");
    cy.get("[data-cypress=newCardPaymentTerms]").type("30 days");
    cy.get("[data-cypress=newCardVAT]").should("have.value", "1.50");
    cy.get("[data-cypress=newCardTotalExcVAT]").should("have.value", "10.00");
    cy.get("[data-cypress=newCardTotalInclVAT]").should("have.value", "11.50");

    cy.get("[data-cypress=cancelNewCardBtn]").click();

    cy.get("[data-cypress=card]").should("exist");
    cy.get("[data-cypress=card]").contains("Cypress Card");
  });

  it("Test exclude VAT checkbox", () => {
    cy.get("[data-cypress=addNewCardBtn1]").click();
    cy.get("[data-cypress=addNewCardDialog]").should("exist");

    cy.get("[data-cypress=newCardExcludeVAT]")
      .next()
      .click();

    cy.get("[data-cypress=newCardVAT]").should("not.exist");
    cy.get("[data-cypress=newCardTotalExcVAT]").should("not.exist");

    cy.get("[data-cypress=newCardExcludeVAT]")
      .next()
      .click();
  });

  it("Test the addition and remove of lineItem", () => {
    cy.get("[data-cypress=lineItem]").should("have.length", 1);

    cy.get("[data-cypress=addLineItemBtn]").click();
    cy.get("[data-cypress=lineItem]").should("have.length", 2);

    cy.get("[data-cypress=removeLineItemBtn]").click();
    cy.get("[data-cypress=lineItem]").should("have.length", 1);

    cy.get("[data-cypress=cancelNewCardBtn]").click();
  });

  //   it("Test card move action", () => {
  //     // cy.get("[data-cypress=card]").dragTo("[data-cypress=dragZone-Quality]");

  //     cy.get("[data-cypress=card]")
  //       .trigger("mousedown", { which: 1 })
  //       .trigger("mousemove", { clientX: 200, clientY: 0 })
  //       .trigger("mouseup", { force: true });
  //     cy.get("[data-cypress=progressCircle]").should(
  //       "have.css",
  //       "color",
  //       "rgb(92, 107, 192)"
  //     );
  //   });

  it("Test card show info", () => {
    cy.get("[data-cypress=card]")
      .first()
      .click();
    cy.get("[data-cypress=cardDialog]").should("exist");

    cy.get("[data-cypress=cardDialogCloseBtn]").click();
    cy.get("[data-cypress=cardDialog]").should("not.visible");

    cy.get("[data-cypress=card]")
      .first()
      .click();
    cy.get("[data-cypress=quoteInfoBtn]").click();

    cy.get("[data-cypress=quoteSupplierName]").should(
      "have.value",
      "SupplierA"
    );
    cy.get("[data-cypress=quoteContactPerson]").should("have.value", "PersonA");
    cy.get("[data-cypress=quoteContactNumber]").should(
      "have.value",
      "0833750434"
    );
    cy.get("[data-cypress=quoteContactEmail]").should(
      "have.value",
      "personA@supplierA.com"
    );
    cy.get("[data-cypress=quoteNum]").should("have.value", "Cypress123");
    cy.get("[data-cypress=quoteDesciption]").should(
      "have.value",
      "Cyrpess Item"
    );
    cy.get("[data-cypress=lineItemName]").should("have.value", "123");
    cy.get("[data-cypress=lineItemNum]").should("have.value", "Cypress Item");
    cy.get("[data-cypress=lineItemQuantity]").should("have.value", "1");
    cy.get("[data-cypress=lineItemUnitPrice]").should("have.value", "10.00");
    cy.get("[data-cypress=quoteLeadTime]").should("have.value", "10");
    cy.get("[data-cypress=quotePaymentTerms]").should("have.value", "30 days");
    cy.get("[data-cypress=quoteVAT]").should("have.value", "1.50");
    cy.get("[data-cypress=quoteTotalIncVAT]").should("have.value", "11.50");
    cy.get("[data-cypress=quoteExclVAT]").should("have.value", "10.00");
  });

  it("Test edit card", () => {
    cy.get("[data-cypress=cardEditBtn]").click();
    cy.get("[data-cypress=editCardSnackBar]").should("exist");

    cy.get("[data-cypress=cardEditCancelBtn]").click();
    cy.get("[data-cypress=editCardSnackBar]").should("not.visible");

    cy.get("[data-cypress=cardEditBtn]").click();
    cy.get("[data-cypress=quoteSupplierName]")
      .click()
      .type("{backspace}AA");
    cy.get("[data-cypress=cardEditSaveBtn]").click();

    cy.get("[data-cypress=updatedCardSnackbar]").should("exist");
    cy.get("[data-cypress=quoteSupplierName]").should(
      "have.value",
      "SupplierAA"
    );

    cy.get("[data-cypress=cardEditBtn]").click();
    cy.get("[data-cypress=quoteSupplierName]")
      .click()
      .type("{backspace}");
    cy.get("[data-cypress=cardEditSaveBtn]").click();
  });

  it("Test comments", () => {
    cy.get("[data-cypress=technicalInfo]").click();
    cy.get("[data-cypress=newCommentBtn]")
      .first()
      .click();
    cy.get("[data-cypress=newCommentInput]").should("exist");
    cy.get("[data-cypress=cancelNewCommentBtn]").click();
    cy.get("[data-cypress=newCommentInput]").should("not.exist");

    cy.get("[data-cypress=newCommentBtn]")
      .first()
      .click();
    cy.get("[data-cypress=newCommentInput]").type("Cypress Comment");
    cy.get("[data-cypress=submitNewCommentBtn]").click();

    cy.get("[data-cypress=comments]").should("exist");
    cy.get("[data-cypress=comments]")
      .last()
      .contains("Cypress Comment");
  });

  it("Test Quality Approval", () => {
    cy.get("[data-cypress=qualityInfo]").click();

    cy.get("[data-cypress=receiverSelect]")
      .parent()
      .click();

    cy.get(".v-list-item")
      .eq(6)
      .click();

    cy.get("[data-cypress=hubdocCheck]")
      .parent()
      .click();

    cy.get("[data-cypress=qualitySelect]")
      .parent()
      .click();

    cy.get(".v-list-item")
      .eq(9)
      .click();

    cy.get("[data-cypress=cardDialogCloseBtn]").click();
  });
});
