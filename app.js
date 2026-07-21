// Job Application Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        messageDiv.style.display = 'none';

        try {
            // Get form data
            const formData = new FormData(form);
            const resumeFile = document.getElementById('resume').files[0];

            // Validate file size (5MB max)
            if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
                throw new Error('Resume file size must be less than 5MB');
            }

            // Step 1: Upload resume to S3 and get the URL
            let resumeUrl = '';
            if (resumeFile) {
                resumeUrl = await uploadResumeToS3(resumeFile);
            }

            // Step 2: Prepare application data
            const applicationData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                position: formData.get('position'),
                experience: formData.get('experience'),
                education: formData.get('education'),
                skills: formData.get('skills'),
                linkedin: formData.get('linkedin') || '',
                resumeUrl: resumeUrl,
                status: 'New',
                appliedDate: new Date().toISOString()
            };

            // Step 3: Submit application to API
            const response = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.SUBMIT_APPLICATION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit application');
            }

            const result = await response.json();

            // Show success message
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Application submitted successfully! We will contact you soon.';
            messageDiv.style.display = 'block';

            // Reset form
            form.reset();

            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Error:', error);
            messageDiv.className = 'message error';
            messageDiv.textContent = error.message || 'Failed to submit application. Please try again.';
            messageDiv.style.display = 'block';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });
});

// Function to upload resume to S3
async function uploadResumeToS3(file) {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `resumes/${timestamp}-${file.name}`;

        // Step 1: Get presigned URL from API
        const presignedResponse = await fetch(`${CONFIG.API_ENDPOINT}${CONFIG.ENDPOINTS.UPLOAD_RESUME}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName: fileName,
                fileType: file.type
            })
        });

        if (!presignedResponse.ok) {
            throw new Error('Failed to get upload URL');
        }

        const { uploadUrl, fileUrl } = await presignedResponse.json();

        // Step 2: Upload file to S3 using presigned URL
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload resume');
        }

        return fileUrl;

    } catch (error) {
        console.error('Resume upload error:', error);
        throw new Error('Failed to upload resume. Please try again.');
    }
}
