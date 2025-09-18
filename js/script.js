// Portfolio category filtering
document.addEventListener('DOMContentLoaded', function() {
    // Portfolio filtering functionality
    const categoryLinks = document.querySelectorAll('.category-link');
    const galleryItems = document.querySelectorAll('.gallery-item');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Validate form
            if (validateForm()) {
                submitForm();
            }
        });
    }
});

// Form validation functions
function validateForm() {
    let isValid = true;
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate name
    if (name === '') {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        showError('messageError', 'Message is required');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '';
    formMessage.className = 'form-message';
}

function submitForm() {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Show success message
        formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
        formMessage.className = 'form-message success';
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // You would replace the setTimeout simulation with actual form submission
        // Example using fetch API:
        /*
        fetch('/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                document.getElementById('contactForm').reset();
            } else {
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
                formMessage.className = 'form-message error';
            }
        })
        .catch(error => {
            formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
            formMessage.className = 'form-message error';
        })
        .finally(() => {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
        */
    }, 2000);
}

// Shop functionality (basic add to cart)
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Simple alert for demo purposes
            alert(`Added "${productName}" to cart!`);
            
            // In a real implementation, you would:
            // 1. Add item to cart data structure
            // 2. Update cart UI/counter
            // 3. Possibly send to backend
        });
    });
});