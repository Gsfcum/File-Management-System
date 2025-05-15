alert('File management system is running!');

document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('appRoot');
    let currentPage = localStorage.getItem('currentPage') || 'login';
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let files = [];
    let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    let favoriteFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    let deletedFiles = JSON.parse(localStorage.getItem('deletedFiles') || '[]');

    // --- Noting and File Register State ---
    let fileRegister = JSON.parse(localStorage.getItem('fileRegister') || '[]');
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');

    // Router
    function navigate(page) {
        currentPage = page;
        localStorage.setItem('currentPage', page);
        renderPage();
    }

    function logout() {
        isLoggedIn = false;
        localStorage.setItem('isLoggedIn', 'false');
        navigate('login');
    }

    function renderPage() {
        if (!isLoggedIn && currentPage !== 'login') {
            navigate('login');
            return;
        }
        switch (currentPage) {
            case 'login':
                renderLoginPage();
                break;
            case 'dashboard':
                renderDashboardPage();
                break;
            case 'trash':
                renderTrashPage();
                break;
            case 'recent':
                renderRecentPage();
                break;
            case 'favorites':
                renderFavoritesPage();
                break;
            default:
                renderLoginPage();
        }
    }

    // --- Page 1: Login ---
    function renderLoginPage() {
        appRoot.innerHTML = `
            <div class="app-layout" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(120deg, #e8eaed 0%, #cfd8dc 100%);">
                <div style="background: #fff; border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10); padding: 48px 38px; display: flex; flex-direction: column; align-items: center; min-width: 320px;">
                    <img src="Images/gsfcu.c31cce6c.png" alt="GSFC University Logo" style="width: 80px; margin-bottom: 18px;">
                    <h1 style="font-size: 2.1em; font-weight: 800; color: #223366; margin-bottom: 8px;">GSFCU File Management</h1>
                    <div style="font-size: 1.1em; color: #636e72; margin-bottom: 28px;">Sign in to continue</div>
                    <form id="loginForm" style="width: 100%; display: flex; flex-direction: column; gap: 16px;">
                        <input type="text" placeholder="Username" required style="padding: 10px 14px; border-radius: 8px; border: 1px solid #dfe6e9; font-size: 1em;">
                        <input type="password" placeholder="Password" required style="padding: 10px 14px; border-radius: 8px; border: 1px solid #dfe6e9; font-size: 1em;">
                        <button type="submit" style="background: linear-gradient(120deg, #223366 60%, #e17055 100%); color: #fff; border: none; border-radius: 8px; padding: 12px 0; font-size: 1.1em; font-weight: 700; cursor: pointer;">Login</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('loginForm').onsubmit = e => {
            e.preventDefault();
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            navigate('dashboard');
        };
    }

    // --- Page 2: Dashboard ---
    function renderDashboardPage() {
        appRoot.innerHTML = `
            <div class="app-layout" style="background: linear-gradient(120deg, #e8eaed 0%, #cfd8dc 100%); min-height: 100vh;">
                <div class="header-bar" style="background: rgba(255,255,255,0.85); box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <div style="display:flex;align-items:center;">
                        <img src="Images/gsfcu.c31cce6c.png" alt="GSFC University Logo" class="logo">
                        <span class="system-title" style="color:#223366;">GSFCU File Management System</span>
                    </div>
                    <button onclick="window.logout()" style="background:none;border:none;color:#223366;font-size:1.1em;cursor:pointer;"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
                <div class="main-panels" style="display:flex;gap:32px;flex-wrap:wrap;justify-content:center;align-items:flex-start;">
                    <section class="panel" id="notingPanel" style="flex:1 1 340px;min-width:320px;max-width:520px;">
                        <img src="Images/gsfcu.c31cce6c.png" alt="GSFC University Logo" style="width: 48px; margin-bottom: 12px;">
                        <div class="panel-title" style="font-size:1.5em;font-weight:700;color:#223366;">Noting Side</div>
                        <button onclick="window.openUploadModal('annexure')" class="action-btn" style="margin-bottom:18px;"><i class="fas fa-upload"></i> Upload File</button>
                        <div class="files-grid" id="annexureFiles"></div>
                    </section>
                    <section class="panel" id="correspondingPanel" style="flex:1 1 340px;min-width:320px;max-width:520px;">
                        <img src="Images/gsfcu.c31cce6c.png" alt="GSFC University Logo" style="width: 48px; margin-bottom: 12px;">
                        <div class="panel-title" style="font-size:1.5em;font-weight:700;color:#223366;">Corresponding Side</div>
                        <button onclick="window.openUploadModal('corresponding')" class="action-btn" style="margin-bottom:18px;"><i class="fas fa-upload"></i> Upload File</button>
                        <div class="files-grid" id="correspondingFiles"></div>
                    </section>
                </div>
                <div class="bottom-nav" style="position:fixed;bottom:0;left:0;background:rgba(255,255,255,0.95);padding:12px 24px;display:flex;gap:24px;box-shadow:0 -2px 10px rgba(0,0,0,0.05);z-index:100;">
                    <button onclick="navigate('recent')" class="nav-btn" title="Recent Files">
                        <i class="fas fa-clock"></i>
                    </button>
                    <button onclick="navigate('trash')" class="nav-btn" title="Trash">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="navigate('favorites')" class="nav-btn" title="Favorites">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
        `;
        loadFiles();
    }

    function createFileCard(file) {
        const fileIcon = getFileIcon(file.filetype);
        const fileSize = formatFileSize(file.filesize);
        const uploadDate = new Date(file.uploadDate).toLocaleDateString();
        const isFavorite = favoriteFiles.includes(file.id);
        
        return `
            <div class="file-card" data-id="${file.id}">
                <i class="${fileIcon}" style="font-size:2em;color:#90a4ae;margin-bottom:10px;"></i>
                <div style="font-size:1.1em;font-weight:600;color:#223366;margin-bottom:6px;word-break:break-word;">${file.originalname}</div>
                <div style="font-size:0.9em;color:#636e72;">${fileSize} • ${uploadDate}</div>
                <div class="file-actions" style="margin-top:12px;display:flex;gap:12px;justify-content:center;">
                    <a href="/api/files/${file.id}" class="action-btn" download title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                    <button onclick="window.toggleFavorite(${file.id})" class="action-btn" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fas fa-star" style="color:${isFavorite ? '#e17055' : '#90a4ae'}"></i>
                    </button>
                    <button onclick="window.deleteFile(${file.id})" class="action-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    window.toggleFavorite = function(fileId) {
        const index = favoriteFiles.indexOf(fileId);
        if (index === -1) {
            favoriteFiles.push(fileId);
        } else {
            favoriteFiles.splice(index, 1);
        }
        localStorage.setItem('favoriteFiles', JSON.stringify(favoriteFiles));
        loadFiles();
    };

    window.deleteFile = async function(fileId) {
        try {
            const response = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('File deleted successfully', 'success');
                loadFiles(); // Refresh both panels
            } else {
                throw new Error('Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            showNotification('Error deleting file', 'error');
        }
    };

    // --- Noting Section ---
    function renderNotesSection() {
        return `
        <div class="notes-section" style="background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.04);padding:18px 14px;margin-bottom:18px;">
            <h3 style="margin-top:0;color:#e17055;font-size:1.1em;margin-bottom:10px;">Noting Section</h3>
            <div class="notes-list" id="notesList">
                ${notes.map(note => `<div class="note-item" style="background:#eaf6fb;border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:0.98em;color:#223366;">${note}</div>`).join('')}
            </div>
            <form class="add-note-form" id="addNoteForm" style="display:flex;gap:8px;">
                <input type="text" placeholder="Add a note..." required style="flex:1;padding:7px 10px;border:1px solid #dfe6e9;border-radius:6px;font-size:1em;">
                <button type="submit" style="background:#e17055;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:1em;font-weight:600;cursor:pointer;transition:background 0.2s;">Add</button>
            </form>
        </div>`;
    }

    // --- File Register and Notes Events ---
    function setupNotesEvents() {
        const form = document.getElementById('addNoteForm');
        if (form) {
            form.onsubmit = e => {
                e.preventDefault();
                const input = form.querySelector('input');
                notes.push(input.value);
                localStorage.setItem('notes', JSON.stringify(notes));
                renderDashboardPage();
            };
        }
    }

    // --- Upload Modal Logic (reused for both panels) ---
    let uploadModal = null;
    let uploadPanel = null;

    function openUploadModal(panel) {
        uploadPanel = panel; // 'annexure' or 'corresponding'
        if (uploadModal) uploadModal.remove();
        uploadModal = document.createElement('div');
        uploadModal.className = 'upload-modal';
        uploadModal.innerHTML = `
            <div class="upload-modal-content">
                <button class="upload-modal-close" title="Close" onclick="closeUploadModal()"><i class='fas fa-times'></i></button>
                <h2>Upload File</h2>
                <div class="upload-drop-area" id="uploadDropArea">
                    <i class="fas fa-cloud-upload-alt" style="font-size:2.5em;"></i><br>
                    <span>Drag & drop file here or <b>click to select</b></span>
                    <input type="file" id="uploadFileInput" />
                </div>
                <div class="upload-progress" style="display:none;">
                    <div class="upload-progress-bar" id="uploadProgressBar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(uploadModal);
        // Drag & drop logic
        const dropArea = document.getElementById('uploadDropArea');
        const fileInput = document.getElementById('uploadFileInput');
        dropArea.onclick = () => fileInput.click();
        dropArea.ondragover = e => { e.preventDefault(); dropArea.classList.add('dragover'); };
        dropArea.ondragleave = e => { e.preventDefault(); dropArea.classList.remove('dragover'); };
        dropArea.ondrop = e => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        };
        fileInput.onchange = () => {
            if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
        };
    }
    window.openUploadModal = openUploadModal;

    function closeUploadModal() {
        if (uploadModal) uploadModal.remove();
        uploadModal = null;
        uploadPanel = null;
    }
    window.closeUploadModal = closeUploadModal;

    function handleFileUpload(file) {
        const progressBar = document.getElementById('uploadProgressBar');
        const progressContainer = progressBar.parentElement;
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('side', uploadPanel || 'annexure'); // 'annexure' or 'corresponding'
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/files', true);
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                progressBar.style.width = percent + '%';
            }
        };
        xhr.onload = async function() {
            if (xhr.status === 200) {
                showNotification('File uploaded successfully!', 'success');
                closeUploadModal();
                loadFiles(); // Refresh both panels
            } else {
                showNotification('Error uploading file', 'error');
                progressBar.style.width = '0%';
            }
        };
        xhr.onerror = function() {
            showNotification('Error uploading file', 'error');
            progressBar.style.width = '0%';
        };
        xhr.send(formData);
    }

    async function loadFiles() {
        try {
            const response = await fetch('/api/files');
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const files = await response.json();
            
            // Update Annexure Files
            const annexureFiles = document.getElementById('annexureFiles');
            if (annexureFiles) {
                annexureFiles.innerHTML = files
                    .filter(file => file.side === 'annexure')
                    .map(file => createFileCard(file))
                    .join('');
            }

            // Update Corresponding Files
            const correspondingFiles = document.getElementById('correspondingFiles');
            if (correspondingFiles) {
                correspondingFiles.innerHTML = files
                    .filter(file => file.side === 'corresponding')
                    .map(file => createFileCard(file))
                    .join('');
            }
        } catch (error) {
            console.error('Error loading files:', error);
            showNotification('Error loading files', 'error');
        }
    }

    function getFileIcon(mimeType) {
        if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
        if (mimeType.includes('word') || mimeType.includes('document') || mimeType.includes('msword')) return 'fas fa-file-word';
        if (mimeType.includes('excel') || mimeType.includes('sheet') || mimeType.includes('spreadsheetml')) return 'fas fa-file-excel';
        if (mimeType.includes('image')) return 'fas fa-file-image';
        if (mimeType.includes('presentation')) return 'fas fa-file-powerpoint';
        return 'fas fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Add styles for new buttons
    const style = document.createElement('style');
    style.textContent = `
        .action-btn {
            background: none;
            border: none;
            color: #223366;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 0.9em;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .action-btn:hover {
            background: rgba(34,51,102,0.1);
        }
        .nav-btn {
            background: none;
            border: none;
            color: #223366;
            font-size: 1.4em;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .nav-btn:hover {
            background: rgba(34,51,102,0.1);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);

    // Initial page load
    renderPage();
    window.logout = logout;
}); 