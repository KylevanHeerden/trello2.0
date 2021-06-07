// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
  apiKey: "AIzaSyBN8p2bCIh2lV1zHink6dxSYEDAcLyZOc8",
  authDomain: "purchase-app-staging.firebaseapp.com",
  projectId: "purchase-app-staging",
  storageBucket: "purchase-app-staging.appspot.com",
  messagingSenderId: "726471137559",
  appId: "1:726471137559:web:aa4257482011bfc6fb3f52",
  measurementId: "G-FJX2YZ8G6J",
};

firebase.initializeApp(fbConfig);

//firebaseLogin()

Cypress.Commands.add(
  "login2",
  (email = "example@example.com", password = "password") => {
    return firebase.default.auth().signInWithEmailAndPassword(email, password);
  }
);

attachCustomCommands({ Cypress, cy, firebase });
