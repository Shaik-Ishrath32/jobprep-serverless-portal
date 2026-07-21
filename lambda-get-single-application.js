// Lambda Function: Get Single Application
// This function handles GET requests to retrieve a specific job application
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
        // Get application ID from path parameters
        const applicationId = event.pathParameters?.id;

        if (!applicationId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    message: 'Application ID is required' 
                })
            };
        }

        // Get item from DynamoDB
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id: applicationId
            }
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    message: 'Application not found' 
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Item)
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
