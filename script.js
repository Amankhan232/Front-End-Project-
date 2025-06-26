// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .dish-card, .testimonial-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Order button functionality (placeholder)
document.querySelectorAll('.order-btn, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#') {
            e.preventDefault();
            alert('Order functionality will be implemented soon! Call us at +91 98765 43210 to place your order.');
        }
    });
});

// Add to cart functionality for dish cards (placeholder)

// Add to cart functionality for dish cards
document.querySelectorAll('.dish-card').forEach(card => {
    card.addEventListener('click', () => {
        const dishName = card.querySelector('h3').textContent;
        const dishPrice = card.querySelector('.price').textContent;
        const dishId = card.getAttribute('data-id') || Date.now(); // fallback ID

        const cleanPrice = parseFloat(dishPrice.replace(/[^\d.]/g, ''));

        if (!isNaN(cleanPrice)) {
            addToCart(dishId, dishName, cleanPrice);
        } else {
            console.error('Invalid price:', dishPrice);
        }
    });
});


// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Form validation helper function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// API Functions
async function fetchMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        throw new Error('Failed to fetch menu items');
    } catch (error) {
        console.error('Error fetching menu:', error);
        return [];
    }
}

async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

// ✅ Simulated frontend-only order placement function
async function placeOrder(orderData) {
    console.log("Simulating order placement...", orderData);

    // Simulate 1-second delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'Order placed successfully!' });
        }, 1000);
    });
}


// Cart functions
function addToCart(itemId, itemName, price) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${itemName} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Order functionality
function orderNow(itemId, itemName, price) {
    addToCart(itemId, itemName, price);
    // Redirect to checkout or show order modal
    showOrderModal();
}

function showOrderModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Create and show order modal
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Your Order</h2>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <span>${item.name}</span>
                        <span>Qty: ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <strong>Total: ₹${getCartTotal()}</strong>
            </div>
            <form id="orderForm">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Email" required>
                <input type="tel" placeholder="Phone Number" required>
                <textarea placeholder="Delivery Address" required></textarea>
                <button type="submit">Place Order</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').onclick = () => {
        document.body.removeChild(modal);
    };
    
    // Handle order submission
    modal.querySelector('#orderForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderData = {
            customerInfo: {
                name: e.target[0].value,
                email: e.target[1].value,
                phone: e.target[2].value
            },
            items: cart,
            totalAmount: getCartTotal(),
            deliveryAddress: e.target[3].value
        };
        
        const result = await placeOrder(orderData);
        if (result.success) {
            showNotification('Order placed successfully! We will contact you soon.');
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            document.body.removeChild(modal);
        } else {
            showNotification('Failed to place order. Please try again.');
        }
    };
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export functions for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone
    };
}

// FAQ TOGGLE

 document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
        
        // Contact form submission
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: e.target.name.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                message: e.target.message.value
            };
            
            const submitBtn = e.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const result = await submitContactForm(formData);
                if (result.success) {
                    showNotification(result.message);
                    e.target.reset();
                } else {
                    showNotification(result.message || 'Failed to send message');
                }
            } catch (error) {
                showNotification('Network error. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });