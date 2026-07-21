# Job Application System - AWS Deployment Guide

This guide will walk you through deploying your serverless job application system on AWS.

## Architecture Overview

- **Frontend**: HTML/CSS/JS hosted on S3 (static website)
- **Backend**: Lambda functions for API operations
- **Database**: DynamoDB for storing applications
- **Storage**: S3 for resume files
- **API**: API Gateway to connect frontend with Lambda functions

---

## Prerequisites

- AWS Account
- AWS CLI installed and configured (optional but recommended)
- Basic knowledge of AWS Console

---

## Step 1: Create DynamoDB Table

1. Go to **DynamoDB** in AWS Console
2. Click **Create table**
3. Configure:
   - **Table name**: `JobApplications`
   - **Partition key**: `id` (String)
   - **Table settings**: Use default settings (On-demand capacity)
4. Click **Create table**
5. Note down the table name and ARN

---

## Step 2: Create S3 Buckets

### Bucket 1: Resume Storage

1. Go to **S3** in AWS Console
2. Click **Create bucket**
3. Configure:
   - **Bucket name**: `your-job-applications-resumes` (must be globally unique)
   - **Region**: Choose your preferred region (e.g., us-east-1)
   - **Block Public Access**: Uncheck "Block all public access"
   - Check the acknowledgment
4. Click **Create bucket**
5. Configure CORS:
   - Go to bucket → **Permissions** → **CORS**
   - Add this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

6. Configure Bucket Policy for public read access:
   - Go to **Permissions** → **Bucket Policy**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-job-applications-resumes/*"
        }
    ]
}
```

### Bucket 2: Static Website Hosting

1. Create another bucket:
   - **Bucket name**: `your-job-application-website` (must be globally unique)
   - **Region**: Same as above
   - **Block Public Access**: Uncheck "Block all public access"
2. Enable static website hosting:
   - Go to **Properties** → **Static website hosting**
   - Select **Enable**
   - **Index document**: `index.html`
   - **Error document**: `index.html`
   - Click **Save changes**
3. Note the **Bucket website endpoint** (e.g., http://your-bucket.s3-website-us-east-1.amazonaws.com)
4. Add bucket policy for public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-job-application-website/*"
        }
    ]
}
```

---

## Step 3: Create IAM Role for Lambda Functions

1. Go to **IAM** → **Roles** → **Create role**
2. Select **AWS service** → **Lambda** → **Next**
3. Attach these policies:
   - `AWSLambdaBasicExecutionRole` (for CloudWatch logs)
   - `AmazonDynamoDBFullAccess` (for DynamoDB operations)
   - `AmazonS3FullAccess` (for S3 operations)
4. Name the role: `JobApplicationLambdaRole`
5. Click **Create role**
6. Note down the Role ARN

---

## Step 4: Create Lambda Functions

Create 6 Lambda functions. For each function:

### Common Configuration for All Functions:

1. Go to **Lambda** → **Create function**
2. Select **Author from scratch**
3. **Runtime**: Node.js 18.x (or latest LTS)
4. **Architecture**: x86_64
5. **Permissions**: Use existing role → Select `JobApplicationLambdaRole`

### Function 1: Submit Application

- **Function name**: `job-app-submit`
- **Code**: Copy content from `lambda-submit-application.js`
- **Environment variables**:
  - `APPLICATIONS_TABLE` = `JobApplications`
- **Timeout**: Change to 30 seconds (Configuration → General configuration)

### Function 2: Get All Applications

- **Function name**: `job-app-get-all`
- **Code**: Copy content from `lambda-get-applications.js`
- **Environment variables**:
  - `APPLICATIONS_TABLE` = `JobApplications`
- **Timeout**: 30 seconds

### Function 3: Get Single Application

- **Function name**: `job-app-get-one`
- **Code**: Copy content from `lambda-get-single-application.js`
- **Environment variables**:
  - `APPLICATIONS_TABLE` = `JobApplications`
- **Timeout**: 30 seconds

### Function 4: Update Application

- **Function name**: `job-app-update`
- **Code**: Copy content from `lambda-update-application.js`
- **Environment variables**:
  - `APPLICATIONS_TABLE` = `JobApplications`
- **Timeout**: 30 seconds

### Function 5: Delete Application

- **Function name**: `job-app-delete`
- **Code**: Copy content from `lambda-delete-application.js`
- **Environment variables**:
  - `APPLICATIONS_TABLE` = `JobApplications`
- **Timeout**: 30 seconds

### Function 6: Upload Resume (Generate Presigned URL)

- **Function name**: `job-app-upload-resume`
- **Code**: Copy content from `lambda-upload-resume.js`
- **Environment variables**:
  - `RESUME_BUCKET` = `your-job-applications-resumes` (your actual bucket name)
- **Timeout**: 30 seconds

**Important**: For each function, click **Deploy** after pasting the code!

---

## Step 5: Create API Gateway

1. Go to **API Gateway** → **Create API**
2. Choose **REST API** (not Private) → **Build**
3. **API name**: `JobApplicationAPI`
4. **Endpoint Type**: Regional
5. Click **Create API**

### Create Resources and Methods:

#### Resource 1: /applications (POST - Submit Application)

1. Click **Actions** → **Create Resource**
2. **Resource Name**: `applications`
3. **Enable CORS**: Check
4. Click **Create Resource**
5. Select `/applications` → **Actions** → **Create Method** → **POST**
6. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-submit`
   - Click **Save** → **OK**

#### Resource 2: /applications (GET - Get All Applications)

1. Select `/applications` → **Actions** → **Create Method** → **GET**
2. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-get-all`
   - Click **Save** → **OK**

#### Resource 3: /applications/{id} (GET - Get Single Application)

1. Select `/applications` → **Actions** → **Create Resource**
2. **Resource Name**: `{id}`
3. **Resource Path**: `{id}`
4. Click **Create Resource**
5. Select `/applications/{id}` → **Actions** → **Create Method** → **GET**
6. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-get-one`
   - Click **Save** → **OK**

#### Resource 4: /applications/{id} (PUT - Update Application)

1. Select `/applications/{id}` → **Actions** → **Create Method** → **PUT**
2. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-update`
   - Click **Save** → **OK**

#### Resource 5: /applications/{id} (DELETE - Delete Application)

1. Select `/applications/{id}` → **Actions** → **Create Method** → **DELETE**
2. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-delete`
   - Click **Save** → **OK**

#### Resource 6: /upload-resume (POST - Generate Upload URL)

1. Select root `/` → **Actions** → **Create Resource**
2. **Resource Name**: `upload-resume`
3. Click **Create Resource**
4. Select `/upload-resume` → **Actions** → **Create Method** → **POST**
5. Configure:
   - **Integration type**: Lambda Function
   - **Lambda Function**: `job-app-upload-resume`
   - Click **Save** → **OK**

### Enable CORS for All Methods:

1. For each resource and method:
2. **Actions** → **Enable CORS**
3. Keep default settings
4. Click **Enable CORS and replace existing CORS headers**

### Deploy API:

1. **Actions** → **Deploy API**
2. **Deployment stage**: `[New Stage]`
3. **Stage name**: `prod`
4. Click **Deploy**
5. **Note down the Invoke URL** (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)

---

## Step 6: Update Frontend Configuration

1. Open `config.js` file
2. Update these values:

```javascript
const CONFIG = {
    API_ENDPOINT: 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod',
    S3_BUCKET_NAME: 'your-job-applications-resumes',
    AWS_REGION: 'us-east-1'
};
```

Replace with your actual values:
- `API_ENDPOINT`: Your API Gateway Invoke URL from Step 5
- `S3_BUCKET_NAME`: Your resume storage bucket name from Step 2
- `AWS_REGION`: Your AWS region

---

## Step 7: Deploy Frontend to S3

1. Upload these files to your website S3 bucket:
   - `index.html`
   - `admin.html`
   - `styles.css`
   - `app.js`
   - `admin.js`
   - `config.js`

**Using AWS Console:**
- Go to S3 → Your website bucket → **Upload**
- Drag and drop all 6 files
- Click **Upload**

**Using AWS CLI:**
```bash
aws s3 cp index.html s3://your-job-application-website/
aws s3 cp admin.html s3://your-job-application-website/
aws s3 cp styles.css s3://your-job-application-website/
aws s3 cp app.js s3://your-job-application-website/
aws s3 cp admin.js s3://your-job-application-website/
aws s3 cp config.js s3://your-job-application-website/
```

---

## Step 8: Test Your Application

1. Open your S3 website endpoint in browser
2. Fill out the job application form
3. Upload a resume
4. Submit the application
5. Click "Admin Panel" button
6. Verify the application appears
7. Try updating the status
8. Try deleting an application

---

## Troubleshooting

### CORS Errors
- Ensure CORS is enabled on API Gateway for all methods
- Check S3 bucket CORS configuration
- Redeploy API after CORS changes

### Lambda Errors
- Check CloudWatch Logs for detailed error messages
- Verify environment variables are set correctly
- Ensure Lambda has proper IAM permissions

### File Upload Fails
- Check S3 bucket CORS settings
- Verify bucket name in config.js matches actual bucket
- Check Lambda environment variable for bucket name

### Applications Not Appearing
- Check DynamoDB table for data
- Verify API Gateway endpoints are correct
- Check browser console for errors

---

## Cost Estimation

With AWS Free Tier:
- DynamoDB: 25 GB storage, 200M requests/month FREE
- Lambda: 1M requests/month, 400,000 GB-seconds FREE
- S3: 5 GB storage, 20,000 GET, 2,000 PUT requests FREE
- API Gateway: 1M API calls/month FREE (12 months)

After free tier, expect $1-5/month for low traffic.

---

## Security Enhancements (Optional)

1. **Add Authentication**: Use AWS Cognito for admin panel
2. **Custom Domain**: Use Route 53 and CloudFront
3. **HTTPS**: CloudFront provides free SSL certificates
4. **Input Validation**: Add more validation in Lambda functions
5. **Rate Limiting**: Configure API Gateway throttling

---

## Next Steps

1. Customize the application positions and fields
2. Add email notifications using AWS SES
3. Implement search and filtering in admin panel
4. Add export functionality (CSV/Excel)
5. Set up CloudWatch alarms for monitoring

---

## Support

If you encounter issues:
1. Check CloudWatch Logs for Lambda functions
2. Verify all configuration values in config.js
3. Ensure all AWS resources are in the same region
4. Check IAM role permissions

---

**Congratulations!** Your serverless job application system is now live! 🎉
