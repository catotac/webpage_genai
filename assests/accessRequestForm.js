const AccessRequestForm = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        userid: ''
    });

    const [status, setStatus] = React.useState({
        isSubmitting: false,
        isSubmitted: false,
        error: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ isSubmitting: true, isSubmitted: false, error: null });

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
                setStatus({
                    isSubmitting: false,
                    isSubmitted: true,
                    error: null
                });
                
                setFormData({
                    name: '',
                    email: '',
                    userid: ''
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setStatus({
                isSubmitting: false,
                isSubmitted: false,
                error: error.message
            });
        }
    };

    return (
        <div className="request-form">
            {status.isSubmitted && (
                <div className="alert alert-success">
                    ✓ Your access request has been submitted successfully.
                </div>
            )}
            
            {status.error && (
                <div className="alert alert-error">
                    ✕ {status.error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="userid">User ID</label>
                    <input
                        type="text"
                        id="userid"
                        name="userid"
                        value={formData.userid}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="form-submit"
                    disabled={status.isSubmitting}
                >
                    {status.isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const mountNode = document.getElementById('request-form-container');
    if (mountNode) {
        ReactDOM.render(<AccessRequestForm />, mountNode);
    }
});
