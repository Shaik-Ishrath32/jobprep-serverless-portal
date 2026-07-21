# API Gateway Setup Guide

Complete step-by-step instructions to create and configure API Gateway.

---

## Step 1: Create API Gateway

1. Go to **AWS Console** → Search for **"API Gateway"**
2. Click **"Create API"**
3. Choose **"REST API"** (NOT Private or HTTP API)
4. Click **"Build"** button
5. Configure:
   - **API name:** `JobApplicationAPI`
   - **Description:** Job Application Portal API
   - **Endpoint Type:** Regional
6. Click **"Create API"**

✅ **API Created!**

---

## Step 2: Create Resources and Methods

### Resource 1: /applications

#### Create the resource:
1. Click **"Actions"** dropdown → Select **"Create Resource"**
2. Fill in:
   - **Resource Name:** `applications`
   - **Resource Path:** `applications` (auto-filled)
   - ☑️ **Enable API Gateway CORS** (check this box)
3. Click **"Create Resource"**

#### Add POST method (Submit Application):
1. Select `/applications` resource (click on it)
2. Click **"Actions"** → **"Create Method"**
3. Select **"POST"** from dropdown → Click the checkmark ✓
4. Configure integration:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration** (check this)
   - **Lambda Region:** (your region, e.g., us-east-1)
   - **Lambda Function:** `job-app-submit`
5. Click **"Save"**
6. Click **"OK"** when prompted about permissions

#### Add GET method (Get All Applications):
1. Make sure `/applications` is selected
2. Click **"Actions"** → **"Create Method"**
3. Select **"GET"** from dropdown → Click checkmark ✓
4. Configure integration:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration**
   - **Lambda Function:** `job-app-get-all`
5. Click **"Save"**
6. Click **"OK"**

---

### Resource 2: /applications/{id}

#### Create the resource:
1. Select `/applications` (parent resource)
2. Click **"Actions"** → **"Create Resource"**
3. Fill in:
   - **Resource Name:** `{id}`
   - **Resource Path:** `{id}` (auto-filled)
   - ☑️ **Enable API Gateway CORS**
4. Click **"Create Resource"**

#### Add GET method (Get Single Application):
1. Select `/applications/{id}` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"GET"** → Click checkmark ✓
4. Configure:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration**
   - **Lambda Function:** `job-app-get-one`
5. Click **"Save"** → Click **"OK"**

#### Add PUT method (Update Application):
1. Make sure `/applications/{id}` is selected
2. Click **"Actions"** → **"Create Method"**
3. Select **"PUT"** → Click checkmark ✓
4. Configure:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration**
   - **Lambda Function:** `job-app-update`
5. Click **"Save"** → Click **"OK"**

#### Add DELETE method (Delete Application):
1. Make sure `/applications/{id}` is selected
2. Click **"Actions"** → **"Create Method"**
3. Select **"DELETE"** → Click checkmark ✓
4. Configure:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration**
   - **Lambda Function:** `job-app-delete`
5. Click **"Save"** → Click **"OK"**

---

### Resource 3: /upload-resume

#### Create the resource:
1. Click on **"/"** (root)
2. Click **"Actions"** → **"Create Resource"**
3. Fill in:
   - **Resource Name:** `upload-resume`
   - **Resource Path:** `upload-resume`
   - ☑️ **Enable API Gateway CORS**
4. Click **"Create Resource"**

#### Add POST method (Upload Resume):
1. Select `/upload-resume` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"POST"** → Click checkmark ✓
4. Configure:
   - **Integration type:** Lambda Function
   - ☑️ **Use Lambda Proxy integration**
   - **Lambda Function:** `job-app-upload-resume`
5. Click **"Save"** → Click **"OK"**

---

## Step 3: Enable CORS for All Resources

**Important:** Do this for EACH resource!

### For /applications:
1. Select `/applications` resource
2. Click **"Actions"** → **"Enable CORS"**
3. Keep all default settings
4. Click **"Enable CORS and replace existing CORS headers"**
5. Click **"Yes, replace existing values"**

### For /applications/{id}:
1. Select `/applications/{id}` resource
2. Click **"Actions"** → **"Enable CORS"**
3. Keep all default settings
4. Click **"Enable CORS and replace existing CORS headers"**
5. Click **"Yes, replace existing values"**

### For /upload-resume:
1. Select `/upload-resume` resource
2. Click **"Actions"** → **"Enable CORS"**
3. Keep all default settings
4. Click **"Enable CORS and replace existing CORS headers"**
5. Click **"Yes, replace existing values"**

✅ **CORS Enabled!**

---

## Step 4: Deploy API

1. Click **"Actions"** dropdown
2. Select **"Deploy API"**
3. Configure:
   - **Deployment stage:** `[New Stage]`
   - **Stage name:** `prod`
   - **Stage description:** Production
   - **Deployment description:** Initial deployment
4. Click **"Deploy"**

✅ **API Deployed!**

---

## Step 5: Get API Gateway URL

1. After deployment, you'll see the **Stages** page
2. Click on **"prod"** stage
3. At the top, you'll see **"Invoke URL"**
4. Copy this URL (it looks like: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`)

📝 **Your API Gateway URL:** 
```
_________________________________________________
```

---

## Step 6: Update config.js

1. Open your project folder
2. Open `config.js` file
3. Replace the API_ENDPOINT with your URL:

```javascript
const CONFIG = {
    API_ENDPOINT: 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod',
    S3_BUCKET_NAME: 'myjobprep',
    AWS_REGION: 'us-east-1',
    // ...
};
```

**Example:**
```javascript
const CONFIG = {
    API_ENDPOINT: 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod',
    S3_BUCKET_NAME: 'myjobprep',
    AWS_REGION: 'us-east-1',
    // ...
};
```

⚠️ **Important:** 
- No trailing slash at the end!
- Must start with `https://`
- Must end with `/prod`

---

## Step 7: Upload Frontend Files to S3

### Files to upload:
- ✅ index.html
- ✅ admin.html
- ✅ styles.css
- ✅ app.js
- ✅ admin.js
- ✅ config.js (UPDATED with your API URL)

### Upload steps:
1. Go to **S3 Console**
2. Click on your bucket: `myjobprep`
3. Click **"Upload"**
4. Click **"Add files"**
5. Select all 6 files listed above
6. Click **"Upload"**
7. Wait for upload to complete
8. Click **"Close"**

✅ **Frontend Uploaded!**

---

## Step 8: Test the Application

### Get your website URL:
1. Go to **S3** → Click your bucket `myjobprep`
2. Go to **Properties** tab
3. Scroll down to **"Static website hosting"**
4. Copy the **"Bucket website endpoint"** URL

📝 **Your Website URL:**
```
_________________________________________________
```

### Test the application:
1. Open the website URL in your browser
2. Fill out the job application form
3. Upload a test resume (PDF file)
4. Click **"Submit Application"**
5. You should see success message! ✅
6. Click **"Admin panel"** button
7. You should see your test application listed
8. Try updating the status
9. Try deleting the application

---

## API Structure Summary

Your API should look like this:

```
/
├── /applications
│   ├── POST → job-app-submit
│   ├── GET → job-app-get-all
│   └── /{id}
│       ├── GET → job-app-get-one
│       ├── PUT → job-app-update
│       └── DELETE → job-app-delete
└── /upload-resume
    └── POST → job-app-upload-resume
```

**Total Methods:** 6 methods across 3 resources

---

## Troubleshooting

### ❌ CORS Error
**Solution:**
1. Go back to API Gateway
2. Enable CORS on all resources again
3. Click **"Actions"** → **"Deploy API"** → Stage: `prod`
4. Clear browser cache and try again

### ❌ 502 Bad Gateway Error
**Solution:**
1. Check Lambda function logs in CloudWatch
2. Verify Lambda environment variables are set correctly
3. Ensure IAM role has proper permissions

### ❌ 404 Not Found Error
**Solution:**
1. Verify API is deployed to "prod" stage
2. Check API Gateway URL in config.js is correct
3. Make sure no trailing slash in URL

### ❌ Application not submitting
**Solution:**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

---

## Checklist

- [ ] API Gateway created
- [ ] /applications resource created with POST and GET methods
- [ ] /applications/{id} resource created with GET, PUT, DELETE methods
- [ ] /upload-resume resource created with POST method
- [ ] CORS enabled on all resources
- [ ] API deployed to "prod" stage
- [ ] API Gateway URL copied
- [ ] config.js updated with API URL
- [ ] All 6 frontend files uploaded to S3
- [ ] Application tested and working

---

## Next: Configure S3 Bucket for Website Hosting

If you haven't enabled static website hosting on your S3 bucket yet:

1. Go to S3 → `myjobprep` bucket
2. Click **"Properties"** tab
3. Scroll to **"Static website hosting"**
4. Click **"Edit"**
5. Select **"Enable"**
6. **Index document:** `index.html`
7. **Error document:** `index.html`
8. Click **"Save changes"**
9. Make sure bucket is public (Permissions → Block public access: ALL OFF)
10. Add bucket policy for public read access

---

**Congratulations! Your JobPrep application is now live!** 🎉

Your website URL: `http://myjobprep.s3-website-YOUR-REGION.amazonaws.com`
