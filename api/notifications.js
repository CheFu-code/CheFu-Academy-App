const admin = require("firebase-admin");

const serviceAccount = require("./firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  token:
    "cKe2PSr3QMWV3E2GMQJfle:APA91bFBReLkwcyXIfLNKCGrfdmqYWW9fw60QmQBkG-rTnjfSk82y3Cia_Mgzw9okvMKrakFX4dyudoUAVhyV7BBHKOuhAmOrMbFF1f19KwuYvqenonS3zQ",
  notification: {
    title: "Hello!",
    body: "This is a test notification from FCM v1 API.",
  },
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
