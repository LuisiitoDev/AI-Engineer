// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Enhanced image upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const imageInfo = document.getElementById('imageInfo');
    const submitBtn = document.getElementById('submitBtn');
    const uploadForm = document.getElementById('uploadForm');

    // Drag and drop functionality
    const uploadArea = document.querySelector('.card-body');
    
    if (uploadArea) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            imageInput.files = files;
            handleFileSelect(files[0]);
        }
    }

    // File input change handler
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileSelect(file);
            } else {
                hidePreview();
            }
        });
    }

    function handleFileSelect(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
        if (!allowedTypes.includes(file.type)) {
            showError('Invalid file type. Please select a JPEG, PNG, GIF, or BMP image.');
            return;
        }

        // Validate file size (4MB)
        const maxSize = 4 * 1024 * 1024; // 4MB in bytes
        if (file.size > maxSize) {
            showError('File size too large. Please select an image smaller than 4MB.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewImage) {
                previewImage.src = e.target.result;
                showPreview();
            }
            
            // Create image to get dimensions
            const img = new Image();
            img.onload = function() {
                // Validate dimensions
                if (this.width < 50 || this.height < 50) {
                    showError('Image too small. Minimum dimensions are 50x50 pixels.');
                    hidePreview();
                    return;
                }

                // Show file info
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                const sizeInKB = (file.size / 1024).toFixed(1);
                const displaySize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
                
                if (imageInfo) {
                    imageInfo.innerHTML = `
                        <div class="row text-start">
                            <div class="col-6">
                                <small><strong>File:</strong> ${file.name}</small><br>
                                <small><strong>Size:</strong> ${displaySize}</small>
                            </div>
                            <div class="col-6">
                                <small><strong>Dimensions:</strong> ${this.width} x ${this.height}px</small><br>
                                <small><strong>Type:</strong> ${file.type}</small>
                            </div>
                        </div>
                    `;
                }
                
                // Enable submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
                
                clearError();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showPreview() {
        if (imagePreview) {
            imagePreview.style.display = 'block';
            imagePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function hidePreview() {
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    }

    function showError(message) {
        // Remove existing error alerts
        const existingAlerts = document.querySelectorAll('.alert-danger.custom-error');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger custom-error';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Insert after the form
        if (uploadForm) {
            uploadForm.parentNode.insertBefore(alertDiv, uploadForm.nextSibling);
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    function clearError() {
        const existingAlerts = document.querySelectorAll('.alert-danger.custom-error');
        existingAlerts.forEach(alert => alert.remove());
    }

    // Form submission handler
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            const loadingIcon = document.getElementById('loadingIcon');
            const searchIcon = document.getElementById('searchIcon');
            const submitText = document.getElementById('submitText');
            
            if (loadingIcon) loadingIcon.style.display = 'inline-block';
            if (searchIcon) searchIcon.style.display = 'none';
            if (submitText) submitText.textContent = 'Analyzing...';
            if (submitBtn) submitBtn.disabled = true;
        });
    }

    // Initialize submit button state
    if (submitBtn) {
        submitBtn.disabled = true;
    }
});
