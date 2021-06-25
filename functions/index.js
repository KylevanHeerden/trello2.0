const functions = require("firebase-functions");
// const gcs = require("@google-cloud/storage");
const path = require("path");
const axios = require("axios");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const hbs = require("nodemailer-express-handlebars");

admin.initializeApp();

// Imports the Google Cloud client library
// const { Storage } = require("@google-cloud/storage");

// Creates a client
// const storage = new Storage();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

const db = admin.firestore();

// Backups the firestore database
const firestore = require("@google-cloud/firestore");
// const e = require("express");
const client = new firestore.v1.FirestoreAdminClient();

const json2csv = require("json2csv").parse;
exports.csvJsonReport = functions.https.onRequest((request, response) => {
  const cardsRef = db.collection("cards");

  let programmeId = request.path.substring(1);

  return cardsRef
    .get()
    .then((querySnapshot) => {
      const exportArray = [];
      querySnapshot.forEach((doc) => {
        const card = doc.data();

        if (card.team.programme.programme_id === programmeId) {
          card.lineItems.forEach((lineItem) => {
            let lineItemFields = {
              component_description: card.nano_item_description,
              component_name: lineItem.item_name,
              quote_reference: card.supplier_quote_num,
              supplier: card.supplier_name,
              unit_cost: lineItem.unit_price,
              quantity: lineItem.quantity,
              total_cost: lineItem.unit_price * lineItem.quantity,
              VAT: card.currency == "R" ? "Excluded" : "N/A",
              currency: card.currency,
              date_ordered: card.updatedOn,
              lead_time_days: card.lead_time,
              payment_terms: card.payment_terms,
            };

            exportArray.push(lineItemFields);
          });
        }
      });

      if (exportArray.length > 0) {
        const csv = json2csv(exportArray);
        response.setHeader(
          "Content-disposition",
          "attachment; filename=report.csv"
        );
        response.set("Content-Type", "text/csv");
        response.set("Access-Control-Allow-Origin", "*");
        response.status(200).send(csv);
      } else {
        response.status(200).send("No data to be exported for this project.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Replace BUCKET_NAME
// staging = "gs://purchase-app-staging-firestore-backup2"
// production = "gs://purchase-app-f14b0-firestore-backup"

exports.backupFirestore = functions.pubsub
  .schedule("every day 00:00")
  .onRun((context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, "(default)");
    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: "gs://purchase-app-staging-firestore-backup2",
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [],
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response["name"]}`);
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Export operation failed");
      });
  });

// Saves lineItems to newly created card
exports.addLineItemsToCard = functions.firestore
  .document("line_items/{lineItemId}")
  .onCreate((snapshot) => {
    const data = snapshot.data();

    const cardRef = db.doc(`cards/${data.card_id}`);

    // const cardSnap = await cardRef.get();
    // const cardData = cardSnap.data();

    return cardRef.update({
      lineItems: admin.firestore.FieldValue.arrayUnion(data),
    });
  });

//Cloud functions triggered with file added to bucket
exports.addFilesToCard2 = functions.storage.object().onFinalize((object) => {
  const data = object;
  const filePath = data.name;
  const filePathArray = data.name.split("/");

  //https://storage.googleapis.com/purchase-app-f14b0.appspot.com/Quotes/Y4 - RCL/RJYksWVdVi9212WpL98s/C3I1JM15s8qV3M85ueLH/Nanodyne-Extra Instruments.pdf

  if (filePathArray.length == 5) {
    const filename = filePathArray[4];
    const cardId = filePathArray[3];

    // These options will allow temporary read access to the file
    // const options = {
    //   action: "read",
    //   expires: "12-21-2030",
    // };

    // // Get a v2 signed URL for the file
    // storage
    //   .bucket("gs://purchase-app-f14b0.appspot.com")
    //   .file(filePath)
    //   .getSignedUrl(options, function(err, url) {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }

    //     const cardRef = db.doc(`cards/${cardId}`);

    //     cardRef.update({
    //       files: admin.firestore.FieldValue.arrayUnion({
    //         file_name: filename,
    //         link: url,
    //       }),
    //     });
    //   });

    const cardRef = db.doc(`cards/${cardId}`);

    cardRef.update({
      files: admin.firestore.FieldValue.arrayUnion({
        file_name: filename,
        link: `https://storage.googleapis.com/purchase-app-staging.appspot.com/${filePath}`,
      }),
    });
  } else {
    const filename = filePathArray[3];
    const cardId = filePathArray[2];

    // // These options will allow temporary read access to the file
    // const options = {
    //   action: "read",
    //   expires: "12-21-2030", // one hour
    // };

    // // Get a v2 signed URL for the file
    // storage
    //   .bucket("gs://purchase-app-f14b0.appspot.com")
    //   .file(filePath)
    //   .getSignedUrl(options, function(err, url) {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }

    //     const cardRef = db.doc(`cards/${cardId}`);

    //     if (filePathArray[0] == "PurchaseOrders") {
    //       cardRef.update({
    //         purchase_order: admin.firestore.FieldValue.arrayUnion({
    //           file_name: filename,
    //           link: url,
    //         }),
    //       });
    //     } else if (filePathArray[0] == "QualityPhotos") {
    //       cardRef.update({
    //         quality_photos: admin.firestore.FieldValue.arrayUnion({
    //           file_name: filename,
    //           link: url,
    //         }),
    //       });
    //     }
    //   });

    const cardRef = db.doc(`cards/${cardId}`);

    if (filePathArray[0] == "PurchaseOrders") {
      cardRef.update({
        purchase_order: admin.firestore.FieldValue.arrayUnion({
          file_name: filename,
          link: `https://storage.googleapis.com/purchase-app-staging.appspot.com/${filePath}`,
        }),
      });
    } else if (filePathArray[0] == "QualityPhotos") {
      cardRef.update({
        quality_photos: admin.firestore.FieldValue.arrayUnion({
          file_name: filename,
          link: `https://storage.googleapis.com/purchase-app-staging.appspot.com/${filePath}`,
        }),
      });
    } else if (filePathArray[0] == "POP") {
      cardRef.update({
        POP: admin.firestore.FieldValue.arrayUnion({
          file_name: filename,
          link: `https://storage.googleapis.com/purchase-app-staging.appspot.com/${filePath}`,
        }),
      });
    }
  }

  return data;
});

// Send slack notification when new notification is added to firestore
exports.sendSlack = functions.firestore
  .document("notifications/{notificationId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();

    const tokenRef = db.doc(`slack/tokens`);
    const tokenSnap = await tokenRef.get();
    const tokenData = tokenSnap.data();
    const bot_token = tokenData.VUE_APP_SLACK_BOT_TOKEN;

    const cardRef = db.doc(`cards/${data.card_id}`);
    const cardSnap = await cardRef.get();
    const cardData = cardSnap.data();
    const cardName = cardData.name;

    if (data.status == "FollowUp") {
      const userRef = db.doc(`users/${data.user_id}`);

      const userSnap = await userRef.get();
      const userData = userSnap.data();
      const slack_id = userData.slack_id;

      const messageData = {
        token: `${bot_token}`,
        channel: `${slack_id}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${data.programme.programme_name}`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `The following card ${cardName} is awaiting follow up. Please follow the link below to complete the approval action.`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${data.product.product_name} - ${cardName}`,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              url: `https://purchase-app-staging.web.app/product/${data.product.product_id}`,
              action_id: "button-action",
            },
          },
          {
            type: "divider",
          },
        ],
      };

      if (userData.slackNotify === true) {
        axios
          .post("https://slack.com/api/chat.postMessage", messageData, {
            headers: {
              Authorization: `Bearer ${bot_token}`,
            },
          })
          .then((rep) => {
            console.log(rep);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (data.status == "Quality") {
      const userRef = db.doc(`users/${cardData.creator}`);

      const userSnap = await userRef.get();
      const userData = userSnap.data();
      const slack_id = userData.slack_id;

      const messageData = {
        token: `${bot_token}`,
        channel: `${slack_id}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${data.programme.programme_name}`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `The following card ${cardName} is awaiting ${data.status} approval. Please follow the link below to complete the approval action.`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${data.product.product_name} - ${cardName}`,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              url: `https://purchase-app-staging.web.app/product/${data.product.product_id}`,
              action_id: "button-action",
            },
          },
          {
            type: "divider",
          },
        ],
      };

      if (userData.slackNotify === true) {
        axios
          .post("https://slack.com/api/chat.postMessage", messageData, {
            headers: {
              Authorization: `Bearer ${bot_token}`,
            },
          })
          .then((rep) => {
            console.log(rep);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      const userRef = db.doc(`users/${data.user_id}`);

      const userSnap = await userRef.get();
      const userData = userSnap.data();
      const slack_id = userData.slack_id;

      const messageData = {
        token: `${bot_token}`,
        channel: `${slack_id}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${data.programme.programme_name}`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `The following card ${cardName} is awaiting ${data.status} approval. Please follow the link below to complete the approval action.`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${data.product.product_name} - ${cardName}`,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              url: `https://purchase-app-f14b0.web.app/product/${data.product.product_id}`,
              action_id: "button-action",
            },
          },
          {
            type: "divider",
          },
        ],
      };

      if (userData.slackNotify === true) {
        axios
          .post("https://slack.com/api/chat.postMessage", messageData, {
            headers: {
              Authorization: `Bearer ${bot_token}`,
            },
          })
          .then((rep) => {
            console.log(rep);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });

// {user_id: 'hQMnkZTR0KPWoE2J880ITp6S2mH3', programme: {programme_name: "Test programme"}, product: {product_name: "Test product", product_id: 'o0EfZ6WHlv0KLDD8oE8B'}, status: "Quality", card_id: '2QlQ1J9hNJjajtg7mVCy'}

// Send slack notification when new comment is added to firestore
exports.sendSlack2 = functions.firestore
  .document("comments/{commentsId}")
  .onCreate(async (snapshot) => {
    const commentData = snapshot.data();

    const tokenRef = db.doc(`slack/tokens`);
    const tokenSnap = await tokenRef.get();
    const tokenData = tokenSnap.data();
    const bot_token = tokenData.VUE_APP_SLACK_BOT_TOKEN;

    const cardRef = db.doc(`cards/${commentData.card_id}`);
    const cardSnap = await cardRef.get();
    const cardData = cardSnap.data();
    const cardTeam = cardData.team;

    const techApprovers = cardTeam.technical_approver.users;
    const purchaseApprovers = cardTeam.purchase_approver.users;
    const procures = cardTeam.procurer.users;

    const productRef = db.doc(`products/${cardData.product_id}`);
    const productSnap = await productRef.get();
    const productData = productSnap.data();
    const productName = productData.name;

    let users = [];

    const usersRef = db.collection("users");
    const usersSnap = await usersRef.get();

    usersSnap.forEach((doc) => {
      let user_objt = {
        email: doc.data().email,
        slack_id: doc.data().slack_id,
        emailNotify: doc.data().emailNotify,
        slackNotify: doc.data().slackNotify,
      };

      if (doc.data().slackNotify === true) {
        users.push(user_objt);
      }
    });

    let slackIdArray = [];

    techApprovers.forEach((user) => {
      if (users.some((e) => e.slack_id === user.slack_id)) {
        /* users contains the element we're looking for */
        slackIdArray.push(user.slack_id);
      }
    });

    purchaseApprovers.forEach((user) => {
      if (users.some((e) => e.slack_id === user.slack_id)) {
        /* users contains the element we're looking for */
        slackIdArray.push(user.slack_id);
      }
    });

    procures.forEach((user) => {
      if (users.some((e) => e.slack_id === user.slack_id)) {
        /* users contains the element we're looking for */
        slackIdArray.push(user.slack_id);
      }
    });

    var unique = slackIdArray.filter((v, i, a) => a.indexOf(v) === i);

    unique.forEach((id) => {
      const messageData = {
        token: `${bot_token}`,
        channel: `${id}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${cardData.team.programme.programme_name}`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${commentData.username} commented: `,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `"${commentData.text}"`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${productName} - ${cardData.name}`,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              url: `https://purchase-app-staging.web.app/product/${cardData.product_id}`,
              action_id: "button-action",
            },
          },
          {
            type: "divider",
          },
        ],
      };

      axios
        .post("https://slack.com/api/chat.postMessage", messageData, {
          headers: {
            Authorization: `Bearer ${bot_token}`,
          },
        })
        .then((rep) => {
          console.log(rep);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

// HTTP function to change documents in db - BE CAREFUL
exports.docsChange = functions.https.onRequest((request, response) => {
  // const FieldValue = admin.firestore.FieldValue;

  // db.collection("cards")
  //   .get()
  //   .then(function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //       doc.ref.update({ hubdock: FieldValue.delete() });
  //     });
  //   });
  return response.status(200).send("Done!");
});

// Send email notification when new notification is added to firestore
exports.sendEmailNotification = functions.firestore
  .document("notifications/{notificationId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();

    const userRef = db.doc(`users/${data.user_id}`);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    if (userData.emailNotify) {
      const cardRef = db.doc(`cards/${data.card_id}`);
      const cardSnap = await cardRef.get();
      const cardData = cardSnap.data();
      const cardName = cardData.name;

      // Create the transporter with the required configuration for Outlook
      // change the user and pass !
      var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
          ciphers: "SSLv3",
        },
        auth: {
          user: functions.config().outlook.email,
          pass: functions.config().outlook.password,
        },
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".html",
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
        extName: ".html",
      };

      // tell transporter to use template compiler
      transporter.use("compile", hbs(handlebarOptions));

      // setup e-mail data, even with unicode symbols
      var mailOptions = {
        from: '"RaptorApp" <dc@nanodyn.co.za>', // sender address (who sends)
        to: `${userData.email}`, // list of receivers (who receives)
        subject: "RaptorApp Notification", // Subject line
        template: "emailNotification",
        context: {
          programmeName: `${data.programme.programme_name}`,
          cardName: `${cardName}`,
          action: `${data.status}`,
          cardLink: `https://purchase-app-f14b0.web.app/product/${data.product.product_id}`,
        },
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }

        console.log("Message sent: " + info.response);
      });
    }
  });
