// Form validation and file upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const menuUpload = document.getElementById('menuUpload');
    const logoUpload = document.getElementById('logoUpload');
    const menuFileName = document.getElementById('menuFileName');
    const logoFileName = document.getElementById('logoFileName');

    // File upload handlers - only run if elements exist
    if (menuUpload && menuFileName) {
        menuUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                menuFileName.textContent = file.name;
                menuFileName.style.color = '#10b981';
            } else {
                menuFileName.textContent = '';
            }
        });
    }

    if (logoUpload && logoFileName) {
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                logoFileName.textContent = file.name;
                logoFileName.style.color = '#10b981';
            } else {
                logoFileName.textContent = '';
            }
        });
    }

    // Form validation
    function validateForm() {
        if (!form) return true; // If no form, consider valid
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const existingError = formGroup.querySelector('.error-message');
            
            if (existingError) {
                existingError.remove();
            }
            
            input.classList.remove('error');
            
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (input.type === 'tel' && !isValidPhone(input.value)) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(input, message) {
        input.classList.add('error');
        const formGroup = input.closest('.form-group');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    // Form submission - only run if form exists
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Show loading state
                const submitButton = form.querySelector('.submit-button');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Collect form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    // Log form data (replace with actual submission)
                    console.log('Form submitted with data:', data);
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset form
                    form.reset();
                    if (menuFileName) menuFileName.textContent = '';
                    if (logoFileName) logoFileName.textContent = '';
                    
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                }, 2000);
            }
        });
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Registration successful! Welcome to FastDash!';
        successDiv.style.cssText = `
            background-color: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        `;
        
        form.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Real-time validation - only run if form exists
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.hasAttribute('required') && input.value.trim()) {
                    if (input.type === 'email' && !isValidEmail(input.value)) {
                        showError(input, 'Please enter a valid email address');
                    } else if (input.type === 'tel' && !isValidPhone(input.value)) {
                        showError(input, 'Please enter a valid phone number');
                    } else {
                        // Clear any existing errors
                        input.classList.remove('error');
                        const formGroup = input.closest('.form-group');
                        const existingError = formGroup.querySelector('.error-message');
                        if (existingError) {
                            existingError.remove();
                        }
                    }
                }
            });

            input.addEventListener('input', function() {
                // Clear error styling when user starts typing
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const formGroup = input.closest('.form-group');
                    const existingError = formGroup.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
            });
        });
    }

    // Phone number formatting - only run if phone input exists
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Hours formatting suggestions - only run if hours input exists
    const hoursInput = document.getElementById('hours');
    if (hoursInput) {
        hoursInput.addEventListener('focus', function() {
            if (!this.value) {
                this.placeholder = 'e.g., 9:00 AM - 10:00 PM';
            }
        });

        hoursInput.addEventListener('blur', function() {
            if (!this.value) {
                this.placeholder = 'Enter hours of operation...';
            }
        });
    }
});