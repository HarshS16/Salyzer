# ⚡ Salyzer Backend — AI Processing Engine

The AI Sales Call Analyzer API engine. Handles audio transcription, GPT-4o analysis, agent scoring, and team-wide data management.

---

## 🏗️ Tech Stack

- **Server**: [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Database**: [sql.js](https://sql.js.org/) (Pure JS SQLite for portability)
- **AI Models**: 
  - [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) (Transcription)
  - [GPT-4o-mini](https://platform.openai.com/docs/models/gpt-4o) (Analysis & Scoring)
- **Authentication**: [JWT](https://jwt.io/) (Stateless sessions)
- **Security**: [Bcryptjs](https://www.npmjs.com/package/bcryptjs) (Salted hashing)
- **FileUpload**: [Multer](https://www.npmjs.com/package/multer) (Audio stream handling)

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure `.env`
Ensure you have an `.env` file in this directory:
```env
OPENAI_API_KEY=your_key_here
JWT_SECRET=your_jwt_secret
PORT=3001
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🛠️ Implementation Details

### Database Architecture
- **In-Memory + Disk Syncing**: Uses `sql.js` for zero-dependency, pure JS SQLite execution that auto-syncs with the filesystem (`salyzer.db`).
- **Relational Integrity**: Tracks Users → Calls → Analyses with cascading deletes for data security.

### AI Processing Pipeline
- **Transcription Service**: Securely streams audio to Whisper AI and retrieves detailed text transcripts.
- **Analysis Service**: Uses a sophisticated system prompt to return structured JSON analysis covering 15+ performance metrics.
- **Demo Mode**: Gracefully identifies missing API keys and provides a high-fidelity sample analysis for evaluation.

---

## 📂 Project Structure

```text
├── middleware/     # JWT Auth protection
├── routes/         # Modular endpoint handlers
│   ├── auth.js
│   ├── calls.js
│   ├── scripts.js
│   └── team.js
├── services/       # Core business logic
│   └── ai.js       # OpenAI & Demo analysis
├── uploads/        # Temporary audio buffer
├── db.js           # Database & Helper functions
└── index.js        # Main entry point
```

---

*Part of the Salyzer AI Sales Suite.*
