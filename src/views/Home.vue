<template>
  <v-container fluid>
    <link
      href="https://fonts.googleapis.com/css2?family=Michroma&display=swap"
      rel="stylesheet"
    />
    <!-- <v-row align="center" justify="center">
      <v-col cols="5" align-self="center">
        <v-card class="paddingtop0" elevation="4">
          <v-container fill-height fluid class="paddingtop0">
            <v-row align="center" justify="center" class="paddingtop0">
              <v-col cols="8" align="center" align-self="center">
                <v-card
                  v-if="showLoginForm"
                  elevation="0"
                  min-width="300"
                  max-width="400"
                >
                  <v-img
                    lazy-src="@/assets/N1.png"
                    max-height="100"
                    max-width="700"
                    src="@/assets/N1.png"
                    contain
                    data-cypress="nanodynLogo"
                  ></v-img>
                  <h6 class="googleFont" data-cypress="nanodynSlogan1">
                    CREATING AN INNOVATION
                  </h6>
                  <h6
                    class="googleFont paddingbottom2rem"
                    data-cypress="nanodynSlogan2"
                  >
                    REVOLUTION
                  </h6>

                  <p class="message" data-cypress="loginErrorMessage">
                    {{ message }}
                  </p>
                  <v-form
                    @submit.prevent
                    class="paddingbottom2rem"
                    data-cypress="loginForm"
                  >
                    <v-text-field
                      v-model.trim="loginForm.email"
                      type="text"
                      label="Email"
                      id="email1"
                      outlined
                      rounded
                      class="v-input__control v-input__slot"
                      data-cypress="loginEmail"
                    ></v-text-field>

                    <v-text-field
                      v-model.trim="loginForm.password"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      id="password1"
                      label="Password"
                      outlined
                      rounded
                      class="v-input__control v-input__slot"
                      data-cypress="loginPassword"
                      @click:append="show = !show"
                      @keyup.enter="login()"
                    ></v-text-field>

                    <v-btn
                      @click="login()"
                      class="backgroundColorPrimary margintop2rem"
                      data-cypress="loginBtn"
                    >
                      Log In
                    </v-btn>
                    <div class="paddingtopbottom2rem">
                      <v-dialog v-model="showPasswordReset" width="600">
                        <template v-slot:activator="{ on, attrs }">
                          <a
                            @click="togglePasswordReset()"
                            v-bind="attrs"
                            v-on="on"
                            data-cypress="forgotPasswordLink"
                          >
                            Forgot Password
                          </a>
                        </template>

                        <v-card data-cypress="resetPasswordModal">
                          <v-card-title class="headline backgroundColorPrimary">
                            Reset Password
                            <v-spacer></v-spacer>
                            <v-btn
                              color="white"
                              icon
                              x-small
                              text
                              data-cypress="resetPasswordClearBtn"
                              @click="showPasswordReset = false"
                            >
                              <v-icon>clear</v-icon>
                            </v-btn>
                          </v-card-title>

                          <v-col cols="12" sm="8" md="8" class="cardCol">
                            <v-text-field
                              v-model="resetEmail"
                              label="Email"
                              data-cypress="resetPasswordEmail"
                              :rules="inputRulesEmail"
                            >
                            </v-text-field>
                          </v-col>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              data-cypress="resetBtn"
                              @click="sendPasswordReset()"
                            >
                              Reset
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <a
                        @click="toggleForm()"
                        class="paddingleft1rem"
                        data-cypress="createAccountLink"
                      >
                        Create an Account
                      </a>
                    </div>
                  </v-form>
                </v-card>
                <v-card v-else elevation="0" class="paddingbottom1rem">
                  <v-img
                    lazy-src="@/assets/N1.png"
                    max-height="70"
                    max-width="670"
                    src="@/assets/N1.png"
                    contain
                  ></v-img>
                  <h6 class="googleFont">CREATING AN INNOVATION</h6>
                  <h6 class="googleFont paddingbottom1rem">REVOLUTION</h6>

                  <form
                    @submit.prevent
                    class="margintop10px"
                    data-cypress="signupForm"
                  >
                    <v-text-field
                      v-model.trim="signupForm.name"
                      type="text"
                      label="Name"
                      id="name"
                      outlined
                      rounded
                      :rules="inputRulesRequired"
                      class="v-input__control v-input__slot"
                      data-cypress="signupName"
                    ></v-text-field>

                    <v-text-field
                      v-model.trim="signupForm.surname"
                      type="text"
                      label="Surname"
                      id="surname"
                      outlined
                      rounded
                      :rules="inputRulesRequired"
                      class="v-input__control v-input__slot"
                      data-cypress="signupSurname"
                    ></v-text-field>

                    <v-text-field
                      v-model.trim="signupForm.email"
                      type="text"
                      label="Email"
                      id="email2"
                      outlined
                      rounded
                      class="v-input__control v-input__slot"
                      data-cypress="signupEmail"
                    ></v-text-field>

                    <v-text-field
                      v-model.trim="signupForm.password"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      label="Password"
                      id="password2"
                      outlined
                      rounded
                      class="v-input__control v-input__slot "
                      hint="Minimum 8 Charaters with a lowercase letter, a uppercase letter, a number and a special charater"
                      :rules="inputRulesPassword"
                      @click:append="show = !show"
                      data-cypress="signupPassword"
                    ></v-text-field>

                    <v-btn
                      @click="signup()"
                      class="backgroundColorPrimary margintop30px"
                      data-cypress="signupBtn"
                    >
                      Sign Up
                    </v-btn>
                  </form>
                  <div class="margintop10px">
                    <a @click="toggleForm()" data-cypress="backToLoginLink">
                      Back to Log In <v-icon medium>arrow_right_alt</v-icon>
                    </a>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row> -->

    <v-row justify="center" align-content="center" class="mt-7">
      <v-col cols="12" sm="4" md="4" align="center">
        <v-card
          v-if="showLoginForm"
          elevation="5"
          min-width="300"
          max-width="400"
          class="pt-7"
        >
          <v-img
            lazy-src="@/assets/N1.png"
            max-height="100"
            max-width="700"
            src="@/assets/N1.png"
            contain
            data-cypress="nanodynLogo"
          ></v-img>
          <h6 class="googleFont" data-cypress="nanodynSlogan1">
            CREATING AN INNOVATION
          </h6>
          <h6
            class="googleFont paddingbottom2rem"
            data-cypress="nanodynSlogan2"
          >
            REVOLUTION
          </h6>

          <p class="message" data-cypress="loginErrorMessage">
            {{ message }}
          </p>
          <v-card-text class="pl-14 pr-14">
            <v-form
              @submit.prevent
              class="paddingbottom2rem"
              data-cypress="loginForm"
            >
              <v-text-field
                v-model.trim="loginForm.email"
                type="text"
                label="Email"
                id="email1"
                data-cypress="loginEmail"
              ></v-text-field>

              <v-text-field
                v-model.trim="loginForm.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                id="password1"
                label="Password"
                data-cypress="loginPassword"
                @click:append="show = !show"
                @keyup.enter="login()"
              ></v-text-field>

              <v-btn
                @click="login()"
                class="backgroundColorPrimary margintop2rem"
                data-cypress="loginBtn"
                :loading="loading"
              >
                Log In
              </v-btn>
              <div class="paddingtopbottom2rem">
                <v-dialog v-model="showPasswordReset" width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      @click="togglePasswordReset()"
                      v-bind="attrs"
                      v-on="on"
                      data-cypress="forgotPasswordLink"
                    >
                      Forgot Password
                    </a>
                  </template>

                  <v-card data-cypress="resetPasswordModal">
                    <v-card-title class="headline backgroundColorPrimary">
                      Reset Password
                      <v-spacer></v-spacer>
                      <v-btn
                        color="white"
                        icon
                        x-small
                        text
                        data-cypress="resetPasswordClearBtn"
                        @click="showPasswordReset = false"
                      >
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-col cols="12" sm="8" md="8" class="cardCol">
                      <v-text-field
                        v-model="resetEmail"
                        label="Email"
                        data-cypress="resetPasswordEmail"
                        :rules="inputRulesEmail"
                      >
                      </v-text-field>
                    </v-col>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        data-cypress="resetBtn"
                        @click="sendPasswordReset()"
                        :loading="loadingReset"
                      >
                        Reset
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <a
                  @click="toggleForm()"
                  class="paddingleft1rem"
                  data-cypress="createAccountLink"
                >
                  Create an Account
                </a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card v-else elevation="5" class="pt-7 pb-7">
          <v-img
            lazy-src="@/assets/N1.png"
            max-height="70"
            max-width="670"
            src="@/assets/N1.png"
            contain
          ></v-img>
          <h6 class="googleFont">CREATING AN INNOVATION</h6>
          <h6 class="googleFont paddingbottom1rem">REVOLUTION</h6>

          <v-card-text class="pl-16 pr-16">
            <form
              @submit.prevent
              class="margintop10px"
              data-cypress="signupForm"
            >
              <v-text-field
                v-model.trim="signupForm.name"
                type="text"
                label="Name"
                id="name"
                :rules="inputRulesRequired"
                data-cypress="signupName"
              ></v-text-field>

              <v-text-field
                v-model.trim="signupForm.surname"
                type="text"
                label="Surname"
                id="surname"
                :rules="inputRulesRequired"
                data-cypress="signupSurname"
              ></v-text-field>

              <v-text-field
                v-model.trim="signupForm.email"
                type="text"
                label="Email"
                id="email2"
                :rules="inputRulesRequired"
                data-cypress="signupEmail"
              ></v-text-field>

              <v-text-field
                v-model.trim="signupForm.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                label="Password"
                id="password2"
                hint="Minimum 8 Charaters with a lowercase letter, a uppercase letter, a number and a special charater"
                :rules="inputRulesPassword"
                @click:append="show = !show"
                data-cypress="signupPassword"
              ></v-text-field>

              <v-text-field
                v-model.trim="signupForm.slack_id"
                type="text"
                :rules="inputRulesRequired"
                label="Slack ID"
              ></v-text-field>

              <v-btn
                @click="signup()"
                class="backgroundColorPrimary margintop30px"
                data-cypress="signupBtn"
                :loading="loading"
              >
                Sign Up
              </v-btn>
            </form>
            <div class="mt-5">
              <a @click="toggleForm()" data-cypress="backToLoginLink">
                Back to Log In <v-icon medium>arrow_right_alt</v-icon>
              </a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from "@/firebase";

export default {
  components: {},
  data() {
    return {
      inputRulesEmail: [
        (v) => !!v || "Required",
        (v) =>
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) ||
          "Invalid email",
      ],
      inputRulesPassword: [
        (v) =>
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-]).{8,32}$/.test(
            v
          ) ||
          "Minimum 8 Charaters with a lowercase letter, a uppercase letter, a number and a special charater",
      ],
      inputRulesRequired: [(v) => !!v || "Required"],
      loading: false,
      loadingReset: false,
      loginForm: {
        email: "",
        password: "",
      },
      message: "",
      signupForm: {
        email: "",
        name: "",
        password: "",
        surname: "",
        slack_id: "",
      },
      show: false,
      showLoginForm: true,
      showPasswordReset: false,
      resetEmail: "",
    };
  },
  methods: {
    // Triggers the login function defined in vuex
    login() {
      this.loading = true;

      let login = this.$store.dispatch("login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
      });
      login.then((val) => {
        this.loading = false;
        this.message = val;
      });
    },

    // Triggers the logout function defined in vuex
    logout() {
      this.$store.dispatch("logout");
    },

    // Toggles between login and signup form
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },

    // Shows password reset option
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset;
    },

    // Triggers FB reset password function
    async sendPasswordReset() {
      this.loadingReset = true;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.resetEmail }),
      };
      const response = await fetch(
        "https://us-central1-nanodyn-cim.cloudfunctions.net/resetPassword",
        requestOptions
      );

      this.resetEmail = "";
      this.showPasswordReset = false;
    },

    // Triggers signup function defined in vuex
    signup() {
      this.loading = true;

      this.$store.dispatch("signup", {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        surname: this.signupForm.surname,
        slack_id: this.signupForm.slack_id,
      });
    },
  },
};
</script>

<style scoped>
.container {
  height: 74vh;
}

.minHeight {
  min-height: 8rem;
}

.googleFont {
  font-family: Michroma;
  color: #2b65b0d7;
}

.backgroundColorPrimary {
  background-color: #37474f !important;
  color: white;
}

.v-input__control {
  display: flex !important;
  flex-direction: 0 !important;
  /* height: 65px !important; */
  flex-grow: 0 !important;
  flex-wrap: wrap !important;
  min-width: 0 !important;
  width: 100% !important;
}

/* .v-input__slot {
  height: 65px !important;
} */

element.style {
  padding-bottom: 20%;
}

.paddingleft5px {
  padding-left: 5px;
}

.paddingleft1rem {
  padding-left: 1rem;
}

.paddingleft2rem {
  padding-left: 2rem;
}

.paddingleft3rem {
  padding-left: 3rem;
}

.paddingtopbottom2rem {
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}

.paddingtop10px {
  padding-top: 10px;
}

.paddingtop1rem {
  padding-bottom: 1rem;
}

.paddingbottom1rem {
  padding-bottom: 1rem !important;
}

.paddingbottom2rem {
  padding-bottom: 2rem !important;
}

.paddingbottom3rem {
  padding-bottom: 3rem !important;
}

.margintop2rem {
  margin-top: 2rem;
}

.margintop10px {
  margin-top: 10px;
}

.margintop20px {
  margin-top: 20px;
}

.margintop30px {
  margin-top: 30px;
}

.paddingtop0 {
  padding-top: 0px;
}

.paddingtop1rem {
  padding-top: 1rem !important;
}

.paddingtop2rem {
  padding-top: 2rem !important;
}

.paddingtop3rem {
  padding-top: 3rem !important;
}

.message {
  font-size: small;
  color: tomato;
}

.cardCol {
  margin-left: 2rem;
}
</style>
