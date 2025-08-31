# 📖 Insightlify

**Insightlify** is a text extraction and analysis tool that allows users to upload PDFs or Images and get meaningful insights.
The system extracts text using **OCR (Tesseract)** and **PyMuPDF**, analyzes it with Gemini, and returns structured insights — making document analysis smarter and faster.

---

## ✨ Features

* 📂 **Multi-format Support** – Upload PDFs and Images.
* 🔍 **OCR Support** – Extracts text from images using **Tesseract OCR**.
* 📑 **PDF Parsing** – Extracts text from PDFs using **PyMuPDF**.
* 🤖 **AI-Powered Analysis** – Uses **Google Gemini API** for summarization, insights, and keyword extraction.
* ⚡ **FastAPI Backend** – REST APIs to handle file upload and text analysis.
* 🎨 **React Frontend** – Simple UI to upload and analyze documents.
* 🐳 **Dockerized Deployment** – Render-ready with Tesseract preinstalled.

---

## ⚙️ Installation (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MrApoorv/insightlify.git
cd insightlify
```

---

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

🔑 Create a `.env` file in `backend/` with:

```ini
GEMINI_API_KEY=your_google_gemini_api_key
PORT=8000
ENV=DEV
```

Run backend:

```bash
uvicorn main:app --reload --port 8000
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
```

🔑 Create a `.env` file in `frontend/` with:

```ini
REACT_APP_ENV=DEV
REACT_APP_DEVELOPMENT_URL=http://localhost:8000
REACT_APP_PRODUCTION_URL=yourdomain
```

Run frontend:

```bash
npm start
```
---

### 📊 Analysis Output

When you upload a file (PDF, Image, or TXT) and click **Analyze**, the app extracts the text and provides the following insights:

* **Sentiment** → Overall tone (Positive / Negative / Neutral)
* **Emotions** → List of detected emotions
* **Topics** → Key themes discussed in the text
* **Engagement Score** → 1–10 rating of how engaging the content is
* **Suggestions** → 3 short improvements to boost engagement
* **Audience** → Best-fit target audience for the content
* **Hashtags** → Suggested hashtags for social sharing
* **Rewrites** → Same content rewritten in:

  * *Friendly* (casual, Instagram-style)
  * *Professional* (formal, LinkedIn-style)
  * *Concise* (short, Twitter/X-style)

---

## 🗂️ Project Structure

Based on your attached structure image:

```
project-root/
│── backend/
│   ├── main.py                 # FastAPI entrypoint
│   ├── api/                    # API routers
│   │   └── analyzer.py
│   ├── services/               # Business logic
│   │   └── analyzer_service.py
│   ├── utils/                  # File helpers (OCR, PDF parsing)
│   │   └── file_utils.py
│   ├── models/                 # AI model integrations
│   │   └── model_utils.py
│   ├── requirements.txt
│   └── Dockerfile
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Analyzer.jsx    # Upload & analyze component
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🛠️ Challenges Faced

* ⚡ **Tesseract Installation** –
  While Tesseract OCR works fine locally, deploying on **Render** required custom Docker setup since `pytesseract` only provides Python bindings and does not install the binary itself.
  Solution: A **Dockerfile** was created to install `tesseract-ocr` in the container alongside Python dependencies.

* 🌐 **CORS Issues** –
  Ensuring frontend (React) could communicate with backend (FastAPI) required setting correct CORS policies and environment-based URLs.

* 🔑 **Environment Management** –
  Needed separate `.env` handling for **development** and **production** both in backend and frontend.

---

## 🚀 Deployment

* Backend runs on **Render** using Docker (with Tesseract preinstalled).
* Frontend can be hosted on **Netlify/Vercel** and configured to call the Render backend.

---

👉 With this setup, just **upload a PDF or Image → extract → analyze → get insights instantly**.

---