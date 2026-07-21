// AWS Configuration
// IMPORTANT: Replace these values with your actual AWS resource endpoints after deployment

const CONFIG = {
    // API Gateway endpoint - Replace with your actual API Gateway URL
    API_ENDPOINT: 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod',
    
    // S3 bucket name for resume uploads - Replace with your actual bucket name
    S3_BUCKET_NAME: 'your-bucket-name',
    
    // AWS Region - Replace with your region (e.g., us-east-1, us-west-2)
    AWS_REGION: 'us-east-1',
    
    // API endpoints
    ENDPOINTS: {
        SUBMIT_APPLICATION: '/applications',
        GET_APPLICATIONS: '/applications',
        GET_APPLICATION: '/applications/{id}',
        UPDATE_APPLICATION: '/applications/{id}',
        DELETE_APPLICATION: '/applications/{id}',
        UPLOAD_RESUME: '/upload-resume'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
