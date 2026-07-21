// Lambda Function: Get All Applications
// This function handles GET requests to retrieve all job applications
// Deploy this to AWS Lambda and connect to API Gateway

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// IMPORTANT: Set this environment variable in Lambda configuration
const TABLE_NAME = process.env.APPLICATIONS_TABLE || 'JobApplications';

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        // Scan DynamoDB table to get all applications
        const params = {
            TableName: TABLE_NAME
        };

        const result = await dynamodb.scan(params).promise();

        // Sort by appliedDate (newest first)
        const applications = result.Items.sort((a, b) => {
            return new Date(b.appliedDate) - new Date(a.appliedDate);
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                applications: applications,
                count: applications.length
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
