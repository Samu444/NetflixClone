# 🎬 Netflix Clone

A Netflix-inspired streaming platform built as part of a Work-Integrated Learning (WIL) placement at **Mint**, developed with the support of the Mint development team.

---

## 👥 Team Members

- Koketso Chabalala
- Hlengiwe Mazibuko
- Phumlile Mtshali
- Ntokozo Ndlovu

---

## 📌 About the Project

This project is a Netflix clone MVP (Minimum Viable Product) that replicates core Netflix functionality including user authentication, browsing popular and top-rated movies, and a responsive UI experience. Movie data is fetched in real-time from the TMDB (The Movie Database) API.

---

## ⚠️ Project Status

> 🚧 **This project is currently under active development and is not yet complete.**
>
> It represents the MVP (Minimum Viable Product) phase of the application. Additional features and improvements are planned and will be added as development continues during the WIL placement period.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Backend | C# ASP.NET Core Web API |
| Database | MongoDB |
| Authentication | JWT (JSON Web Tokens) + BCrypt |
| Movie Data | TMDB API |
| Version Control | Git + GitHub |

---

## ✨ Features

- 🔐 User login with JWT authentication
- 🎥 Browse Trending and Top Rated movies
- 🖼️ Movie posters and ratings from TMDB
- 🔒 Protected routes (only logged-in users can browse)
- 📱 Responsive Netflix-like UI
- 🚪 Sign out functionality
- 🗄️ MongoDB database with seeded users

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/)
- [MongoDB](https://www.mongodb.com/)
- A [TMDB API Key](https://www.themoviedb.org/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Samu444/NetflixClone.git
cd NetflixClone
```

### 2. Setup the Backend (C# API)

```bash
cd NetflixCloneApi
```

Update `appsettings.Development.json` with your values:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "netflixclone2"
  },
  "Tmdb": {
    "ApiKey": "YOUR_TMDB_API_KEY"
  },
  "JWT_SECRET": "your_secret_key_minimum_32_characters",
  "JWT_ISSUER": "NetflixCloneAPI",
  "JWT_AUDIENCE": "NetflixCloneClient"
}
```

Then run:

```bash
dotnet restore
dotnet run
```

API will run on `http://localhost:5145`

---

### 3. Setup the Frontend (React)

```bash
cd NetflixCloneFrontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔑 Default Login Credentials

| Name | Email | Password |
|---|---|---|
| John | john@gmail.com | john123 |
| Sarah | sarah@gmail.com | sarah123 |

> These users are automatically seeded into MongoDB when the API starts for the first time.

---

## 📁 Project Structure
NetflixClone/
├── NetflixCloneApi/          # C# ASP.NET Core Web API
│   ├── Controllers/          # Auth + Movies endpoints
│   ├── Models/               # MongoDB models
│   ├── Services/             # MongoDB + Token services
│   └── DTOs/                 # Data transfer objects
│
└── NetflixCloneFrontend/     # React + TypeScript frontend
└── src/
├── pages/            # GetStarted, Login, Home
├── components/       # MovieCard, MovieRow, StarRating
├── types/            # TypeScript interfaces
└── data/             # (legacy) local user data

---

## 🏢 Acknowledgements

This project was developed as part of a **Work-Integrated Learning (WIL)** program placement at **Mint**. Special thanks to the Mint development team for their guidance and mentorship throughout the project.

---

## 📄 License

This project is for educational purposes only and is not affiliated with Netflix.