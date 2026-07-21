// Admin Panel Handler
let allApplications = [];
let currentApplicationId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadApplications();

    // Event listeners
    document.getElementById('refreshBtn').addEventListener('click', loadApplications);
    document.getElementById('searchInput').addEventListener('input', filterApplications);
    document.getElementById('filterPosition').addEventListener('change', filterApplications);
    document.getElementById('filterStatus').addEventListener('change', filterApplications);

    // Modal controls
    const modal = document.getElementById('detailsModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    document.getElementById('updateStatusBtn').addEventListener('click', updateApplicationStatus);
    document.getElementById('deleteAppBtn').addEventListener('click', deleteApplication);
});

// Load all applications from API
async function loadApplications() {
    const loadingDiv = document.getElementById('loadingMessage');
    const errorDiv = document.getElementById('errorMessage');
    
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.GET_APPLICATIONS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load applications');
        }

        const data = await response.json();
        allApplications = data.applications || [];

        displayApplications(allApplications);
        updateStats(allApplications);

    } catch (error) {
        console.error('Error loading applications:', error);
        errorDiv.textContent = 'Failed to load applications. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Display applications in table
function displayApplications(applications) {
    const tbody = document.getElementById('applicationsBody');
    
    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No applications found</td></tr>';
        return;
    }

    tbody.innerHTML = applications.map(app => `
        <tr>
            <td>${app.fullName}</td>
            <td>${app.email}</td>
            <td>${app.phone}</td>
            <td>${app.position}</td>
            <td>${app.experience} years</td>
            <td><span class="status-badge status-${getStatusClass(app.status)}">${app.status}</span></td>
            <td>${formatDate(app.appliedDate)}</td>
            <td>
                <button class="action-btn btn-view" onclick="viewApplication('${app.id}')">View</button>
                <button class="action-btn btn-delete" onclick="confirmDelete('${app.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Get status class for styling
function getStatusClass(status) {
    const statusMap = {
        'New': 'new',
        'Under Review': 'review',
        'Interview Scheduled': 'interview',
        'Rejected': 'rejected',
        'Accepted': 'accepted'
    };
    return statusMap[status] || 'new';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Update statistics
function updateStats(applications) {
    document.getElementById('totalApps').textContent = applications.length;
    document.getElementById('newApps').textContent = applications.filter(a => a.status === 'New').length;
    document.getElementById('reviewApps').textContent = applications.filter(a => a.status === 'Under Review').length;
    document.getElementById('acceptedApps').textContent = applications.filter(a => a.status === 'Accepted').length;
}

// Filter applications
function filterApplications() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const positionFilter = document.getElementById('filterPosition').value;
    const statusFilter = document.getElementById('filterStatus').value;

    let filtered = allApplications;

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(app => 
            app.fullName.toLowerCase().includes(searchTerm) ||
            app.email.toLowerCase().includes(searchTerm) ||
            app.position.toLowerCase().includes(searchTerm)
        );
    }

    // Position filter
    if (positionFilter) {
        filtered = filtered.filter(app => app.position === positionFilter);
    }

    // Status filter
    if (statusFilter) {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

    displayApplications(filtered);
}

// View application details
async function viewApplication(id) {
    currentApplicationId = id;
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');

    try {
        const response = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.GET_APPLICATION.replace('{id}', id)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load application details');
        }

        const app = await response.json();

        // Set current status in dropdown
        document.getElementById('statusUpdate').value = app.status;

        // Display application details
        modalBody.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">Full Name</div>
                <div class="detail-value">${app.fullName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Email</div>
                <div class="detail-value">${app.email}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone</div>
                <div class="detail-value">${app.phone}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Position</div>
                <div class="detail-value">${app.position}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Experience</div>
                <div class="detail-value">${app.experience} years</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Education</div>
                <div class="detail-value">${app.education}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Skills</div>
                <div class="detail-value">${app.skills}</div>
            </div>
            ${app.linkedin ? `
            <div class="detail-row">
                <div class="detail-label">LinkedIn</div>
                <div class="detail-value"><a href="${app.linkedin}" target="_blank" class="resume-link">${app.linkedin}</a></div>
            </div>
            ` : ''}
            ${app.resumeUrl ? `
            <div class="detail-row">
                <div class="detail-label">Resume</div>
                <div class="detail-value"><a href="${app.resumeUrl}" target="_blank" class="resume-link">Download Resume</a></div>
            </div>
            ` : ''}
            <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge status-${getStatusClass(app.status)}">${app.status}</span></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Applied Date</div>
                <div class="detail-value">${formatDate(app.appliedDate)}</div>
            </div>
        `;

        modal.style.display = 'block';

    } catch (error) {
        console.error('Error loading application details:', error);
        alert('Failed to load application details. Please try again.');
    }
}

// Update application status
async function updateApplicationStatus() {
    if (!currentApplicationId) return;

    const newStatus = document.getElementById('statusUpdate').value;
    
    try {
        const response = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.UPDATE_APPLICATION.replace('{id}', currentApplicationId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        // Close modal and reload applications
        document.getElementById('detailsModal').style.display = 'none';
        alert('Status updated successfully!');
        loadApplications();

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
    }
}

// Confirm delete
function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
        deleteApplicationById(id);
    }
}

// Delete application (from modal)
async function deleteApplication() {
    if (!currentApplicationId) return;
    
    if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
        await deleteApplicationById(currentApplicationId);
        document.getElementById('detailsModal').style.display = 'none';
    }
}

// Delete application by ID
async function deleteApplicationById(id) {
    try {
        const response = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.DELETE_APPLICATION.replace('{id}', id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete application');
        }

        alert('Application deleted successfully!');
        loadApplications();

    } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
    }
}
