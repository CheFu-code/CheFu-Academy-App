export const handleFirebaseAuthError = (e) => {
  if (!e || !e.code) {
    throw new Error("An unknown error occurred. Please try again.");
  }

  switch (e.code) {
    case "auth/email-already-in-use":
      throw new Error(
        "This email is already in use. Please use a different email."
      );
    case "auth/invalid-email":
      throw new Error("The email address is not valid.");
    case "auth/weak-password":
      throw new Error("Password should be at least 6 characters.");
    case "auth/operation-not-allowed":
      throw new Error(
        "Email/password accounts are not enabled. Please contact support."
      );
    case "auth/missing-email":
      throw new Error("Please enter your email address.");
    case "auth/too-many-requests":
      throw new Error("Too many attempts. Please try again later.");
    case "auth/internal-error":
      throw new Error("Internal error. Please try again later.");
    default:
      if (e.message && e.message.includes("network")) {
        throw new Error(
          "Network error: Please check your internet connection and try again."
        );
      } else {
        throw new Error(e.message);
      }
  }
};
