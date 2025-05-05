# Rezflix Portal

A simple, dark-mode, static website for managing and redirecting users to Rezflix applications and displaying latest releases pulled from a Google Sheet and OMDb API.

## Features

- **Dark-mode** responsive layout  
- **Applications** grid (Plex, Rezflix Request, etc.) with Open & How-to buttons  
- **Integrated Guides** section for app usage  
- **Latest Releases** carousels (Movies & TV Shows)  
  - Data powered by a public Google Sheet (no code changes needed to add items)  
  - Metadata (title, year, duration, poster) fetched automatically via OMDb API  
  - Relative dates (“Today”, “X days ago”)  
  - Carousel navigation with arrow controls  

## Repo Structure

```plaintext
rezflix-portal/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── apps.js
│   └── releases.js
└── assets/
    └── logos/           # app logos: plex.png, request.png, etc.
