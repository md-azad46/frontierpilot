let currentPapers = [];
let currentSort = 'date';
let startTime = 0;

// DOM Elements
const topicInput = document.getElementById('topicInput');
const maxResults = document.getElementById('maxResults');
const resultsCount = document.getElementById('resultsCount');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const error = document.getElementById('error');
const statsDashboard = document.getElementById('statsDashboard');

// Theme Toggle
let isDarkMode = true;
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// Trending Topics
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        topicInput.value = chip.dataset.topic;
        searchBtn.click();
    });
});

// Range Slider
if (maxResults) {
    maxResults.addEventListener('input', (e) => {
        resultsCount.textContent = e.target.value;
    });
}

// Search Function
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        const numPapers = parseInt(maxResults.value);
        
        if (!topic) {
            alert('Please enter a research topic');
            return;
        }
        
        startTime = Date.now();
        loading.classList.remove('hidden');
        results.classList.add('hidden');
        error.classList.add('hidden');
        if (statsDashboard) statsDashboard.classList.add('hidden');
        document.getElementById('researchersSection')?.classList.add('hidden');
        document.getElementById('communitiesSection')?.classList.add('hidden');
        document.getElementById('learningSection')?.classList.add('hidden');
        searchBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic, max_results: numPapers })
            });
            
            const data = await response.json();
            
            if (data.error) {
                showError(data.error);
            } else {
                currentPapers = data.papers;
                displayResults(data);
                updateStats(data);
                displayResearchers(data.top_researchers);
                displayCommunities(data.communities);
                displayLearningPath(data.learning_path);
            }
        } catch (err) {
            console.error(err);
            showError('Cannot connect to backend. Make sure "python backend.py" is running on port 5000');
        } finally {
            loading.classList.add('hidden');
            searchBtn.disabled = false;
        }
    });
}

function displayResults(data) {
    const searchTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    const resultCountEl = document.getElementById('resultCount');
    if (resultCountEl) {
        resultCountEl.innerHTML = `
            <i class="fas fa-file-alt"></i> Found ${data.count} papers for "${data.topic}"
            <small><i class="fas fa-clock"></i> ${searchTime}s</small>
        `;
    }
    
    renderPapers(currentPapers);
    results.classList.remove('hidden');
    if (statsDashboard) statsDashboard.classList.remove('hidden');
    const searchTimeEl = document.getElementById('searchTime');
    if (searchTimeEl) searchTimeEl.textContent = `${searchTime}s`;
}

function renderPapers(papers) {
    const papersList = document.getElementById('papersList');
    if (!papersList) return;
    papersList.innerHTML = '';
    
    let sorted = [...papers];
    if (currentSort === 'date') {
        sorted.sort((a, b) => new Date(b.published) - new Date(a.published));
    } else if (currentSort === 'title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    sorted.forEach((paper, index) => {
        const card = document.createElement('div');
        card.className = 'paper-card';
        card.innerHTML = `
            <div class="paper-header">
                <a href="${paper.url || '#'}" class="paper-title" target="_blank">
                    ${index + 1}. ${escapeHtml(paper.title)}
                </a>
                <button class="favorite-btn" data-id="${paper.id || index}">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            <div class="paper-meta">
                <span><i class="fas fa-user"></i> ${paper.authors?.slice(0,3).join(', ') || 'Unknown'}</span>
                <span><i class="fas fa-calendar"></i> ${paper.published || 'Unknown'}</span>
                <span><i class="fas fa-id-card"></i> ${paper.id || 'N/A'}</span>
            </div>
            <div class="paper-summary">${escapeHtml(paper.summary || 'No summary available')}</div>
            <div class="paper-links">
                <a href="${paper.url || '#'}" class="paper-link" target="_blank"><i class="fas fa-book"></i> Abstract</a>
                <a href="${paper.pdf_url || '#'}" class="paper-link" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>
            </div>
        `;
        papersList.appendChild(card);
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.className = 'fas fa-bookmark';
            } else {
                icon.className = 'far fa-bookmark';
            }
        });
    });
}

function updateStats(data) {
    const papers = data.papers;
    document.getElementById('totalPapers').textContent = papers.length;
    
    const allAuthors = papers.flatMap(p => p.authors || []);
    const uniqueAuthors = [...new Set(allAuthors)];
    document.getElementById('totalAuthors').textContent = uniqueAuthors.length;
    
    const authorCount = {};
    allAuthors.forEach(a => { authorCount[a] = (authorCount[a] || 0) + 1; });
    const topAuthor = Object.entries(authorCount).sort((a,b) => b[1] - a[1])[0];
    document.getElementById('topAuthor').textContent = topAuthor ? topAuthor[0].split(' ')[0] : '-';
}

function displayResearchers(researchers) {
    const section = document.getElementById('researchersSection');
    const container = document.getElementById('researchersList');
    if (!section || !container) return;
    
    if (researchers && researchers.length > 0) {
        container.innerHTML = researchers.slice(0,6).map(r => `
            <div class="researcher-card">
                <span class="researcher-name">${escapeHtml(r.name)}</span>
                <span class="researcher-count">${r.paper_count} papers</span>
            </div>
        `).join('');
        section.classList.remove('hidden');
    }
}

function displayCommunities(communities) {
    const section = document.getElementById('communitiesSection');
    const container = document.getElementById('communitiesList');
    if (!section || !container) return;
    
    if (communities) {
        let html = '';
        
        if (communities.reddit && communities.reddit.length > 0) {
            html += `<h4 style="margin-top:0;"><i class="fab fa-reddit"></i> Reddit</h4><div class="communities-grid">`;
            html += communities.reddit.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta">${c.members} members</div>
                    <a href="${c.url}" class="community-link" target="_blank">Join →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        if (communities.discord && communities.discord.length > 0) {
            html += `<h4 style="margin-top:1rem;"><i class="fab fa-discord"></i> Discord</h4><div class="communities-grid">`;
            html += communities.discord.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta">${c.members} members</div>
                    <a href="${c.url}" class="community-link" target="_blank">Join →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        if (communities.conferences && communities.conferences.length > 0) {
            html += `<h4 style="margin-top:1rem;"><i class="fas fa-calendar-alt"></i> Conferences</h4><div class="communities-grid">`;
            html += communities.conferences.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta">${c.date}</div>
                    <a href="${c.url}" class="community-link" target="_blank">Learn More →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        container.innerHTML = html;
        section.classList.remove('hidden');
    }
}

function displayLearningPath(learningPath) {
    const section = document.getElementById('learningSection');
    const container = document.getElementById('learningList');
    if (!section || !container) return;
    
    if (learningPath) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const levelNames = {'beginner': '🌱 Beginner', 'intermediate': '📈 Intermediate', 'advanced': '🚀 Advanced'};
        const levelIcons = {'beginner': 'seedling', 'intermediate': 'chart-line', 'advanced': 'rocket'};
        
        let html = '';
        levels.forEach(level => {
            if (learningPath[level] && learningPath[level].length > 0) {
                html += `
                    <div class="learning-level">
                        <div class="level-title"><i class="fas fa-${levelIcons[level]}"></i> ${levelNames[level]}</div>
                        <div class="level-items">
                            ${learningPath[level].map(item => `
                                <div class="level-item">
                                    <i class="fas fa-${item.type === 'course' ? 'video' : item.type === 'reading' ? 'book' : item.type === 'tutorial' ? 'chalkboard-teacher' : item.type === 'workshop' ? 'users' : item.type === 'project' ? 'code' : 'flask'}"></i>
                                    <span>${escapeHtml(item.name)}</span>
                                    ${item.duration ? `<small>(${item.duration})</small>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        container.innerHTML = html;
        section.classList.remove('hidden');
    }
}

// Sort functions
document.getElementById('sortDateBtn')?.addEventListener('click', () => {
    currentSort = 'date';
    renderPapers(currentPapers);
});
document.getElementById('sortTitleBtn')?.addEventListener('click', () => {
    currentSort = 'title';
    renderPapers(currentPapers);
});

// ============================================
// EXPORT FUNCTIONS (JSON, CSV, TXT, PDF, COPY)
// ============================================

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// JSON Export
document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
    if (!currentPapers || currentPapers.length === 0) {
        alert('No papers to export. Please search first.');
        return;
    }
    const dataStr = JSON.stringify(currentPapers, null, 2);
    downloadFile(dataStr, `papers_${Date.now()}.json`, 'application/json');
    alert('✅ JSON exported successfully!');
});

// CSV Export
document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    if (!currentPapers || currentPapers.length === 0) {
        alert('No papers to export. Please search first.');
        return;
    }
    let csv = 'Title,Authors,Published,URL,Summary\n';
    currentPapers.forEach(p => {
        csv += `"${p.title?.replace(/"/g, '""') || ''}","${p.authors?.join('; ') || ''}","${p.published || ''}","${p.url || ''}","${p.summary?.replace(/"/g, '""') || ''}"\n`;
    });
    downloadFile(csv, `papers_${Date.now()}.csv`, 'text/csv');
    alert('✅ CSV exported successfully!');
});

// TXT Export
document.getElementById('exportTxtBtn')?.addEventListener('click', () => {
    if (!currentPapers || currentPapers.length === 0) {
        alert('No papers to export. Please search first.');
        return;
    }
    let txt = '';
    currentPapers.forEach((p, i) => {
        txt += `${i+1}. ${p.title}\n`;
        txt += `Authors: ${p.authors?.join(', ') || 'N/A'}\n`;
        txt += `Published: ${p.published || 'N/A'}\n`;
        txt += `Summary: ${p.summary || 'N/A'}\n`;
        txt += `URL: ${p.url}\n\n`;
    });
    downloadFile(txt, `papers_${Date.now()}.txt`, 'text/plain');
    alert('✅ TXT exported successfully!');
});

// ============================================
// PDF EXPORT - REAL PDF THAT OPENS AND READABLE
// ============================================
document.getElementById('exportPdfBtn')?.addEventListener('click', async () => {
    if (!currentPapers || currentPapers.length === 0) {
        alert('No papers to export. Please search first.');
        return;
    }
    
    const btn = document.getElementById('exportPdfBtn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    btn.disabled = true;
    
    try {
        // Dynamically load html2pdf if not available
        if (typeof html2pdf === 'undefined') {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
            // Wait a bit for library to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Create a clean container for PDF content
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.backgroundColor = 'white';
        container.style.color = '#333';
        
        // Add content
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2f81f7; margin-bottom: 10px;">🦞 FrontierPilot - Research Papers</h1>
                <p style="color: #666;">Generated on: ${new Date().toLocaleString()}</p>
                <p style="color: #666;">Total Papers: ${currentPapers.length}</p>
                <hr style="border: 1px solid #2f81f7;">
            </div>
            ${currentPapers.map((paper, i) => `
                <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; page-break-inside: avoid;">
                    <h3 style="color: #2f81f7; margin-bottom: 10px;">${i+1}. ${escapeHtml(paper.title)}</h3>
                    <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                        <strong>Authors:</strong> ${paper.authors?.join(', ') || 'Unknown'}<br>
                        <strong>Published:</strong> ${paper.published || 'Unknown'}<br>
                        <strong>ID:</strong> ${paper.id || 'N/A'}
                    </div>
                    <div style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                        ${escapeHtml(paper.summary || 'No summary available')}
                    </div>
                    <div>
                        <a href="${paper.url}" style="color: #2f81f7;">Read full paper →</a>
                    </div>
                </div>
            `).join('')}
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
                <p>Generated by FrontierPilot - AI Research Assistant</p>
                <p>Powered by arXiv API</p>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // PDF options
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `frontierpilot_papers_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate and download PDF
        await html2pdf().set(opt).from(container).save();
        
        // Clean up
        document.body.removeChild(container);
        
        alert('✅ PDF downloaded successfully! Check your downloads folder.');
    } catch (error) {
        console.error('PDF error:', error);
        alert('❌ PDF generation failed. You can use browser print (Ctrl+P) and select "Save as PDF" as a fallback.');
    } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
});

// Copy to Clipboard
document.getElementById('copyBtn')?.addEventListener('click', async () => {
    if (!currentPapers || currentPapers.length === 0) {
        alert('No papers to copy. Please search first.');
        return;
    }
    let text = '';
    currentPapers.forEach((p, i) => {
        text += `${i+1}. ${p.title}\n${p.summary}\n${p.url}\n\n`;
    });
    try {
        await navigator.clipboard.writeText(text);
        alert('✅ Copied to clipboard!');
    } catch (err) {
        alert('❌ Failed to copy');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i><h3>Error</h3><p>${message}</p>`;
        errorDiv.classList.remove('hidden');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enter key support
topicInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchBtn) searchBtn.click();
});

// Navigation handlers
document.getElementById('homeLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('aboutLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔍 FrontierPilot\n\nAI-powered research assistant with:\n• OpenClaw Agent\n• Community Discovery\n• Learning Path\n• Multi-format Export (JSON/CSV/TXT/PDF)\n\nBuilt for OpenClaw Challenge 2026');
});

document.getElementById('docsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('📚 Documentation\n\n1. Enter research topic\n2. Select number of papers (5-50)\n3. Click Search\n4. View papers, researchers, communities\n5. Export results (JSON/CSV/TXT/PDF)\n\nBackend: python backend.py');
});

console.log("🚀 FrontierPilot Full Version Loaded with PDF Export");