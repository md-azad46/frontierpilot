## 🦞 What is FrontierPilot?

**FrontierPilot** is an AI-powered research assistant that helps you discover **research papers** from arXiv in seconds.

Instead of spending hours scrolling through arXiv, just type your research topic, and FrontierPilot fetches the latest **research papers** with summaries, authors, and publication dates. You can export results as JSON, CSV, TXT, or PDF.

---

## 💡 The Story Behind FrontierPilot

### The Problem

Imagine you're a student starting your thesis on "Large Language Models". You open arXiv, type your topic, and get 10,000 results. 

**Where do you start?** 
**Which research papers are important?** 
**Who are the top researchers?**

You spend 2 hours scrolling, opening tabs, reading abstracts. You save some links, lose others. Next week, you forget what you found.

### The Solution

**FrontierPilot** changes that completely.

---

## 🎯 A Day Using FrontierPilot

| Time | What You Do |
|------|-------------|
| **Morning (10 min)** | Type "large language model" → Select 20 papers → Get titles, summaries, authors, dates → Export as PDF |
| **Afternoon (15 min)** | Check "Top Researchers" → Visit "Communities" → Follow "Learning Path" |
| **Evening (5 min)** | Open saved favorites → Download CSV → Share PDF with supervisor |

---

## 📊 Before vs After

| Before FrontierPilot | After FrontierPilot |
|---------------------|---------------------|
| 😫 2 hours searching | 😊 10 minutes |
| 😵 50+ open tabs | 🧹 Clean interface |
| 🔄 Lost paper links | 💾 Exported files |
| ❓ Unknown authors | 👥 Top researcher list |
| 🧭 No direction | 🗺️ Learning path |

---

## 👥 Who is it for?

| User | How FrontierPilot Helps |
|------|------------------------|
| 🎓 **Students** | Find research papers for thesis & projects |
| 👨‍🔬 **Researchers** | Stay updated with latest papers |
| 👩‍🏫 **Professors** | Discover papers for courses |
| 📊 **Data Scientists** | Export JSON/CSV for trend analysis |
| 🤖 **Curious minds** | Learn about any research topic |

---

## 🗣️ What Users Say

> *"I found 10 relevant research papers for my thesis in under 5 minutes!"* — Masters Student

> *"The PDF export feature saved me hours of manual work."* — PhD Researcher

> *"Finally, a tool that shows me where to start reading research papers."* — Undergraduate

---

## 🚀 Why I built this?

As a researcher/student, I often struggled to find relevant **research papers** quickly. I wanted a tool that:

✅ Fetches research papers instantly by topic  
✅ Shows summaries without opening each link  
✅ Exports results for offline reading (JSON/CSV/TXT/PDF)  
✅ Suggests communities and learning paths  
✅ Tracks top researchers in any field  

---

## 🔥 Key Features at a Glance

| Feature | What It Does |
|---------|--------------|
| 🔍 **Instant Search** | Fetch 5-50 research papers by topic |
| 📄 **Smart Summaries** | Read abstracts without opening papers |
| 👥 **Top Researchers** | Find most active authors in your field |
| 🌐 **Communities** | Discover Reddit, Discord & conferences |
| 📚 **Learning Path** | Beginner → Intermediate → Advanced roadmap |
| 💾 **Multi-Export** | Download as JSON, CSV, TXT, or PDF |
| 🎨 **Dark/Light Mode** | Comfortable reading day or night |

---

## 🎯 Try It Yourself

Clone the repo, run `python backend.py`, and search your topic. **See the difference.**

> ⭐ Star this repo if you find it useful!

## 🏗️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom with Dark/Light mode)
- JavaScript (Vanilla)
- Chart.js (Analytics)
- Font Awesome Icons

### Backend
- Python 3.8+
- Flask (REST API)
- Flask-CORS
- arXiv API

### AI/Agent
- OpenClaw Agent Framework
- HTML2PDF.js (PDF generation)

---

## 📁 Project Structure

```
frontierpilot/
├── backend.py              # Flask API server
├── index.html              # Home page (paper search)
├── communities.html        # Communities page
├── learning.html           # Learning path page
├── researchers.html        # Top researchers page
├── docs.html               # Documentation page
├── styles.css              # Global styles
├── script.js               # Main JavaScript
├── dashboard.js            # Dashboard JavaScript
├── researchers.js          # Researchers page JS
└── README.md               # Documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.8+** - [Download](https://python.org)
- **Node.js** - [Download](https://nodejs.org) (for OpenClaw)
- **Git** - [Download](https://git-scm.com)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com)

### Step 1: Clone the Repository

```bash
git clone https://github.com/md-azad46/frontierpilot.git
cd frontierpilot
```

### Step 2: Install Python Dependencies

```bash
pip install flask flask-cors
```

### Step 3: OpenClaw Setup (Optional - for Agent features)

```bash
cd C:\Users\Hp\openclaw
npm install
npm run build
```

### Step 4: Run the Application

#### Terminal 1 - OpenClaw Gateway (Optional)

```bash
cd C:\Users\Hp\openclaw
node scripts/run-node.mjs --dev gateway
```

#### Terminal 2 - Flask Backend (Required)

```bash
cd E:\project
python backend.py
```

#### Terminal 3 - Open in Browser

Open `index.html` with VS Code Live Server or any HTTP server.

**Expected output:**
```
🦞 FrontierPilot Research Assistant
==================================================
API Running on: http://localhost:5000
Source: arXiv Only
==================================================
 * Running on http://127.0.0.1:5000
```

---

## 📖 How to Use

### 1. Search for Papers

1. Enter a research topic (e.g., "machine learning", "quantum computing")
2. Select number of papers (5-50 using slider)
3. Click **"Start Research"** button
4. View papers with titles, summaries, authors, and dates

### 2. Export Results

After search completes, use export buttons:
- **JSON** - Download as JSON file
- **CSV** - Download as CSV for Excel
- **TXT** - Download as text file
- **PDF** - Download as PDF report
- **Copy** - Copy all to clipboard

### 3. Explore Dashboard

Click on navigation links:
- **Communities** - Find Reddit, Discord, and conferences
- **Learning Path** - Structured learning roadmap
- **Researchers** - Top authors in your field
- **Documentation** - Detailed usage guide

### 4. Dark/Light Mode

Click the 🌙/☀️ button in navigation to toggle theme.

---

## 🌐 API Endpoints

### Search Papers

```http
POST /search
Content-Type: application/json

{
    "topic": "machine learning",
    "max_results": 10
}
```

### Response

```json
{
    "papers": [
        {
            "title": "Paper Title",
            "summary": "Abstract...",
            "authors": ["Author1", "Author2"],
            "url": "https://arxiv.org/abs/...",
            "pdf_url": "https://arxiv.org/pdf/...",
            "published": "2024-01-15",
            "id": "2401.xxxxx"
        }
    ],
    "count": 10,
    "topic": "machine learning",
    "search_time": "2024-01-15 10:30:00"
}
```

### Health Check

```http
GET /health
```

---

## 🎯 Use Cases

| User | How to Use |
|------|------------|
| **Students** | Find papers for thesis, assignments, projects |
| **Researchers** | Stay updated with latest research |
| **Professors** | Discover papers for courses |
| **Data Scientists** | Export JSON/CSV for analysis |
| **Anyone** | Learn about any research topic |

---

## 🐛 Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Make sure `python backend.py` is running on port 5000 |
| No papers found | Try a different topic or check internet connection |
| PDF not generating | Use browser print (Ctrl+P) as fallback |
| Agent not working | OpenClaw Gateway must be running separately |

---

## 🚀 Future Features

- [ ] Citation tracking
- [ ] Email alerts for new papers
- [ ] Paper recommendations based on history
- [ ] Collaborative research lists
- [ ] Integration with Zotero/Mendeley
- [ ] Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 🙏 Acknowledgments

- **arXiv.org** for free paper API access
- **OpenClaw Agent Framework** for AI capabilities
- **DEV Community** for the OpenClaw Challenge 2026
- **PKU-DAIR** for FrontierPilot inspiration

---

## 📞 Contact & Support

**Author:** Md Azad

- GitHub: [@md-azad46](https://github.com/md-azad46)
- Project Link: [https://github.com/md-azad46/frontierpilot](https://github.com/md-azad46/frontierpilot)
- Challenge Link: [OpenClaw Challenge 2026](https://dev.to/challenges/openclaw)

---
