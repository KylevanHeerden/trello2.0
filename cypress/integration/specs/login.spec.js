describe("tests login page", () => {
  beforeEach(() => {
    cy.visit("/");
    //   cy.login2("kylevh@nanodyn.co.za", "13579Moya.");
  });

  //   afterEach(() => {
  //     cy.logout();
  //   });

  it("Test page render. Login form", () => {
    // Test for logo and slogan
    expect(cy.get("[data-cypress=nanodynLogo]")).to.exist;
    expect(cy.get("[data-cypress=nanodynSlogan1]")).to.exist;
    expect(cy.get("[data-cypress=nanodynSlogan2]")).to.exist;

    // Test for login form
    expect(cy.get("[data-cypress=loginForm]")).to.exist;
    expect(cy.get("[data-cypress=loginEmail]")).to.exist;
    expect(cy.get("[data-cypress=loginPassword]")).to.exist;
    expect(cy.get("[data-cypress=loginBtn]")).to.exist;

    // Test reset link shows but not modal
    expect(cy.get("[data-cypress=forgotPasswordLink]")).to.exist;
    cy.get("[data-cypress=resetPasswordModal]").should("not.exist");
    cy.get("[data-cypress=resetPasswordClearBtn]").should("not.exist");
    cy.get("[data-cypress=resetPasswordEmail]").should("not.exist");
    cy.get("[data-cypress=resetBtn]").should("not.exist");

    // Test signup link shows
    expect(cy.get("[data-cypress=createAccountLink]")).to.exist;
  });

  it("Test page render. Signup form", () => {
    // Test signup form if create account clicked
    cy.get("[data-cypress=createAccountLink]").click();
    expect(cy.get("[data-cypress=signupForm]")).to.exist;

    // Test Login form not to show
    cy.get("[data-cypress=loginForm]").should("not.exist");
    cy.get("[data-cypress=loginEmail]").should("not.exist");
    cy.get("[data-cypress=loginPassword]").should("not.exist");
    cy.get("[data-cypress=loginBtn]").should("not.exist");

    // Test reset link and modal should not show
    cy.get("[data-cypress=forgotPasswordLink]").should("not.exist");
    cy.get("[data-cypress=resetPasswordModal]").should("not.exist");
    cy.get("[data-cypress=resetPasswordClearBtn]").should("not.exist");
    cy.get("[data-cypress=resetPasswordEmail]").should("not.exist");
    cy.get("[data-cypress=resetBtn]").should("not.exist");

    cy.get("[data-cypress=signupName]").should("exist");
    cy.get("[data-cypress=signupSurname]").should("exist");
    cy.get("[data-cypress=signupEmail]").should("exist");
    cy.get("[data-cypress=signupPassword]").should("exist");

    cy.get("[data-cypress=backToLoginLink]").should("exist");
  });

  it("Test toggle between signup & login form", () => {
    cy.get("[data-cypress=loginForm]").should("exist");

    // Test signup form if create account clicked
    cy.get("[data-cypress=createAccountLink]").click();
    expect(cy.get("[data-cypress=signupForm]")).to.exist;
    cy.get("[data-cypress=loginForm]").should("not.exist");

    // Test back to login link
    cy.get("[data-cypress=backToLoginLink]").click();
    cy.get("[data-cypress=loginForm]").should("exist");
    cy.get("[data-cypress=signupForm]").should("not.exist");
  });

  it("Test login and logout", () => {
    cy.url().should("include", "/login");
    cy.get("[data-cypress=loginEmail]").type("kylevh@nanodyn.co.za");
    cy.get("[data-cypress=loginPassword]").type("13579Moya.");
    cy.get("[data-cypress=loginBtn]").click();

    cy.url().should("not.include", "/login");

    cy.get("[data-cypress=logoutBtn]").click();
    cy.url().should("include", "/login");
  });

  // TEST ONLY ONCE

  //   it("Test signup", () => {
  //     cy.get("[data-cypress=createAccountLink]").click();

  //     cy.get("[data-cypress=signupName]").type("Sam");
  //     cy.get("[data-cypress=signupSurname]").type("Smith");
  //     cy.get("[data-cypress=signupEmail]").type("sam@smith.com");
  //     cy.get("[data-cypress=signupPassword]").type("123456Sam.");
  //     cy.get("[data-cypress=signupBtn]").click();
  //     cy.url().should("not.include", "/login");
  //   });

  it("Test message if bad password for signup", () => {
    cy.get("[data-cypress=createAccountLink]").click();

    cy.get("[data-cypress=signupName]").click();
    cy.get("[data-cypress=signupSurname]").click();
    cy.get(".v-messages__message").contains("Required");
    cy.get("[data-cypress=signupPassword]").type("1234");
    cy.get(".v-messages__message").contains("Required");
    cy.get(".v-messages__message").contains(
      "Minimum 8 Charaters with a lowercase letter, a uppercase letter, a number and a special charater"
    );
  });

  it("Test bad login error message", () => {
    cy.get("[data-cypress=loginEmail]").type("sam");
    cy.get("[data-cypress=loginPassword]").type("123");
    cy.get("[data-cypress=loginBtn]").click();

    cy.get("[data-cypress=loginErrorMessage]").should("exist");
    cy.get("[data-cypress=loginErrorMessage]").contains(
      "Invalid email or password"
    );
  });

  it("Test reset modal", () => {
    cy.get("[data-cypress=forgotPasswordLink]").click();
    cy.get("[data-cypress=resetPasswordModal]").should("exist");

    cy.get("[data-cypress=resetPasswordClearBtn]").click();
    cy.get("[data-cypress=resetPasswordModal]").should("not.visible");

    cy.get("[data-cypress=forgotPasswordLink]").click();
    cy.get("[data-cypress=resetPasswordEmail]").click();
    cy.get(".v-card__actions").click();
    cy.get(".v-messages__message").contains("Required");

    cy.get("[data-cypress=resetPasswordEmail]").type("sam@smith.com");
    cy.get("[data-cypress=resetBtn]").click();

    cy.get("[data-cypress=resetPasswordModal]").should("not.visible");
  });
});
