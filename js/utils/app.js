import { saveContactMessage } from './data-service.js';

document.addEventListener('DOMContentLoaded', function () {

    // --- Logic for enlarging images (Modal) ---
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('modalCaption');
        const images = document.querySelectorAll('.enlargeable-image');
        const span = document.getElementsByClassName('image-modal-close')[0];

        images.forEach(image => {
            image.onclick = function(){
                modal.style.display = "block";
                modalImg.src = this.dataset.src || this.src;
                captionText.innerHTML = this.alt;
            }
        });

        span.onclick = function() { 
            modal.style.display = "none";
        }

        // Close modal when clicking outside the image
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...';

            try {
                await saveContactMessage({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                });
                alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                contactForm.reset();
            } catch (error) {
                console.error('Failed to send message:', error);
                alert('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'إرسال الرسالة';
            }
        });
    }
});