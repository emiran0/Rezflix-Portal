// Google Sheet configuration
const SHEET_ID = '1TXv_JMYzAOlKJ7oDqZYFXW8V5CTBPL1yPrOBrCyOuvI';         // ← your sheet ID
const SHEET_GID = '0';                   // ← the GID of your sheet tab
const MAX_ITEMS = 20;
const OMDB_API_KEY = 'a200de6b';

// Fetch & parse Google Sheet (gviz JSONP)
async function fetchSheetData() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch sheet data');
    const text = await res.text();
    const jsonp = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1];
    const data = eval(`(${jsonp})`);
  
    return data.table.rows.map(r => {
      const imdb = r.c[0]?.v || '';
      const raw = r.c[1]?.v;
      let dateObj;
      if (raw instanceof Date) {
        dateObj = raw;
      } else if (typeof raw === 'string' && raw.startsWith('Date(')) {
        const m = raw.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
        dateObj = m ? new Date(+m[1], +m[2], +m[3]) : new Date(raw);
      } else {
        dateObj = new Date(raw);
      }
      const addedDate = (dateObj instanceof Date && !isNaN(dateObj))
        ? `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`
        : '';
      const qualityProfile = r.c[2]?.v || '';
      const type = (r.c[3]?.v || '').toLowerCase();
      return { imdb, addedDate, qualityProfile, type };
    });
  }
  
  // Fetch metadata from OMDb API
  async function fetchMetadata(imdbUrl) {
    const match = imdbUrl.match(/title\/(tt\d+)/);
    if (!match) return {};
    const id = match[1];
    const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    return {
      title:    data.Title    || 'Unknown',
      year:     data.Year     || 'N/A',
      duration: data.Runtime  || 'N/A',
      poster:   (data.Poster && data.Poster !== 'N/A') ? data.Poster : ''
    };
  }
  
  // Render items into a carousel
  async function renderCarousel(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (const item of list) {
      const meta = await fetchMetadata(item.imdb);
      // Calculate relative time
      const added = new Date(item.addedDate);
      const now = new Date();
      const diffMs = now - added;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      let relative;
      if (diffDays <= 0) {
        relative = 'Today';
      } else if (diffDays === 1) {
        relative = '1 day ago';
      } else {
        relative = `${diffDays} days ago`;
      }
  
      const el = document.createElement('div');
      el.className = 'carousel-item';
      el.innerHTML = `
        <a href="${item.imdb}" target="_blank">
          <img src="${meta.poster}" alt="${meta.title} poster">
        </a>
        <div class="item-title">${meta.title} (${meta.year})</div>
        <div class="item-info">Duration: ${meta.duration}</div>
        <div class="item-info">Added: ${item.addedDate}</div>
        <div class="item-info">Quality: ${item.qualityProfile}</div>
        <div class="item-info">${relative}</div>
      `;
      container.appendChild(el);
    }
  }
  
  // Setup nav arrows
  function setupCarouselNav() {
    document.querySelectorAll('.carousel-nav').forEach(btn => {
      btn.addEventListener('click', () => {
        const carousel = document.getElementById(btn.dataset.target);
        const dir = btn.classList.contains('next') ? 1 : -1;
        const scroll = carousel.clientWidth * 0.8;
        carousel.scrollBy({ left: dir * scroll, behavior: 'smooth' });
      });
    });
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const rows    = await fetchSheetData();
      const movies  = rows.filter(r => r.type === 'movie').slice(-MAX_ITEMS).reverse();
      const tvShows = rows.filter(r => r.type === 'tv').slice(-MAX_ITEMS).reverse();
  
      await renderCarousel(movies, 'movies-carousel');
      await renderCarousel(tvShows,   'tv-carousel');
      setupCarouselNav();
    } catch(err) {
      console.error(err);
    }
  });