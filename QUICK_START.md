# Quick Start Guide - 15 Minutes to Deploy

This is a condensed version of the deployment guide for experienced AWS users.

## 🎯 What You'll Build

A serverless job application system where:
- Candidates submit applications with resume uploads
- Admins view, update, and delete applications
- Everything runs on AWS with zero servers to manage

## ⚡ Prerequisites

- AWS Account
- 15-20 minutes
- Basic AWS Console knowledge

## 🚀 Deployment Steps

### 1️⃣ DynamoDB (2 minutes)

```
Console → DynamoDB → Create Table
├─ Table name: JobApplications
├─ Partition key: id (String)
└─ Create
```

### 2️⃣ S3 Buckets (3 minutes)

**Bucket 1 - Resumes:**
```
Console → S3 → Create Bucket
├─ Name: your-resumes-bucket (globally unique)
├─ Uncheck "Block all public access"
├─ Permissions → CORS:
│   [{
│       "AllowedHeaders": ["*"],
│       "AllowedMethods": ["GET", "PUT", "POST"],
│       "AllowedOrigins": ["*"],
│       "ExposeHeaders": []
│   }]
└─ Permissions → Bucket Policy:
    {
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-resumes-bucket/*"
        }]
    }
```

**Bucket 2 - Website:**
```
Console → S3 → Create Bucket
├─ Name: your-website-bucket (globally unique)
├─ Uncheck "Block all public access"
├─ Properties → Static website hosting → Enable
│   ├─ Index: index.html
│   └─ Error: index.html
└─ Permissions → Bucket Policy: (same as above, change bucket name)
```

### 3️⃣ IAM Role (2 minutes)

```
Console → IAM → Roles → Create Role
├─ Service: Lambda
├─ Policies:
│   ├─ AWSLambdaBasicExecutionRole
│   ├─ AmazonDynamoDBFullAccess
│   └─ AmazonS3FullAccess
└─ Name: JobApplicationLambdaRole
```

### 4️⃣ Lambda Functions (5 minutes)

Create 6 functions with these settings:
- **Runtime:** Node.js 18.x
- **Role:** JobApplicationLambdaRole
- **Timeout:** 30 seconds

| Function Name | File to Copy | Env Variable |
|--------------|-------------|--------------|
| job-app-submit | lambda-submit-application.js | APPLICATIONS_TABLE=JobApplications |
| job-app-get-all | lambda-get-applications.js | APPLICATIONS_TABLE=JobApplications |
| job-app-get-one | lambda-get-single-application.js | APPLICATIONS_TABLE=JobApplications |
| job-app-update | lambda-update-application.js | APPLICATIONS_TABLE=JobApplications |
| job-app-delete | lambda-delete-application.js | APPLICATIONS_TABLE=JobApplications |
| job-app-upload-resume | lambda-upload-resume.js | RESUME_BUCKET=your-resumes-bucket |

**For each function:**
1. Create function
2. Copy code from file
3. Set environment variable
4. Configuration → General → Timeout = 30 seconds
5. Click Deploy

### 5️⃣ API Gateway (5 minutes)

```
Console → API Gateway → Create API → REST API → Build
├─ Name: JobApplicationAPI
└─ Create
```

**Create Resources & Methods:**

```
/ (root)
├─ /applications
│   ├─ POST → job-app-submit
│   ├─ GET → job-app-get-all
│   └─ /{id}
│       ├─ GET → job-app-get-one
│       ├─ PUT → job-app-update
│       └─ DELETE → job-app-delete
└─ /upload-resume
    └─ POST → job-app-upload-resume
```

**For each method:**
1. Create Method
2. Integration: Lambda Function
3. Select the function from table above
4. Save

**Enable CORS:**
1. Select each resource
2. Actions → Enable CORS
3. Enable CORS and replace

**Deploy:**
```
Actions → Deploy API
├─ Stage: [New Stage] prod
└─ Deploy
📝 Copy the Invoke URL
```

### 6️⃣ Configure Frontend (1 minute)

Edit **config.js**:

```javascript
const CONFIG = {
    API_ENDPOINT: 'YOUR_API_GATEWAY_URL',  // From step 5
    S3_BUCKET_NAME: 'your-resumes-bucket',  // From step 2
    AWS_REGION: 'us-east-1'  // Your region
};
```

### 7️⃣ Upload Frontend (1 minute)

Upload to your website S3 bucket:
- ✅ index.html
- ✅ admin.html
- ✅ styles.css
- ✅ app.js
- ✅ admin.js
- ✅ config.js

### 8️⃣ Test (1 minute)

```
1. Open: http://your-website-bucket.s3-website-region.amazonaws.com
2. Fill form → Upload resume → Submit
3. Click "Admin Panel"
4. Verify application appears
5. Test Update and Delete
```

## ✅ Done!

Your serverless job application system is live!

---

## 📊 Quick Reference

### Your Values:

```
DynamoDB Table: JobApplications
Resume Bucket: _________________________
Website Bucket: _________________________
Website URL: _________________________
IAM Role: JobApplicationLambdaRole
API Gateway URL: _________________________
Region: _________________________
```

### Lambda Functions:
- job-app-submit
- job-app-get-all
- job-app-get-one
- job-app-update
- job-app-delete
- job-app-upload-resume

### API Endpoints:
- POST /applications - Submit
- GET /applications - List all
- GET /applications/{id} - Get one
- PUT /applications/{id} - Update
- DELETE /applications/{id} - Delete
- POST /upload-resume - Get upload URL

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| CORS errors | Enable CORS on all API methods, then Deploy API |
| 500 errors | Check CloudWatch logs for Lambda errors |
| Upload fails | Check S3 CORS and bucket name in config.js |
| Admin empty | Verify API_ENDPOINT in config.js |
| 404 errors | Verify API is deployed to prod stage |

See **TROUBLESHOOTING.md** for detailed solutions.

---

## 📚 Full Documentation

- **DEPLOYMENT_GUIDE.md** - Detailed step-by-step instructions
- **README.md** - Project overview and features
- **ARCHITECTURE.md** - System design and data flow
- **TROUBLESHOOTING.md** - Common issues and solutions
- **DEPLOYMENT_CHECKLIST.md** - Interactive checklist

---

## 💰 Cost Estimate

**With AWS Free Tier:** FREE for first 12 months (up to limits)

**After Free Tier:**
- < 100 apps/month: ~$0.50/month
- < 500 apps/month: ~$2/month
- < 1000 apps/month: ~$5/month

---

## 🔒 Security Notes

Current setup is functional but basic. For production:

1. **Add Admin Authentication**
   - Use AWS Cognito
   - Protect admin.html

2. **Private Resumes**
   - Use presigned URLs for viewing
   - Remove public read access

3. **API Security**
   - Add API keys
   - Enable throttling
   - Add rate limiting

4. **Input Validation**
   - Server-side validation in Lambda
   - Sanitize all inputs

---

## 🎨 Customization

### Change Job Positions:

Edit **index.html** and **admin.html**:
```html
<select id="position">
    <option value="Your Position">Your Position</option>
    <!-- Add more here -->
</select>
```

### Change Styling:

Edit **styles.css** - change colors, fonts, layout

### Add Form Fields:

1. Add field in index.html
2. Update app.js to capture value
3. Update lambda-submit-application.js
4. Update admin.js to display value

---

## 📱 Access URLs

```
Application Form:
http://your-website-bucket.s3-website-region.amazonaws.com

Admin Panel:
http://your-website-bucket.s3-website-region.amazonaws.com/admin.html
```

---

## 🎯 Next Steps

1. ✅ Deploy the system (you just did!)
2. Test thoroughly with sample applications
3. Customize branding and positions
4. Add admin authentication (Cognito)
5. Set up CloudWatch alarms
6. Configure custom domain (optional)
7. Enable HTTPS with CloudFront (optional)

---

**Need Help?** Check the comprehensive guides in this repo!

**Questions?** Review TROUBLESHOOTING.md for common issues and solutions.

**Ready for Production?** Review ARCHITECTURE.md for security enhancements.

---

🎉 **Congratulations on deploying your serverless job application system!**
