// auth-register.js
document.addEventListener("DOMContentLoaded", async () => {
  const errEl = document.getElementById("reg-error");
  const successEl = document.getElementById("reg-success");
  const form = document.getElementById("register-form");

  // Init Firebase App
  const cfg = await fetch("/config").then((r) => r.json());
  firebase.initializeApp(cfg);
  const auth = firebase.auth();

  // Error mapping
  const ERROR_MAP = {
    "auth/email-already-in-use": "Email already in use.",
    "auth/invalid-email": "Invalid email.",
    "auth/weak-password": "Password must be ≥6 characters.",
    "auth/network-request-failed": "Network error, try again.",
    "operation-not-allowed": "Registration disabled.",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.textContent = "";
    successEl.textContent = "";

    const name = form["reg-name"].value.trim();
    const username = form["reg-username"].value.trim();
    const email = form["reg-email"].value.trim();
    const pass = form["reg-password"].value;
    const pass2 = form["reg-password2"].value;

    if (!name || !username || !email || !pass || !pass2) {
      return (errEl.textContent = "All fields are required.");
    }
    if (pass !== pass2) {
      return (errEl.textContent = "Passwords do not match.");
    }

    try {
      // 1) Create user in Firebase Auth
      const { user } = await auth.createUserWithEmailAndPassword(email, pass);
      // 2) Send verification email
      await user.sendEmailVerification();

      // 3) Refresh token to ensure fresh ID token
      const idToken = await user.getIdToken(true);

      // 4) Call your backend to write the registration doc
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: user.uid, name, username }),
      });

      const payload = await res.json();
      if (!payload.success)
        throw new Error(payload.error || "Registration error");

      successEl.textContent =
        "Almost done! Check your email (incl. spam) for verification. " +
        "Once you verify and are approved, you can log in.";
      form.reset();
    } catch (err) {
      console.error(err);
      const code = err.code || err.message;
      errEl.textContent =
        ERROR_MAP[code] || err.message || "Registration failed.";
    }
  });
});
