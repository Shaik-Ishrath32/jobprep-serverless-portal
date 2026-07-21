// Lambda Function: Generate Presigned URL for Resume Upload
// This function generates a presigned URL for direct S3 uploads
// Deploy this to AWS Lambda and connect to API Gateway

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// IMPORTANT: Set this environment variable in Lambda configuration
const BUCKET_NAME = process.env.RESUME_BUCKET || 'your-job-applications-bucket';

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const body = JSON.parse(event.body);
        const { fileName, fileType } = body;

        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    message: 'fileName and fileType are required' 
                })
            };
        }

        // Generate presigned URL for PUT operation
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            ContentType: fileType,
            Expires: 300 // URL expires in 5 minutes
        };

        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                uploadUrl: uploadUrl,
                fileUrl: fileUrl
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                message: 'Internal server error',
                error: error.message 
            })
        };
    }
};
