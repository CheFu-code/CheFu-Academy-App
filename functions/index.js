const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.expireMemberships = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const usersRef = db.collection("users");
  const now = new Date().toISOString();

  const snapshot = await usersRef.where("memberUntil", "<=", now).get();

  if (snapshot.empty) {
    console.log("✅ No expired memberships found.");
    return null;
  }

  const batch = db.batch();

  snapshot.forEach((doc) => {
    batch.update(doc.ref, { member: false });
    console.log(`⏳ Expired: ${doc.id}`);
  });

  await batch.commit();
  console.log(`✅ Memberships expired: ${snapshot.size}`);
  return null;
});
