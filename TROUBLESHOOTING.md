# Troubleshooting Guide

This guide covers common issues and their solutions when deploying and using the Job Application System.

---

## Table of Contents
1. [CORS Errors](#cors-errors)
2. [Lambda Function Errors](#lambda-function-errors)
3. [API Gateway Issues](#api-gateway-issues)
4. [File Upload Problems](#file-upload-problems)
5. [DynamoDB Issues](#dynamodb-issues)
6. [Frontend Not Loading](#frontend-not-loading)
7. [Admin Panel Issues](#admin-panel-issues)
8. [General Debugging Tips](#general-debugging-tips)

---

## CORS Errors

### ❌ Error: "Access to fetch has been blocked by CORS policy"

**Symptoms:**
- Browser console shows CORS error
- API requests fail with status 0
- Network tab shows "CORS error"

**Solutions:**

1. **Check API Gateway CORS Configuration:**
   ```
   - Go to API Gateway Console
   - Select your API
   - For each resource and method:
     - Click Actions → Enable CORS
     - Ensure these headers are present:
       - Access-Control-Allow-Origin: *
       - Access-Control-Allow-Headers: Content-Type
       - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
   - Click "Enable CORS and replace existing CORS headers"
   - IMPORTANT: Click Actions → Deploy API → Stage: prod
   ```

2. **Verify Lambda Function Headers:**
   - Open each Lambda function
   - Check that headers include:
   ```javascript
   const headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': 'Content-Type',
       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
   };
   ```

3. **Check S3 Bucket CORS (for resume upload):**
   ```
   - Go to S3 → Your resume bucket
   - Permissions → CORS
   - Should have:
   [
       {
           "AllowedHeaders": ["*"],
           "AllowedMethods": ["GET", "PUT", "POST"],
           "AllowedOrigins": ["*"],
           "ExposeHeaders": []
       }
   ]
   ```

4. **Always Redeploy After CORS Changes:**
   - API Gateway → Actions → Deploy API
   - Stage: prod
   - Click Deploy

---

## Lambda Function Errors

### ❌ Error: "Internal Server Error" (500)

**Check CloudWatch Logs:**
```
1. Go to CloudWatch → Logs
2. Find log group: /aws/lambda/[function-name]
3. Click latest log stream
4. Look for error messages
```

**Common Lambda Errors:**

#### 1. "Cannot read property 'X' of undefined"
**Cause:** Missing data in request
**Fix:**
- Check that frontend is sending all required fields
- Add validation in Lambda:
```javascript
if (!body.fieldName) {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required field' })
    };
}
```

#### 2. "Resource not found: Table"
**Cause:** Wrong DynamoDB table name
**Fix:**
- Go to Lambda → Configuration → Environment variables
- Ensure `APPLICATIONS_TABLE` = `JobApplications` (exact name from DynamoDB)

#### 3. "AccessDeniedException"
**Cause:** Lambda role lacks permissions
**Fix:**
- Go to IAM → Roles → JobApplicationLambdaRole
- Attach these policies:
  - AWSLambdaBasicExecutionRole
  - AmazonDynamoDBFullAccess
  - AmazonS3FullAccess

#### 4. "Task timed out after 3.00 seconds"
**Cause:** Default timeout too short
**Fix:**
- Go to Lambda → Configuration → General configuration
- Click Edit
- Set Timeout to 30 seconds
- Click Save

#### 5. "Cannot find module 'uuid'"
**Cause:** Missing dependency
**Fix for console deployment:**
- Cannot install npm packages directly in console
- Either use AWS CLI/SAM for deployment, or
- Replace uuid with timestamp:
```javascript
// Instead of: const { v4: uuidv4 } = require('uuid');
// Use:
const applicationId = Date.now().toString() + Math.random().toString(36);
```

---

## API Gateway Issues

### ❌ Error: API returns 502 Bad Gateway

**Symptoms:**
- API calls return 502 status
- Lambda function never executes

**Solutions:**

1. **Check Lambda Integration:**
   ```
   - API Gateway → Resources → Your method
   - Click on method → Integration Request
   - Verify Lambda function name is correct
   - Should show green checkmark
   ```

2. **Check Lambda Permissions:**
   ```
   - API Gateway needs permission to invoke Lambda
   - This is usually automatic, but if issues persist:
   - Lambda → Configuration → Permissions
   - Check Resource-based policy statements
   - Should show API Gateway permission
   ```

3. **Check Lambda Response Format:**
   ```javascript
   // Lambda MUST return this exact format:
   return {
       statusCode: 200,
       headers: { /* headers */ },
       body: JSON.stringify({ /* data */ })
   };
   ```

### ❌ Error: API returns 403 Forbidden

**Symptoms:**
- API calls blocked with 403
- Possible API key issue

**Solutions:**
- Check if API key is required (Settings → API Keys)
- If yes, either disable it or pass key in header
- For this project, API keys should NOT be required

### ❌ Error: API returns 404 Not Found

**Symptoms:**
- Endpoint not found

**Solutions:**

1. **Check API endpoint URL in config.js:**
   ```javascript
   // Should be:
   API_ENDPOINT: 'https://abc123.execute-api.us-east-1.amazonaws.com/prod'
   // NOT:
   API_ENDPOINT: 'https://abc123.execute-api.us-east-1.amazonaws.com/prod/'
   // (no trailing slash)
   ```

2. **Verify API is deployed:**
   ```
   - API Gateway → Stages → prod
   - Should show "Deployed" with date/time
   - If not, click Actions → Deploy API
   ```

3. **Check resource path:**
   ```
   - API Gateway → Resources
   - Verify paths match:
     - /applications
     - /applications/{id}
     - /upload-resume
   ```

---

## File Upload Problems

### ❌ Error: Resume upload fails

**Symptoms:**
- Upload button doesn't work
- "Failed to upload resume" error

**Solutions:**

1. **Check S3 Bucket Name:**
   ```javascript
   // In config.js:
   S3_BUCKET_NAME: 'your-actual-bucket-name'
   
   // In lambda-upload-resume.js:
   const BUCKET_NAME = process.env.RESUME_BUCKET || 'your-actual-bucket-name';
   ```

2. **Verify S3 Bucket CORS:**
   - See CORS section above

3. **Check File Size:**
   - Max 5MB enforced in frontend
   - Increase in app.js if needed:
   ```javascript
   if (resumeFile.size > 5 * 1024 * 1024) { // 5MB
   ```

4. **Check File Type:**
   ```html
   <!-- In index.html: -->
   <input type="file" accept=".pdf,.doc,.docx">
   ```

5. **Check Lambda Environment Variable:**
   ```
   - Lambda: job-app-upload-resume
   - Configuration → Environment variables
   - RESUME_BUCKET = your-resume-bucket-name
   ```

6. **Verify S3 Permissions:**
   ```
   - Lambda role must have S3 permissions
   - IAM → JobApplicationLambdaRole
   - Should have AmazonS3FullAccess policy
   ```

### ❌ Error: "Presigned URL expired"

**Cause:** Took too long to upload
**Fix:**
- Increase expiration in lambda-upload-resume.js:
```javascript
const params = {
    Expires: 300 // Change to 600 (10 minutes)
};
```

---

## DynamoDB Issues

### ❌ Error: "Cannot do operations on a non-existent table"

**Symptoms:**
- Lambda fails with table not found error

**Solutions:**

1. **Verify Table Exists:**
   ```
   - Go to DynamoDB Console
   - Check table "JobApplications" exists
   - Check you're in the correct region
   ```

2. **Check Lambda Environment Variable:**
   ```
   - All Lambda functions should have:
   - APPLICATIONS_TABLE = JobApplications
   ```

3. **Ensure Lambda and DynamoDB in Same Region:**
   ```
   - Lambda region must match DynamoDB region
   - Check region in top-right corner of AWS Console
   ```

### ❌ Error: No data showing in admin panel

**Symptoms:**
- Admin panel shows 0 applications
- But DynamoDB has data

**Solutions:**

1. **Check DynamoDB Item Structure:**
   ```
   - Go to DynamoDB → Tables → JobApplications
   - Click "Explore table items"
   - Verify items exist and have 'id' field
   ```

2. **Check Lambda Function:**
   ```
   - Test job-app-get-all function
   - Use test event: {}
   - Check response
   ```

3. **Check API Endpoint:**
   ```javascript
   // In config.js, verify:
   API_ENDPOINT: 'https://correct-id.execute-api.region.amazonaws.com/prod'
   ```

4. **Check Browser Console:**
   ```
   - Open Developer Tools (F12)
   - Console tab
   - Look for JavaScript errors
   ```

---

## Frontend Not Loading

### ❌ Error: Website shows 404 or Access Denied

**Symptoms:**
- S3 website URL returns error
- Cannot access index.html

**Solutions:**

1. **Verify Static Website Hosting is Enabled:**
   ```
   - S3 → Bucket → Properties
   - Static website hosting: Enabled
   - Index document: index.html
   ```

2. **Check Bucket Policy:**
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::your-bucket-name/*"
           }
       ]
   }
   ```

3. **Verify Files Were Uploaded:**
   ```
   - S3 → Bucket → Objects
   - Should see: index.html, admin.html, styles.css, etc.
   ```

4. **Check "Block Public Access" Settings:**
   ```
   - S3 → Bucket → Permissions
   - Block public access: All OFF
   ```

5. **Use Correct URL:**
   ```
   Correct: http://bucket-name.s3-website-region.amazonaws.com
   Wrong: https://bucket-name.s3.amazonaws.com
   ```

### ❌ Error: Styling not applied

**Symptoms:**
- Website loads but looks broken
- No colors or formatting

**Solutions:**

1. **Check styles.css was uploaded**
2. **Check file name is exactly "styles.css"**
3. **Check browser console for 404 errors**
4. **Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)**

---

## Admin Panel Issues

### ❌ Error: "Failed to load applications"

**Symptoms:**
- Admin panel shows error message
- Applications list is empty

**Solutions:**

1. **Check API Endpoint in config.js:**
   ```javascript
   API_ENDPOINT: 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod'
   ```

2. **Check Browser Console:**
   ```
   - Press F12
   - Look for errors
   - Check Network tab for failed requests
   ```

3. **Test API Directly:**
   ```
   - Open browser
   - Navigate to:
   https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/applications
   - Should return JSON with applications array
   ```

4. **Check Lambda Logs:**
   ```
   - CloudWatch → Logs
   - /aws/lambda/job-app-get-all
   - Look for errors
   ```

### ❌ Error: Cannot update or delete applications

**Symptoms:**
- View works, but Update/Delete fail

**Solutions:**

1. **Check API methods exist:**
   ```
   - API Gateway → Resources
   - /applications/{id} should have:
     - GET method
     - PUT method
     - DELETE method
   ```

2. **Verify Lambda functions are deployed:**
   ```
   - job-app-update
   - job-app-delete
   ```

3. **Check path parameters:**
   ```
   - API Gateway → Resources → /applications/{id}
   - Method Request → URL Path Parameters
   - Should have 'id' parameter
   ```

---

## General Debugging Tips

### Step-by-Step Debugging Process:

1. **Check Browser Console:**
   ```
   - Press F12
   - Console tab
   - Look for JavaScript errors
   - Network tab to see failed requests
   ```

2. **Check CloudWatch Logs:**
   ```
   - AWS Console → CloudWatch → Logs
   - Select Lambda function log group
   - Check for errors and stack traces
   ```

3. **Test Lambda Directly:**
   ```
   - Lambda Console → Select function
   - Click "Test" tab
   - Create test event
   - See direct response
   ```

4. **Test API Gateway Directly:**
   ```
   - Use browser or Postman
   - Make direct HTTP request
   - Check response status and body
   ```

5. **Verify Configuration:**
   ```
   - config.js values are correct
   - Lambda environment variables set
   - API deployed to correct stage
   ```

### Common Configuration Mistakes:

| Issue | Wrong | Correct |
|-------|-------|---------|
| API URL | Missing region | Include region in URL |
| API URL | Trailing slash | No trailing slash |
| Bucket name | Typo | Exact bucket name |
| Table name | Lowercase | Exact case match |
| Lambda timeout | 3 seconds | 30 seconds |
| CORS | Not deployed | Deploy after enable |

### Useful AWS CLI Commands:

```bash
# Test API endpoint
curl https://your-api-id.execute-api.region.amazonaws.com/prod/applications

# List S3 bucket contents
aws s3 ls s3://your-bucket-name/

# Sync local files to S3
aws s3 sync . s3://your-bucket-name/ --exclude "*.js" --exclude "*.md"

# View Lambda logs
aws logs tail /aws/lambda/job-app-submit --follow

# Test Lambda function
aws lambda invoke --function-name job-app-submit output.json
```

---

## Still Having Issues?

### Checklist Before Asking for Help:

- [ ] Checked browser console for errors
- [ ] Checked CloudWatch logs for Lambda errors
- [ ] Verified all configuration values in config.js
- [ ] Tested API endpoints directly
- [ ] Verified Lambda functions are deployed
- [ ] Verified API Gateway is deployed to prod stage
- [ ] Checked IAM role permissions
- [ ] Verified DynamoDB table exists and is accessible
- [ ] Checked S3 bucket permissions and CORS
- [ ] Cleared browser cache and tried again

### Information to Provide When Seeking Help:

1. Exact error message (screenshot or copy-paste)
2. Browser console errors
3. CloudWatch log excerpts
4. AWS region you're using
5. Steps you've already tried
6. Which component is failing (frontend, API, Lambda, etc.)

---

## Quick Reference: What to Check When...

### Application submission fails:
1. Browser console
2. CloudWatch logs for job-app-submit
3. DynamoDB table structure
4. API Gateway POST /applications method

### Resume upload fails:
1. S3 bucket CORS
2. CloudWatch logs for job-app-upload-resume
3. Lambda S3 permissions
4. Bucket name in config.js

### Admin panel empty:
1. DynamoDB has data
2. CloudWatch logs for job-app-get-all
3. API endpoint in config.js
4. Browser network tab

### Delete/Update fails:
1. API Gateway PUT/DELETE methods exist
2. CloudWatch logs for respective Lambda
3. DynamoDB permissions
4. Correct application ID being passed

---

**Remember:** 90% of issues are due to:
1. Incorrect configuration values
2. CORS not properly enabled/deployed
3. Missing Lambda environment variables
4. IAM permission issues

Always start with these four areas when troubleshooting!
