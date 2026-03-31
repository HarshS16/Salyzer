# ⚡ Salyzer Frontend

A premium Interface for the AI Sales Call Analyzer. Built with **React 19**, **Vite**, and **Tailwind CSS v4**.

---

## ✨ Features

- **Dashboard**: High-level overview of performance metrics.
- **AI Upload**: Advanced drag-and-drop audio file handler with progress tracking.
- **Deep Analysis**: Interactive charts for scoring and emotional tone timelines.
- **Sales Scripts**: Manage top-performing scripts for RAG benchmarks.
- **Team Management**: Exclusive view for managers to coach and monitor agents.
- **Dark Theme**: Premium obsidian-style UI with glassmorphism components.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- **API**: [Axios](https://axios-http.com/)

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
The application is pre-configured to proxy API requests to `http://localhost:3001` via `vite.config.js`.

### 3. Run Development Server
```bash
npm run dev
```

---

## ⚙️ Project Structure

```text
src/
├── components/     # UI components (Sidebar, Layout)
├── context/        # Auth Context & Global State
├── pages/          # Full page view components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Upload.jsx
│   ├── Analysis.jsx
│   ├── CallHistory.jsx
│   ├── Scripts.jsx
│   └── Team.jsx
├── App.jsx         # Routes & Protection
├── main.jsx        # Entry & Providers
└── index.css       # Tailwind v4 setup
```

---

*Part of the Salyzer AI Sales Suite.*
