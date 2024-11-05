function createAccessRequestForm() {
    const formContainer = document.getElementById('request-form-container');
    
    // Create form HTML structure
    formContainer.innerHTML = `
        <div class="request-form">
            <div id="form-alert" class="alert" style="display: none;"></div>
            <form id="access-request-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required />
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>

                <div class="form-group">
                    <label for="userid">User ID</label>
                    <input type="text" id="userid" name="userid" required />
                </div>

                <button type="submit" class="form-submit" id="submit-button">
                    Submit Request
                </button>
            </form>
        </div>
    `;

    // Get form elements
    const form = document.getElementById('access-request-form');
    const submitButton = document.getElementById('submit-button');
    const alertDiv = document.getElementById('form-alert');

    // Show alert message
    function showAlert(message, isSuccess) {
        alertDiv.textContent = message;
        alertDiv.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
        alertDiv.style.display = 'block';
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            userid: document.getElementById('userid').value
        };

        try {
            const response = await fetch('http://localhost:8000/api/access-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                showAlert('✓ Your access request has been submitted successfully.', true);
                form.reset();
            } else {
                throw new Error(data.message || 'Failed to submit request');
            }
        } catch (error) {
            showAlert('✕ ' + (error.message || 'An error occurred. Please try again.'), false);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Request';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createAccessRequestForm);
