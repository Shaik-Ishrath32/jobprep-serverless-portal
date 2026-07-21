# Lambda Functions Setup Checklist

Follow this checklist to create all 6 Lambda functions step by step.

---

## Prerequisites

- [ ] DynamoDB table created: `JobApplications` with partition key `id` (String)
- [ ] S3 bucket created: `myjobprep`
- [ ] IAM Role created with permissions for Lambda, DynamoDB, and S3

---

## Function 1: job-app-submit

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-submit`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-submit-application.js
- [ ] Click "Deploy" (orange button)
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `APPLICATIONS_TABLE`, Value = `JobApplications`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Function 2: job-app-get-all

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-get-all`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-get-applications.js
- [ ] Click "Deploy"
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `APPLICATIONS_TABLE`, Value = `JobApplications`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Function 3: job-app-get-one

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-get-one`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-get-single-application.js
- [ ] Click "Deploy"
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `APPLICATIONS_TABLE`, Value = `JobApplications`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Function 4: job-app-update

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-update`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-update-application.js
- [ ] Click "Deploy"
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `APPLICATIONS_TABLE`, Value = `JobApplications`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Function 5: job-app-delete

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-delete`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-delete-application.js
- [ ] Click "Deploy"
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `APPLICATIONS_TABLE`, Value = `JobApplications`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Function 6: job-app-upload-resume

- [ ] Go to Lambda Console → Click "Create function"
- [ ] Function name: `job-app-upload-resume`
- [ ] Runtime: Node.js 18.x
- [ ] Use existing IAM role
- [ ] Click "Create function"
- [ ] Delete all default code in editor
- [ ] Copy and paste code from lambda-upload-resume.js
- [ ] Click "Deploy"
- [ ] Go to Configuration → Environment variables → Edit
- [ ] Add: Key = `RESUME_BUCKET`, Value = `myjobprep`
- [ ] Click "Save"
- [ ] Go to Configuration → General configuration → Edit
- [ ] Change Timeout to 30 seconds
- [ ] Click "Save"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

## Summary

Total Functions Created: _____ / 6

---

## Common Settings for All Functions

| Setting | Value |
|---------|-------|
| Runtime | Node.js 18.x |
| Timeout | 30 seconds |
| IAM Role | (Your role with DynamoDB & S3 access) |

---

## Environment Variables Summary

| Function Name | Environment Variable | Value |
|--------------|---------------------|-------|
| job-app-submit | APPLICATIONS_TABLE | JobApplications |
| job-app-get-all | APPLICATIONS_TABLE | JobApplications |
| job-app-get-one | APPLICATIONS_TABLE | JobApplications |
| job-app-update | APPLICATIONS_TABLE | JobApplications |
| job-app-delete | APPLICATIONS_TABLE | JobApplications |
| job-app-upload-resume | RESUME_BUCKET | myjobprep |

---

## Next Steps After All Functions Are Created

- [ ] Create API Gateway
- [ ] Connect Lambda functions to API endpoints
- [ ] Enable CORS on all API methods
- [ ] Deploy API to "prod" stage
- [ ] Copy API Gateway URL
- [ ] Update config.js with API URL
- [ ] Upload frontend files to S3
- [ ] Test the application

---

## Need Help?

If you get stuck:
1. Check CloudWatch Logs for errors
2. Verify environment variables are correct
3. Ensure IAM role has proper permissions
4. Make sure you clicked "Deploy" after pasting code

---

**Good luck! Take your time and check each box as you complete it.** ✅
