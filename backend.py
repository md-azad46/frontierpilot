from flask import Flask, request, jsonify
from flask_cors import CORS
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
from collections import Counter

app = Flask(__name__)
CORS(app)

def fetch_papers(topic, max_results=10):
    """Fetch papers from arXiv API"""
    encoded_topic = urllib.parse.quote(topic)
    url = f"http://export.arxiv.org/api/query?search_query=all:{encoded_topic}&start=0&max_results={max_results}"
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (FrontierPilot/1.0)"})
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read().decode()
    except Exception as e:
        return {"error": str(e)}
    
    root = ET.fromstring(data)
    papers = []
    all_authors = []
    
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text.strip()
        summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.strip()
        
        if len(summary) > 350:
            summary = summary[:350] + "..."
        
        paper_id = entry.find("{http://www.w3.org/2005/Atom}id").text.split("/")[-1]
        
        authors = []
        for author in entry.findall("{http://www.w3.org/2005/Atom}author"):
            name = author.find("{http://www.w3.org/2005/Atom}name").text
            if name:
                authors.append(name)
                all_authors.append(name)
        
        published_elem = entry.find("{http://www.w3.org/2005/Atom}published")
        published = published_elem.text[:10] if published_elem is not None else "Unknown"
        
        papers.append({
            "title": title,
            "summary": summary,
            "url": f"https://arxiv.org/abs/{paper_id}",
            "pdf_url": f"https://arxiv.org/pdf/{paper_id}.pdf",
            "id": paper_id,
            "authors": authors[:3] if authors else ["Unknown"],
            "published": published,
            "source": "arXiv"
        })
    
    # Top Researchers
    author_counts = Counter(all_authors)
    top_researchers = [
        {"name": name, "paper_count": count}
        for name, count in author_counts.most_common(10)
    ]
    
    # Communities
    communities = {
        "reddit": [
            {"name": "r/MachineLearning", "url": "https://reddit.com/r/MachineLearning", "members": "2.5M"},
            {"name": "r/LanguageTechnology", "url": "https://reddit.com/r/LanguageTechnology", "members": "500K"},
            {"name": "r/learnmachinelearning", "url": "https://reddit.com/r/learnmachinelearning", "members": "1.2M"}
        ],
        "discord": [
            {"name": "Paper Reading Group", "url": "https://discord.gg/paperreading", "members": "50K"},
            {"name": "AI Research Lab", "url": "https://discord.gg/airesearch", "members": "80K"},
            {"name": "OpenClaw Community", "url": "https://discord.gg/openclaw", "members": "25K"}
        ],
        "conferences": [
            {"name": "NeurIPS", "url": "https://neurips.cc", "date": "December 2026"},
            {"name": "ICML", "url": "https://icml.cc", "date": "July 2026"},
            {"name": "ACL", "url": "https://aclweb.org", "date": "August 2026"},
            {"name": "CVPR", "url": "https://cvpr.thecvf.com", "date": "June 2026"}
        ]
    }
    
    # Learning Path
    learning_path = {
        "beginner": [
            {"name": "Introduction to topic", "type": "course", "duration": "4 weeks"},
            {"name": "Foundational Papers", "type": "reading"},
            {"name": "Basic Tutorials", "type": "tutorial", "duration": "10 hours"}
        ],
        "intermediate": [
            {"name": "Advanced Concepts", "type": "course", "duration": "6 weeks"},
            {"name": "State of the Art Papers", "type": "reading"},
            {"name": "Research Methods", "type": "workshop", "duration": "2 days"}
        ],
        "advanced": [
            {"name": "Latest Research", "type": "reading"},
            {"name": "Paper Implementation", "type": "project", "duration": "8 weeks"},
            {"name": "Write Your Own Paper", "type": "research", "duration": "12 weeks"}
        ]
    }
    
    return {
        "papers": papers,
        "top_researchers": top_researchers,
        "communities": communities,
        "learning_path": learning_path,
        "topic": topic
    }

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400
            
        topic = data.get('topic', '')
        max_results = data.get('max_results', 10)
        
        if not topic:
            return jsonify({"error": "Topic is required"}), 400
        
        if max_results < 1 or max_results > 50:
            max_results = 10
        
        result = fetch_papers(topic, max_results)
        
        if "error" in result:
            return jsonify(result), 500
        
        return jsonify({
            "papers": result["papers"],
            "count": len(result["papers"]),
            "topic": topic,
            "source": "arXiv",
            "top_researchers": result["top_researchers"],
            "communities": result["communities"],
            "learning_path": result["learning_path"],
            "search_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online", 
        "message": "FrontierPilot API with Community, Researchers & Learning Path",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🦞 FrontierPilot Research Assistant (Full Version)")
    print("="*50)
    print("Features:")
    print("  ✅ arXiv Papers")
    print("  ✅ Top Researchers")
    print("  ✅ Communities")
    print("  ✅ Learning Path")
    print("="*50)
    print("API Running on: http://localhost:5000")
    print("="*50)
    app.run(debug=True, port=5000, host='0.0.0.0')