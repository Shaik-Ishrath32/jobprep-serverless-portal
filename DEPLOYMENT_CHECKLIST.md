# AWS Serverless Job Application - Deployment Checklist

Use this checklist to ensure you've completed all deployment steps correctly.

## ☐ Step 1: DynamoDB Setup
- [ ] Created DynamoDB table named `JobApplications`
- [ ] Set partition key as `id` (String)
- [ ] Noted down table name and ARN

## ☐ Step 2: S3 Buckets Setup

### Resume Storage Bucket:
- [ ] Created S3 bucket for resumes (name: __________________)
- [ ] Disabled "Block all public access"
- [ ] Added CORS configuration
- [ ] Added bucket policy for public read access
- [ ] Noted bucket name: __________________

### Website Hosting Bucket:
- [ ] Created S3 bucket for website (name: __________________)
- [ ] Disabled "Block all public access"
- [ ] Enabled static website hosting
- [ ] Set index document to `index.html`
- [ ] Added bucket policy for public read access
- [ ] Noted website endpoint URL: __________________

## ☐ Step 3: IAM Role Setup
- [ ] Created IAM role named `JobApplicationLambdaRole`
- [ ] Attached `AWSLambdaBasicExecutionRole` policy
- [ ] Attached `AmazonDynamoDBFullAccess` policy
- [ ] Attached `AmazonS3FullAccess` policy
- [ ] Noted role ARN: __________________

## ☐ Step 4: Lambda Functions

Create 6 Lambda functions with Node.js 18.x runtime:

### Function 1: job-app-submit
- [ ] Created function
- [ ] Pasted code from `lambda-submit-application.js`
- [ ] Set environment variable: `APPLICATIONS_TABLE` = `JobApplications`
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

### Function 2: job-app-get-all
- [ ] Created function
- [ ] Pasted code from `lambda-get-applications.js`
- [ ] Set environment variable: `APPLICATIONS_TABLE` = `JobApplications`
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

### Function 3: job-app-get-one
- [ ] Created function
- [ ] Pasted code from `lambda-get-single-application.js`
- [ ] Set environment variable: `APPLICATIONS_TABLE` = `JobApplications`
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

### Function 4: job-app-update
- [ ] Created function
- [ ] Pasted code from `lambda-update-application.js`
- [ ] Set environment variable: `APPLICATIONS_TABLE` = `JobApplications`
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

### Function 5: job-app-delete
- [ ] Created function
- [ ] Pasted code from `lambda-delete-application.js`
- [ ] Set environment variable: `APPLICATIONS_TABLE` = `JobApplications`
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

### Function 6: job-app-upload-resume
- [ ] Created function
- [ ] Pasted code from `lambda-upload-resume.js`
- [ ] Set environment variable: `RESUME_BUCKET` = (your resume bucket name)
- [ ] Changed timeout to 30 seconds
- [ ] Clicked **Deploy**

## ☐ Step 5: API Gateway Setup

- [ ] Created REST API named `JobApplicationAPI`
- [ ] Set endpoint type to Regional

### API Resources and Methods:

- [ ] Created `/applications` resource
- [ ] Created POST method → linked to `job-app-submit`
- [ ] Created GET method → linked to `job-app-get-all`
- [ ] Created `/{id}` sub-resource under `/applications`
- [ ] Created GET method for `/{id}` → linked to `job-app-get-one`
- [ ] Created PUT method for `/{id}` → linked to `job-app-update`
- [ ] Created DELETE method for `/{id}` → linked to `job-app-delete`
- [ ] Created `/upload-resume` resource
- [ ] Created POST method → linked to `job-app-upload-resume`

### CORS Configuration:
- [ ] Enabled CORS for `/applications` (all methods)
- [ ] Enabled CORS for `/applications/{id}` (all methods)
- [ ] Enabled CORS for `/upload-resume` (POST)

### API Deployment:
- [ ] Deployed API to `prod` stage
- [ ] Noted Invoke URL: __________________

## ☐ Step 6: Update Frontend Configuration

- [ ] Opened `config.js` file
- [ ] Updated `API_ENDPOINT` with API Gateway Invoke URL
- [ ] Updated `S3_BUCKET_NAME` with resume bucket name
- [ ] Updated `AWS_REGION` with your region
- [ ] Saved the file

## ☐ Step 7: Deploy Frontend

Uploaded these 6 files to website S3 bucket:
- [ ] `index.html`
- [ ] `admin.html`
- [ ] `styles.css`
- [ ] `app.js`
- [ ] `admin.js`
- [ ] `config.js`

## ☐ Step 8: Testing

### Application Form:
- [ ] Opened website URL in browser
- [ ] Filled out job application form
- [ ] Uploaded a test resume
- [ ] Submitted successfully
- [ ] Saw success message

### DynamoDB Verification:
- [ ] Checked DynamoDB table
- [ ] Verified new item was created
- [ ] Confirmed all fields are populated

### S3 Resume Verification:
- [ ] Checked resume bucket
- [ ] Verified resume file was uploaded
- [ ] Confirmed file is accessible

### Admin Panel:
- [ ] Clicked "Admin Panel" button
- [ ] Saw list of applications
- [ ] Clicked "View" on an application
- [ ] Verified all details display correctly
- [ ] Updated application status successfully
- [ ] Tested search functionality
- [ ] Tested filter dropdowns
- [ ] Downloaded a resume
- [ ] Deleted a test application

## ☐ Final Verification

- [ ] All Lambda functions have no errors in CloudWatch Logs
- [ ] API Gateway returns proper responses (not 502/504 errors)
- [ ] No CORS errors in browser console
- [ ] Resume upload works without errors
- [ ] Admin panel loads and displays data
- [ ] All CRUD operations work (Create, Read, Update, Delete)

## 📋 Important Values to Save

Copy these values for future reference:

```
DynamoDB Table Name: JobApplications
DynamoDB ARN: _________________________________

Resume Bucket Name: _________________________________
Website Bucket Name: _________________________________
Website URL: _________________________________

IAM Role Name: JobApplicationLambdaRole
IAM Role ARN: _________________________________

Lambda Functions:
- job-app-submit
- job-app-get-all
- job-app-get-one
- job-app-update
- job-app-delete
- job-app-upload-resume

API Gateway Name: JobApplicationAPI
API Gateway ID: _________________________________
API Invoke URL: _________________________________
API Stage: prod

AWS Region: _________________________________
```

## 🎉 Deployment Complete!

Once all items are checked, your serverless job application system is fully operational!

### Next Steps:
1. Share the website URL with stakeholders
2. Monitor CloudWatch Logs for any issues
3. Set up CloudWatch alarms for Lambda errors
4. Consider adding authentication for admin panel
5. Customize branding and content as needed

### Cost Monitoring:
- Check AWS Billing Dashboard regularly
- Set up billing alerts
- Most of this should be covered by AWS Free Tier

---

**Need Help?** Refer to `DEPLOYMENT_GUIDE.md` for detailed instructions on each step.
