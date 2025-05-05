// Define your apps here; add new objects to this array later
const apps = [
    {
      id: "plex",
      name: "Plex",
      logo: "assets/logos/plex.png",
      link: "https://rezflix.local:32400",
      description: "Your personal media server."
    },
    {
      id: "request",
      name: "Rezflix Request",
      logo: "assets/logos/request.png",
      link: "https://rezflix.local/request",
      description: "Log in with your Plex account and create requests for movies/TV shows."
    }
    // …add more apps here
  ];
  
  // Guide content keyed by app.id
  const guides = {
    plex: {
      title: "How to use Plex",
      content: `
        <ol>
          <li>Open the <a href="https://rezflix.local:32400" target="_blank">Plex Web App</a>.</li>
          <li>Log in with your Plex account.</li>
          <li>Browse and play your media!</li>
        </ol>`
    },
    request: {
      title: "How to use Rezflix Request",
      content: `
        <ol>
          <li>Visit <a href="https://rezflix.local/request" target="_blank">Rezflix Request</a>.</li>
          <li>Authenticate with your Plex credentials.</li>
          <li>Search and request your desired movies or TV shows.</li>
        </ol>`
    }
    // …add more guides here
  };
  
  function renderApps() {
    const container = document.getElementById("apps-container");
    container.innerHTML = ""; // clear previous
    apps.forEach(app => {
      const card = document.createElement("div");
      card.className = "app-card";
      card.innerHTML = `
        <div class="app-header">
          <img src="${app.logo}" alt="${app.name} logo">
          <h3>${app.name}</h3>
        </div>
        <p>${app.description}</p>
        <div class="button-group">
          <a href="${app.link}" target="_blank" class="button open-btn">
            <i class="fa-solid fa-up-right-from-square"></i> Open
          </a>
          <a href="#guide-${app.id}" class="button guide-btn">
            <i class="fa-solid fa-book-open"></i> How to?
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function renderGuides() {
    const container = document.getElementById("guides-container");
    container.innerHTML = ""; // clear previous
    apps.forEach(app => {
      const guideData = guides[app.id];
      if (!guideData) return;
      const guideItem = document.createElement("div");
      guideItem.className = "guide-item";
      guideItem.id = `guide-${app.id}`;
      guideItem.innerHTML = `
        <h3>${guideData.title}</h3>
        ${guideData.content}
      `;
      container.appendChild(guideItem);
    });
  }
  
  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    renderApps();
    renderGuides();
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(a.getAttribute("href"))
                .scrollIntoView({ behavior: "smooth" });
      });
    });
  });
  