// Lambda Function: Submit Job Application
// This function handles POST requests to create new job applications
// Deploy this to AWS Lambda and connect to API Gateway

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

// IMPORTANT: Set this environment variable in Lambda configuration
const TABLE_NAME = process.env.APPLICATIONS_TABLE || 'JobApplications';

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

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'phone', 'position', 'experience', 'education', 'skills'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        message: `Missing required field: ${field}` 
                    })
                };
            }
        }

        // Generate unique ID
        const applicationId = uuidv4();
        const timestamp = new Date().toISOString();

        // Prepare item for DynamoDB
        const item = {
            id: applicationId,
            fullName: body.fullName,
            email: body.email,
            phone: body.phone,
            position: body.position,
            experience: body.experience,
            education: body.education,
            skills: body.skills,
            linkedin: body.linkedin || '',
            resumeUrl: body.resumeUrl || '',
            status: body.status || 'New',
            appliedDate: body.appliedDate || timestamp,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        // Save to DynamoDB
        const params = {
            TableName: TABLE_NAME,
            Item: item
        };

        await dynamodb.put(params).promise();

        // Return success response
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Application submitted successfully',
                applicationId: applicationId,
                data: item
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
