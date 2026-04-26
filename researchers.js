// Researchers Page JavaScript

const researcherTopic = document.getElementById('researcherTopic');
const researcherMaxResults = document.getElementById('researcherMaxResults');
const researcherResultsCount = document.getElementById('researcherResultsCount');
const searchResearchersBtn = document.getElementById('searchResearchersBtn');
const researcherLoading = document.getElementById('researcherLoading');
const researcherError = document.getElementById('researcherError');

// Range slider
if (researcherMaxResults) {
    researcherMaxResults.addEventListener('input', (e) => {
        researcherResultsCount.textContent = e.target.value;
    });
}

// Search function
if (searchResearchersBtn) {
    searchResearchersBtn.addEventListener('click', async () => {
        const topic = researcherTopic.value.trim();
        const numPapers = parseInt(researcherMaxResults.value);
        
        if (!topic) {
            alert('Please enter a research topic');
            return;
        }
        
        researcherLoading.classList.remove('hidden');
        researcherError.classList.add('hidden');
        document.getElementById('researchersResults')?.classList.add('hidden');
        document.getElementById('researcherStats')?.classList.add('hidden');
        searchResearchersBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic, max_results: numPapers })
            });
            
            const data = await response.json();
            
            if (data.error) {
                showResearcherError(data.error);
            } else {
                displayResearchers(data.top_researchers);
                displayResearcherStats(data);
            }
        } catch (err) {
            showResearcherError('Cannot connect to backend. Make sure "python backend.py" is running on port 5000');
        } finally {
            researcherLoading.classList.add('hidden');
            searchResearchersBtn.disabled = false;
        }
    });
}

function displayResearchers(researchers) {
    const section = document.getElementById('researchersResults');
    const container = document.getElementById('researchersList');
    
    if (!section || !container) return;
    
    if (researchers && researchers.length > 0) {
        container.innerHTML = researchers.map((r, index) => `
            <div class="researcher-card-large">
                <div class="researcher-rank">#${index + 1}</div>
                <div class="researcher-info">
                    <div class="researcher-full-name">${escapeHtml(r.name)}</div>
                    <div class="researcher-details">
                        <span class="researcher-paper-count"><i class="fas fa-file-alt"></i> ${r.paper_count} papers</span>
                        <span class="researcher-impact"><i class="fas fa-chart-line"></i> Impact: High</span>
                    </div>
                </div>
                <div class="researcher-actions">
                    <a href="https://scholar.google.com/scholar?q=${encodeURIComponent(r.name)}" target="_blank" class="researcher-link">
                        <i class="fas fa-graduation-cap"></i> Google Scholar
                    </a>
                </div>
            </div>
        `).join('');
        section.classList.remove('hidden');
    }
}

function displayResearcherStats(data) {
    const section = document.getElementById('researcherStats');
    const container = document.getElementById('researcherStatsGrid');
    
    if (!section || !container) return;
    
    const papers = data.papers || [];
    const allAuthors = papers.flatMap(p => p.authors || []);
    const uniqueAuthors = [...new Set(allAuthors)];
    
    container.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item">
                <i class="fas fa-file-alt"></i>
                <div class="stat-number">${papers.length}</div>
                <div class="stat-label">Total Papers</div>
            </div>
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <div class="stat-number">${uniqueAuthors.length}</div>
                <div class="stat-label">Total Researchers</div>
            </div>
            <div class="stat-item">
                <i class="fas fa-chart-line"></i>
                <div class="stat-number">${Math.round(papers.length / uniqueAuthors.length)}</div>
                <div class="stat-label">Papers per Author</div>
            </div>
            <div class="stat-item">
                <i class="fas fa-calendar"></i>
                <div class="stat-number">${papers[0]?.published || 'N/A'}</div>
                <div class="stat-label">Latest Paper</div>
            </div>
        </div>
    `;
    section.classList.remove('hidden');
}

function showResearcherError(message) {
    const errorDiv = document.getElementById('researcherError');
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
researcherTopic?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchResearchersBtn) searchResearchersBtn.click();
});