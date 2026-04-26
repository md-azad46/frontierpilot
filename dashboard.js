// Dashboard Page JavaScript
let currentDashboardData = null;

// DOM Elements
const dashboardTopic = document.getElementById('dashboardTopic');
const dashboardMaxResults = document.getElementById('dashboardMaxResults');
const dashboardResultsCount = document.getElementById('dashboardResultsCount');
const dashboardSearchBtn = document.getElementById('dashboardSearchBtn');
const dashboardLoading = document.getElementById('dashboardLoading');
const dashboardError = document.getElementById('dashboardError');

// Range slider
if (dashboardMaxResults) {
    dashboardMaxResults.addEventListener('input', (e) => {
        dashboardResultsCount.textContent = e.target.value;
    });
}

// Theme Toggle (shared with main page)
let isDarkMode = localStorage.getItem('theme') !== 'light';
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.remove('light-mode');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.add('light-mode');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyTheme();
    });
}
applyTheme();

// Search Function
if (dashboardSearchBtn) {
    dashboardSearchBtn.addEventListener('click', async () => {
        const topic = dashboardTopic.value.trim();
        const numPapers = parseInt(dashboardMaxResults.value);
        
        if (!topic) {
            alert('Please enter a research topic');
            return;
        }
        
        dashboardLoading.classList.remove('hidden');
        dashboardError.classList.add('hidden');
        document.getElementById('researchersSection')?.classList.add('hidden');
        document.getElementById('communitiesSection')?.classList.add('hidden');
        document.getElementById('learningSection')?.classList.add('hidden');
        document.getElementById('statsSection')?.classList.add('hidden');
        dashboardSearchBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: { 'Content-Type':application/json' },
                body: JSON.stringify({ topic: topic, max_results: numPapers })
            });
            
            const data = await response.json();
            
            if (data.error) {
                showDashboardError(data.error);
            } else {
                currentDashboardData = data;
                displayDashboardResearchers(data.top_researchers);
                displayDashboardCommunities(data.communities);
                displayDashboardLearningPath(data.learning_path);
                displayDashboardStats(data);
            }
        } catch (err) {
            showDashboardError('Cannot connect to backend. Make sure "python backend.py" is running on port 5000');
        } finally {
            dashboardLoading.classList.add('hidden');
            dashboardSearchBtn.disabled = false;
        }
    });
}

function displayDashboardResearchers(researchers) {
    const section = document.getElementById('researchersSection');
    const container = document.getElementById('researchersList');
    if (!section || !container) return;
    
    if (researchers && researchers.length > 0) {
        container.innerHTML = researchers.slice(0,10).map(r => `
            <div class="researcher-card">
                <span class="researcher-name">${escapeHtml(r.name)}</span>
                <span class="researcher-count">${r.paper_count} papers</span>
            </div>
        `).join('');
        section.classList.remove('hidden');
    }
}

function displayDashboardCommunities(communities) {
    const section = document.getElementById('communitiesSection');
    const container = document.getElementById('communitiesList');
    if (!section || !container) return;
    
    if (communities) {
        let html = '';
        
        if (communities.reddit && communities.reddit.length > 0) {
            html += `<h4 style="margin-top:0; margin-bottom:0.75rem;"><i class="fab fa-reddit"></i> Reddit Communities</h4><div class="communities-grid">`;
            html += communities.reddit.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta"><i class="fas fa-users"></i> ${c.members} members</div>
                    <a href="${c.url}" class="community-link" target="_blank">Join Community →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        if (communities.discord && communities.discord.length > 0) {
            html += `<h4 style="margin-top:1.5rem; margin-bottom:0.75rem;"><i class="fab fa-discord"></i> Discord Servers</h4><div class="communities-grid">`;
            html += communities.discord.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta"><i class="fas fa-users"></i> ${c.members} members</div>
                    <a href="${c.url}" class="community-link" target="_blank">Join Server →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        if (communities.conferences && communities.conferences.length > 0) {
            html += `<h4 style="margin-top:1.5rem; margin-bottom:0.75rem;"><i class="fas fa-calendar-alt"></i> Top Conferences</h4><div class="communities-grid">`;
            html += communities.conferences.map(c => `
                <div class="community-card">
                    <div class="community-name">${c.name}</div>
                    <div class="community-meta"><i class="fas fa-calendar"></i> ${c.date}</div>
                    <a href="${c.url}" class="community-link" target="_blank">View Conference →</a>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        container.innerHTML = html;
        section.classList.remove('hidden');
    }
}

function displayDashboardLearningPath(learningPath) {
    const section = document.getElementById('learningSection');
    const container = document.getElementById('learningList');
    if (!section || !container) return;
    
    if (learningPath) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const levelNames = {'beginner': '🌱 Beginner Level', 'intermediate': '📈 Intermediate Level', 'advanced': '🚀 Advanced Level'};
        const levelIcons = {'beginner': 'seedling', 'intermediate': 'chart-line', 'advanced': 'rocket'};
        
        let html = '<div class="learning-levels">';
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
                                    ${item.duration ? `<span class="level-duration">📅 ${item.duration}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';
        container.innerHTML = html;
        section.classList.remove('hidden');
    }
}

function displayDashboardStats(data) {
    const section = document.getElementById('statsSection');
    const container = document.getElementById('statsSummary');
    if (!section || !container) return;
    
    const papers = data.papers || [];
    const allAuthors = papers.flatMap(p => p.authors || []);
    const uniqueAuthors = [...new Set(allAuthors)];
    
    container.innerHTML = `
        <div class="stats-summary-grid">
            <div class="summary-card">
                <i class="fas fa-file-alt"></i>
                <div class="summary-info">
                    <div class="summary-label">Total Papers Analyzed</div>
                    <div class="summary-value">${papers.length}</div>
                </div>
            </div>
            <div class="summary-card">
                <i class="fas fa-users"></i>
                <div class="summary-info">
                    <div class="summary-label">Unique Researchers</div>
                    <div class="summary-value">${uniqueAuthors.length}</div>
                </div>
            </div>
            <div class="summary-card">
                <i class="fas fa-calendar"></i>
                <div class="summary-info">
                    <div class="summary-label">Latest Paper</div>
                    <div class="summary-value">${papers[0]?.published || 'N/A'}</div>
                </div>
            </div>
            <div class="summary-card">
                <i class="fas fa-hashtag"></i>
                <div class="summary-info">
                    <div class="summary-label">Topic</div>
                    <div class="summary-value">${escapeHtml(data.topic)}</div>
                </div>
            </div>
        </div>
    `;
    section.classList.remove('hidden');
}

function showDashboardError(message) {
    const errorDiv = document.getElementById('dashboardError');
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
dashboardTopic?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && dashboardSearchBtn) dashboardSearchBtn.click();
});