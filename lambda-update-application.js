// Lambda Function: Update Application
// This function handles PUT requests to update job application status
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
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
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

        // Parse request body
        const body = JSON.parse(event.body);
        const { status } = body;

        if (!status) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    message: 'Status is required' 
                })
            };
        }

        const timestamp = new Date().toISOString();

        // Update item in DynamoDB
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id: applicationId
            },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': timestamp
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.update(params).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Application updated successfully',
                data: result.Attributes
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
