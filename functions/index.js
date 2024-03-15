/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnFileUpload = functions.storage.object().onFinalize((object) => {
    // Perform actions here, like sending a notification
    const filePath = object.name; // The path to the file in Firebase Storage
    const fileSize = object.size; // The size of the file

    console.log(`New file uploaded at ${filePath}, size: ${fileSize}`);

    // Example: Send a notification using FCM (requires setting up FCM in your project)
    const message = {
        notification: {
            title: 'New File Uploaded',
            body: `A new file has been uploaded to Firebase Storage: ${filePath}`
        },
        topic: 'file-uploads' // You can use topics or specify tokens to send messages to specific devices/users
    };

    return admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            return null;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            return null;
        });
});
