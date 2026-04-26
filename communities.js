// Load communities from backend
async function loadCommunities() {
    const response = await fetch('http://localhost:5000/communities');
    const data = await response.json();
    // display communities
}
loadCommunities();