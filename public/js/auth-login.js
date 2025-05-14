// auth-login.js

document.addEventListener("DOMContentLoaded", async () => {
  const errEl = document.getElementById("login-error");
  const form = document.getElementById("login-form");

  // 1) init Firebase
  try {
    const cfg = await fetch("/config").then((r) => r.json());
    firebase.initializeApp(cfg);
  } catch (e) {
    console.error("Failed to load config", e);
    errEl.textContent = "Configuration error.";
    return;
  }
  const auth = firebase.auth();
  const db = firebase.firestore();

  // 2) redirect if already signed in & approved
  auth.onAuthStateChanged(async (user) => {
    if (user && user.emailVerified) {
      const doc = await db.collection("registrations").doc(user.uid).get();
      if (doc.exists && doc.data().approved) {
        window.location.href = "portal.html";
      }
    }
  });

  // 3) error mapping
  const ERROR_MAP = {
    "auth/invalid-email": "Invalid email format.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-login-credentials": "Invalid credentials.",
    "auth/user-disabled": "Account disabled.",
    "auth/network-request-failed": "Network error, try again.",
  };

  // 4) form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.textContent = "";
    const email = form["login-email"].value.trim();
    const pass = form["login-password"].value;
    console.log("Attempt login", email);

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, pass);
      if (!user.emailVerified) {
        throw {
          code: "auth/email-not-verified",
          message: "Verify your email first.",
        };
      }
      const doc = await db.collection("registrations").doc(user.uid).get();
      if (!doc.exists || !doc.data().approved) {
        throw {
          code: "auth/not-approved",
          message: "Account pending approval.",
        };
      }
      // success
      window.location.href = "portal.html";
    } catch (err) {
      console.error("Login error", err);
      const msg = ERROR_MAP[err.code] || err.message || "Login failed.";
      errEl.textContent = msg;
    }
  });
});
