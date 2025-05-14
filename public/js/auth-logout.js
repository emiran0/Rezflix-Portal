// auth-logout.js
(async () => {
  const cfg = await (await fetch("/config")).json();
  firebase.initializeApp(cfg);
  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (!user) window.location.href = "/login.html";
    else document.getElementById("portal").style.display = "";
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    auth.signOut();
  });
})();
