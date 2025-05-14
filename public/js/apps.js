// Define your apps here; add new objects to this array later
const apps = [
  {
    id: "plex",
    name: "Plex",
    logo: "assets/logos/plex.png",
    link: "https://rezflix.local:32400",
    description: "Your personal media server.",
  },
  {
    id: "request",
    name: "Rezflix Request",
    logo: "assets/logos/request.png",
    link: "https://rezflix.local/request",
    description:
      "Log in with your Plex account and create requests for movies/TV shows.",
  },
  // …add more apps here
];

// Guide content keyed by app.id; each has multiple sub-sections
const guides = {
  plex: {
    title: "How to use Plex?",
    sections: [
      {
        title: "Logging In",
        content: `<ol>
          <li>Go to <a href="https://rezflix.local:32400/web" target="_blank">Plex Web App</a>.</li>
          <li>Click “Sign In” and use your Plex credentials.</li>
          <li>If you're new, select “Sign Up” to create a free account.</li>
          </ol>
          <p><strong>Note:</strong> You must be signed in to access the shared Rezflix library.</p>`,
      },
      {
        title: "Library Usage",
        content: `<ol>
        <li>Once logged in, you'll see categories like Movies, TV Shows, and Recently Added.</li>
        <li>Click any category to browse the full library.</li>
        <li>You can also use the search bar (top right) to find titles quickly.</li>
        </ol>
        <p><strong>Tip:</strong> Use the filters in the sidebar to narrow by genre, resolution (4K, HDR), or watched status.</p>`,
      },
      {
        title: "Player Settings",
        content: `<ol>
        <li>If you're using a desktop, laptop, or smart TV (not mobile/tablet), make sure playback quality is set to <strong>Original</strong>.</li>
        <li>For high bitrate or HDR content (typically above 35 Mbps), go to <strong>Settings > Playback</strong> and <strong>disable “Bitrate Limiting”</strong>. This ensures the content plays at full quality.</li>
        <li>If your device supports HDR, DTS, Dolby Atmos, or similar high-end audio/video features, go to <strong>Settings > Player</strong> and enable <strong>“Force Direct Play”</strong>.</li>
        </ol>
        <p><strong>Why it matters:</strong> Direct Play delivers the content without transcoding. This ensures maximum quality and helps reduce CPU strain on the Plex server.</p>`,
      },
      {
        title: "Loading Issues",
        content: `<ol>
        <li>Check if the video is set to “Original” quality — reduce to 720p or 1080p if it stutters.</li>
        <li>Ensure your device is on the same local network (LAN) as the Rezflix server.</li>
        <li>If using Wi-Fi, switch to Ethernet or get closer to the router for better stability.</li>     
        </ol>
        <p><strong>Note:</strong> If the video is transcoding (not direct play), buffering is more likely. Try a supported format like MP4 + AAC audio.</p>`,
      },
      {
        title: "Subtitles",
        content: `<ol>
        <li>During playback, open the subtitle menu by clicking the speech bubble icon 💬.</li>
        <li><strong>Always prefer SRT subtitles</strong>. Do not use VOBSUB, PGS, or ASS formats — these typically force transcoding and break Direct Play.</li>
        <li>SDH subtitles are fine if they are in <strong>SRT format</strong>.</li>
        <li>If no SRT subtitle is available or if the current one has sync issues, click <strong>“Search”</strong> at the bottom of the subtitle list.</li>
        <li>Select your preferred language and review the search results. Choose a version that best matches your media format (e.g., REMUX, WEB-DL, etc.).</li>
        <li><strong>Tip:</strong> Pick the subtitle with the <strong>highest download count</strong> for better accuracy and quality.</li>
        </ol>
        <p><strong>Note:</strong> Proper subtitle selection improves the viewing experience and reduces playback interruptions caused by forced transcoding.</p>`,
      },
    ],
  },
  request: {
    title: "How to use Rezflix Request?",
    sections: [
      {
        title: "Authentication",
        content: `<p>Log in with your Plex credentials when prompted.</p>`,
      },
      {
        title: "Create Request",
        content: `<ol>
  <li>Navigate to the <strong>Discover</strong> or <strong>Search</strong> page inside Rezflix Requests.</li>
  <li>Find the movie or TV show you’d like to request.</li>
  <li>You’ll see two buttons: <strong>“Request”</strong> and <strong>“4K Request”</strong>.</li>
  <li><strong>By default, please use the “Request” (1080p) button.</strong> Most titles are more widely available and downloaded faster in this format.</li>
  <li>Only select <strong>“4K Request”</strong> if you're sure the movie/show exists in high-quality 4K with features like <strong>REMUX, HDR, Dolby Vision, or Atmos audio</strong>.</li>
  <li>Once requested, you can view the status of your request in the <strong>Request Status</strong> section.</li>
</ol>
<p><strong>Note:</strong> Excessive 4K requests can cause longer download delays and may not be fulfilled if the content isn't easily available in that format. Choose wisely!</p>`,
      },
      {
        title: "Request Status",
        content: `<p>Check 'My Requests' to see approval and download progress.</p>`,
      },
    ],
  },
};

function renderApps() {
  const container = document.getElementById("apps-container");
  container.innerHTML = "";
  apps.forEach((app) => {
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
  container.innerHTML = "";

  apps.forEach((app) => {
    const guideData = guides[app.id];
    if (!guideData) return;

    // Outer guide block
    const guideBlock = document.createElement("div");
    guideBlock.className = "guide-block";
    guideBlock.innerHTML = `
      <button class="guide-toggle">${guideData.title} <i class="fa-solid fa-chevron-down"></i></button>
      <div class="guide-sections"></div>
    `;

    const sectionsContainer = guideBlock.querySelector(".guide-sections");
    sectionsContainer.style.display = "none";

    // Inner collapsibles
    guideData.sections.forEach((sec) => {
      const subItem = document.createElement("div");
      subItem.className = "guide-item";
      subItem.innerHTML = `
        <button class="guide-subtoggle">${sec.title} <i class="fa-solid fa-chevron-down"></i></button>
        <div class="guide-subcontent">${sec.content}</div>
      `;
      const subContent = subItem.querySelector(".guide-subcontent");
      subContent.style.display = "none";
      const subToggle = subItem.querySelector(".guide-subtoggle");
      const subIcon = subToggle.querySelector("i");
      subToggle.addEventListener("click", () => {
        const hidden = subContent.style.display === "none";
        subContent.style.display = hidden ? "block" : "none";
        subIcon.classList.toggle("fa-chevron-down", !hidden);
        subIcon.classList.toggle("fa-chevron-up", hidden);
      });
      sectionsContainer.appendChild(subItem);
    });

    // Outer toggle logic
    const outerToggle = guideBlock.querySelector(".guide-toggle");
    const outerIcon = outerToggle.querySelector("i");
    outerToggle.addEventListener("click", () => {
      const hidden = sectionsContainer.style.display === "none";
      sectionsContainer.style.display = hidden ? "block" : "none";
      outerIcon.classList.toggle("fa-chevron-down", !hidden);
      outerIcon.classList.toggle("fa-chevron-up", hidden);
    });

    container.appendChild(guideBlock);
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderApps();
  renderGuides();
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelector(a.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});
