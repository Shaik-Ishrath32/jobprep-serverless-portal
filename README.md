# JobPrep - Serverless Career Portal

A modern, serverless job application portal built with AWS services. This application allows candidates to apply for jobs online with resume uploads and provides administrators with a comprehensive dashboard to manage applications.

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)

## 🌟 Features

### For Candidates:
- ✅ Clean, modern job application form
- ✅ Resume upload functionality (PDF, DOC, DOCX)
- ✅ Multiple job position options
- ✅ LinkedIn profile integration
- ✅ Mobile-responsive design
- ✅ Real-time form validation
- ✅ Success/error notifications

### For Administrators:
- ✅ View all job applications
- ✅ Search and filter capabilities
- ✅ Update application status
- ✅ Delete applications
- ✅ View detailed candidate information
- ✅ Download resumes
- ✅ Real-time statistics dashboard
- ✅ Status tracking (New, Under Review, Interview Scheduled, etc.)

## 🏗️ Architecture

```
Frontend (S3 Static Website)
    ↓
API Gateway (REST API)
    ↓
Lambda Functions (Node.js)
    ↓
DynamoDB (Applications Data) + S3 (Resume Storage)
```

### AWS Services Used:
- **S3**: Static website hosting + resume file storage
- **Lambda**: Serverless backend functions (Node.js 18.x)
- **DynamoDB**: NoSQL database for application data
- **API Gateway**: RESTful API endpoints
- **IAM**: Access management and permissions
- **CloudWatch**: Logging and monitoring

## 📁 Project Structure

```
job_portal/
├── index.html                          # Main application form
├── admin.html                          # Admin dashboard
├── styles.css                          # Styling (light green theme)
├── app.js                             # Application form logic
├── admin.js                           # Admin panel logic
├── config.js                          # AWS configuration
├── lambda-submit-application.js        # Lambda: Submit application
├── lambda-get-applications.js          # Lambda: Get all applications
├── lambda-get-single-application.js    # Lambda: Get one application
├── lambda-update-application.js        # Lambda: Update application
├── lambda-delete-application.js        # Lambda: Delete application
├── lambda-upload-resume.js             # Lambda: Resume upload handler
├── package.json                        # Project metadata
├── .gitignore                         # Git ignore rules
├── README.md                          # This file
├── DEPLOYMENT_GUIDE.md                # Detailed deployment instructions
├── DEPLOYMENT_CHECKLIST.md            # Step-by-step checklist
├── LAMBDA_SETUP_CHECKLIST.md          # Lambda setup guide
├── API_GATEWAY_SETUP_GUIDE.md         # API Gateway configuration
├── ARCHITECTURE.md                    # System architecture details
├── TROUBLESHOOTING.md                 # Common issues and solutions
└── QUICK_START.md                     # Quick deployment guide
```

## 🚀 Quick Start

### Prerequisites
- AWS Account
- Basic knowledge of AWS Console
- Modern web browser

### Deployment Steps

1. **Create DynamoDB Table**
   - Table name: `JobApplications`
   - Partition key: `id` (String)

2. **Create S3 Bucket**
   - Bucket name: Your choice (e.g., `myjobprep`)
   - Enable static website hosting
   - Configure bucket policy for public access
   - Set up CORS for resume uploads

3. **Create IAM Role**
   - Role name: `JobApplicationLambdaRole`
   - Attach policies:
     - AWSLambdaBasicExecutionRole
     - AmazonDynamoDBFullAccess
     - AmazonS3FullAccess

4. **Deploy Lambda Functions** (6 functions)
   - Runtime: Node.js 18.x
   - Timeout: 30 seconds
   - Set environment variables
   - See `LAMBDA_SETUP_CHECKLIST.md` for details

5. **Create API Gateway**
   - Type: REST API
   - Create resources and methods
   - Enable CORS
   - Deploy to `prod` stage
   - See `API_GATEWAY_SETUP_GUIDE.md` for details

6. **Update Configuration**
   - Edit `config.js` with your API Gateway URL
   - Update S3 bucket name
   - Set AWS region

7. **Upload Frontend**
   - Upload all frontend files to S3 bucket
   - Files: index.html, admin.html, styles.css, app.js, admin.js, config.js

8. **Test**
   - Access your S3 website endpoint
   - Submit a test application
   - Verify admin panel functionality

📚 **For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

## 📊 Data Schema

### DynamoDB Table: JobApplications

| Field | Type | Description |
|-------|------|-------------|
| id | String (PK) | Unique application ID |
| fullName | String | Candidate's full name |
| email | String | Contact email |
| phone | String | Contact phone number |
| position | String | Applied position |
| experience | Number | Years of experience |
| education | String | Highest education level |
| skills | String | Comma-separated skills |
| linkedin | String | LinkedIn profile URL |
| resumeUrl | String | S3 URL to resume file |
| status | String | Application status |
| appliedDate | String | ISO date string |
| createdAt | String | ISO date string |
| updatedAt | String | ISO date string |

### Application Status Values:
- `New` - Recently submitted
- `Under Review` - Being reviewed by HR
- `Interview Scheduled` - Interview arranged
- `Rejected` - Not selected
- `Accepted` - Offer extended

## 🔧 Configuration

### config.js
```javascript
const CONFIG = {
    API_ENDPOINT: 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod',
    S3_BUCKET_NAME: 'your-bucket-name',
    AWS_REGION: 'us-east-1',
    ENDPOINTS: {
        SUBMIT_APPLICATION: '/applications',
        GET_APPLICATIONS: '/applications',
        GET_APPLICATION: '/applications/{id}',
        UPDATE_APPLICATION: '/applications/{id}',
        DELETE_APPLICATION: '/applications/{id}',
        UPLOAD_RESUME: '/upload-resume'
    }
};
```

## 🎨 Design

- **Theme**: Light green/teal color scheme
- **Background**: Animated gradient (mint → teal → sky blue)
- **UI Components**: Modern cards with glassmorphism effects
- **Responsive**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions and floating particles

## 📝 API Endpoints

| Method | Endpoint | Lambda Function | Description |
|--------|----------|----------------|-------------|
| POST | /applications | job-app-submit | Submit new application |
| GET | /applications | job-app-get-all | Get all applications |
| GET | /applications/{id} | job-app-get-one | Get single application |
| PUT | /applications/{id} | job-app-update | Update application status |
| DELETE | /applications/{id} | job-app-delete | Delete application |
| POST | /upload-resume | job-app-upload-resume | Get S3 presigned URL |

## 🔒 Security Considerations

### Current Implementation:
- Public access to application form (intended)
- Public read access to resumes (for viewing)
- No authentication on admin panel (development mode)

### Recommended for Production:
1. **Add Authentication**: Implement AWS Cognito for admin panel
2. **API Security**: Add API keys or AWS IAM authorization
3. **Rate Limiting**: Configure throttling in API Gateway
4. **Input Validation**: Enhanced server-side validation in Lambda
5. **Encryption**: Enable S3 bucket encryption at rest
6. **Private Resumes**: Use presigned URLs instead of public access
7. **HTTPS**: Use CloudFront with custom domain and SSL certificate

## 💰 Cost Estimation

### AWS Free Tier (First 12 months):
- Lambda: 1M requests/month FREE
- DynamoDB: 25 GB storage + 200M requests/month FREE
- S3: 5 GB storage + 20,000 GET + 2,000 PUT FREE
- API Gateway: 1M requests/month FREE

### After Free Tier:
- Expected: $1-5/month for low traffic (< 1000 applications/month)
- Lambda: ~$0.20 per 1M requests
- DynamoDB: ~$0.25 per GB/month
- S3: ~$0.023 per GB/month
- API Gateway: ~$3.50 per million requests

## 🧪 Testing

### Test Application Submission:
1. Fill out all required fields
2. Upload a sample resume (PDF/DOC/DOCX)
3. Submit and verify success message
4. Check DynamoDB for new entry
5. Verify resume uploaded to S3

### Test Admin Panel:
1. Open admin.html
2. Verify applications are listed
3. Click "View" on an application
4. Update the status
5. Test search and filters
6. Delete a test application

## 🐛 Troubleshooting

### Common Issues:

**"Failed to submit application"**
- Check API Gateway URL in config.js
- Verify Lambda functions are deployed
- Check CloudWatch logs for errors

**CORS Errors**
- Enable CORS on all API Gateway methods
- Redeploy API after enabling CORS
- Check S3 bucket CORS configuration

**Resume upload fails**
- Verify S3 bucket CORS settings
- Check Lambda environment variable `RESUME_BUCKET`
- Ensure Lambda has S3 permissions

**Admin panel shows no applications**
- Verify API endpoint is correct
- Check DynamoDB table has data
- Open browser console for errors

📚 **For more troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

## 🔄 Updates and Maintenance

### Updating Lambda Functions:
1. Edit code in Lambda console or locally
2. Click "Deploy" in Lambda console
3. Test the changes

### Updating Frontend:
1. Edit HTML/CSS/JS files locally
2. Re-upload to S3 bucket
3. Clear browser cache or use Ctrl+F5

### Database Maintenance:
- DynamoDB auto-scales, minimal maintenance required
- Consider enabling Point-in-Time Recovery for backups
- Monitor table metrics in CloudWatch

## 📚 Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## 🤝 Contributing

This is a learning project. Feel free to:
1. Fork the repository
2. Make improvements
3. Share your enhancements
4. Report issues

## 📄 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

Built as a serverless portfolio project demonstrating AWS cloud architecture skills.

### Technologies Mastered:
- ☁️ AWS Cloud Architecture
- 🔧 Serverless Computing (Lambda)
- 📦 NoSQL Databases (DynamoDB)
- 🌐 API Design (REST, API Gateway)
- 💾 Object Storage (S3)
- 🎨 Frontend Development (HTML/CSS/JS)
- 🔐 IAM and Security Best Practices

---

**⭐ If you found this project helpful, please give it a star!**

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review troubleshooting guide
3. Check AWS CloudWatch logs
4. Verify all configuration values

---

**Built with ❤️ using AWS Serverless Architecture**

**Live Demo:** [Your S3 Website URL]
