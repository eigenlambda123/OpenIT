---

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/eigenlambda123/OpenIT">
    <img src="frontend/public/logo/LIGTAS.png" alt="Logo" width="80" height="auto">
  </a>

<h3 align="center">LIGTAS</h3>

  <p align="center">
    Welcome to LIGATS, your go-to platform for <b>real-time Earthquake monitoring alert system</b> and navigating users safety <b> by evacuation </b> tailored for the Filipino people. 
    <br />
    <a href="https://github.com/eigenlambda123/OpenIT"><strong>Explore the docs »</strong></a>
    <br />
</div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![project_license][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

# LIGTAS

LIGTAS is a web-based, mobile-first application for real-time earthquake monitoring and evacuation guidance tailored for the Philippines. It provides live earthquake alerts, nearby evacuation center information, and an interactive map.

## Features
- Real-time earthquake feed
- Map view with earthquake and evacuation center markers
- User location support and evacuation guidance
- Mobile-first responsive UI

## Built With
Frontend
- React
- Chakra UI
- Leaflet (react-leaflet)
- Vite

Backend
- Python
- FastAPI
- SQLModel / SQLite

## Prerequisites
- Node.js (16+ recommended) and npm
- Python 3.10+
- Git (optional)
- Windows PowerShell or Command Prompt

## Setup

Clone repository (if not already):
```bash
git clone https://github.com/eigenlambda123/OpenIT.git
cd OpenIT
```

### Backend
1. Open a terminal in `backend`:
```powershell
cd c:\Users\villa\OneDrive\Desktop\OpenIT\backend
```
2. Create and activate a Python virtual environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # PowerShell
# or
.\.venv\Scripts\activate.bat    # Command Prompt
```
3. Install dependencies:
```powershell
pip install -r requirements.txt
```
4. Run the backend (reload enabled for development):
```powershell
uvicorn app.main:app --reload
```
- Default backend address: http://127.0.0.1:8000
- If you change the backend host/port, set the frontend env variable below.

### Frontend
1. Open a terminal in `frontend`:
```powershell
cd c:\Users\villa\OneDrive\Desktop\OpenIT\frontend
```
2. Install dependencies:
```powershell
npm install
```
3. Configure API base (optional): create a `.env` or set environment variable
- Vite expects variables prefixed with `VITE_`. Example in PowerShell:
```powershell
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```
4. Start the frontend:
```powershell
npm run dev
```
- Frontend served by Vite (default http://localhost:5173). The app reads `import.meta.env.VITE_API_URL` for API calls.

## Backend API endpoints (examples)
- GET /data/earthquakes
- GET /data/evacuation
- GET /data/user_location/{user_id}
- POST /data/add/user_location

Adjust frontend calls if your backend uses different routes or authentication.

## Static assets (icons)
Put custom icons used by Leaflet in the frontend public folder so they are served at the root URL:
- Copy icon files to:
  - `frontend/public/earthquake.png`
  - `frontend/public/evacuation.png`
- Alternatively, place icons in `frontend/src/assets/` and import them in code.

Example PowerShell copy:
```powershell
Copy-Item "C:\path\to\earthquake.png" "c:\Users\villa\OneDrive\Desktop\OpenIT\frontend\public\earthquake.png"
Copy-Item "C:\path\to\evacuation.png" "c:\Users\villa\OneDrive\Desktop\OpenIT\frontend\public\evacuation.png"
```

## Local development notes
- The app saves a local user location in localStorage under the key `user_location`. You can persist the location to the backend using the settings form or modal flows provided.
- If you change filenames (for example `LocationModal.jsx` vs `locationModal.jsx`) keep import paths consistent with case sensitivity to avoid bundler issues.

## Troubleshooting
- If Vite or the backend shows a syntax or routing error after renaming files, stop the dev server and restart it.
- For CORS issues, enable CORS in FastAPI or configure the frontend to use the correct API URL.

## Screenshots
Screenshots are included in the repository under `frontend/public/logo/` and referenced in this README.

## License
Refer to the LICENSE file in the repository.

## Contact
For questions or issues, open an issue on the repository or contact the maintainer via the repository contact details.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/neophiles/KlimaTech.svg?style=for-the-badge
[contributors-url]: https://github.com/neophiles/KlimaTech/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/neophiles/KlimaTech.svg?style=for-the-badge
[forks-url]: https://github.com/neophiles/KlimaTech/network/members
[stars-shield]: https://img.shields.io/github/stars/neophiles/KlimaTech.svg?style=for-the-badge
[stars-url]: https://github.com/neophiles/KlimaTech/stargazers
[license-shield]: https://img.shields.io/github/license/neophiles/KlimaTech.svg?style=for-the-badge
[license-url]: https://github.com/neophiles/KlimaTech/blob/main/LICENSE
[Presko-screenshot]: frontend/public/logo/name_logo.png
<!-- Shields.io badges-->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Postgres]: https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org
[FastAPI]: https://img.shields.io/badge/FastAPI-009485.svg?logo=fastapi&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com
[Python]: https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff
[Python-url]: https://www.python.org