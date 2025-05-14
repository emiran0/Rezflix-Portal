// portal-init.js
(async () => {
  const cfg = await (await fetch("/config")).json();
  firebase.initializeApp(cfg);
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) return (window.location.href = "/login.html");
    // Fetch profile
    const doc = await db.collection("registrations").doc(user.uid).get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("profile-name").textContent = data.name;
    }
    // show portal
    document.getElementById("portal").style.display = "";
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    auth.signOut();
  });
})();
