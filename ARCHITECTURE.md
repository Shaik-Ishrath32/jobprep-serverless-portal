# System Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  Application Form    │      │    Admin Panel       │        │
│  │   (index.html)       │      │   (admin.html)       │        │
│  │                      │      │                      │        │
│  │  - Job Application   │      │  - View Apps         │        │
│  │  - Resume Upload     │      │  - Update Status     │        │
│  │  - Form Validation   │      │  - Delete Apps       │        │
│  └──────────────────────┘      └──────────────────────┘        │
│           │                              │                      │
└───────────┼──────────────────────────────┼──────────────────────┘
            │                              │
            │         ┌────────────────────┘
            │         │
            ▼         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    S3 STATIC WEBSITE HOSTING                    │
│                  (your-job-application-website)                 │
│                                                                 │
│  Files: index.html, admin.html, app.js, admin.js,              │
│         styles.css, config.js                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS Requests
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (REST API)                     │
│                      JobApplicationAPI                          │
├─────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                     │
│  • POST   /applications          → Submit Application          │
│  • GET    /applications          → Get All Applications        │
│  • GET    /applications/{id}     → Get Single Application      │
│  • PUT    /applications/{id}     → Update Application          │
│  • DELETE /applications/{id}     → Delete Application          │
│  • POST   /upload-resume         → Get S3 Presigned URL        │
└─────────────────────────────────────────────────────────────────┘
            │         │         │         │         │         │
            ▼         ▼         ▼         ▼         ▼         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA FUNCTIONS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │job-app-submit│  │job-app-get-  │  │job-app-get-  │         │
│  │              │  │     all      │  │     one      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │job-app-update│  │job-app-delete│  │job-app-upload│         │
│  │              │  │              │  │   -resume    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  Runtime: Node.js 18.x                                          │
│  Permissions: IAM Role (JobApplicationLambdaRole)               │
└─────────────────────────────────────────────────────────────────┘
            │                                        │
            │                                        │
            ▼                                        ▼
┌─────────────────────────────┐    ┌──────────────────────────────┐
│         DynamoDB            │    │     S3 RESUME STORAGE        │
│    (JobApplications)        │    │  (your-job-applications-     │
│                             │    │          resumes)            │
├─────────────────────────────┤    ├──────────────────────────────┤
│  Table Schema:              │    │  Files:                      │
│  • id (PK)                  │    │  • resumes/timestamp-name    │
│  • fullName                 │    │  • CORS enabled              │
│  • email                    │    │  • Public read access        │
│  • phone                    │    │  • Presigned URLs for upload │
│  • position                 │    │                              │
│  • experience               │    │  Max file size: 5MB          │
│  • education                │    │  Formats: PDF, DOC, DOCX     │
│  • skills                   │    │                              │
│  • resumeUrl                │    │                              │
│  • status                   │    │                              │
│  • appliedDate              │    │                              │
│  • ...more fields           │    │                              │
└─────────────────────────────┘    └──────────────────────────────┘
```

## Data Flow

### Application Submission Flow:

```
1. User fills form on index.html
       ↓
2. app.js validates input client-side
       ↓
3. User selects resume file
       ↓
4. POST /upload-resume → job-app-upload-resume Lambda
       ↓
5. Lambda generates S3 presigned URL
       ↓
6. app.js uploads file directly to S3 using presigned URL
       ↓
7. POST /applications → job-app-submit Lambda
       ↓
8. Lambda validates and saves to DynamoDB
       ↓
9. Success response to frontend
       ↓
10. Display success message to user
```

### Admin Panel View Flow:

```
1. User opens admin.html
       ↓
2. admin.js makes GET /applications
       ↓
3. API Gateway triggers job-app-get-all Lambda
       ↓
4. Lambda scans DynamoDB table
       ↓
5. Returns all applications
       ↓
6. admin.js displays in table format
       ↓
7. User can search/filter locally
```

### Admin Update Flow:

```
1. User clicks "View" on application
       ↓
2. GET /applications/{id} → job-app-get-one Lambda
       ↓
3. Lambda retrieves from DynamoDB
       ↓
4. Display in modal
       ↓
5. User updates status
       ↓
6. PUT /applications/{id} → job-app-update Lambda
       ↓
7. Lambda updates DynamoDB record
       ↓
8. Refresh admin panel
```

### Admin Delete Flow:

```
1. User clicks "Delete"
       ↓
2. Confirm dialog
       ↓
3. DELETE /applications/{id} → job-app-delete Lambda
       ↓
4. Lambda deletes from DynamoDB
       ↓
5. Refresh admin panel
```

## Security Architecture

### Current Security:

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Client-Side                                       │
│  • Form validation (HTML5 + JavaScript)                     │
│  • File type checking (PDF, DOC, DOCX only)                 │
│  • File size limit (5MB max)                                │
│                                                             │
│  Layer 2: API Gateway                                       │
│  • CORS configuration                                       │
│  • Request throttling (optional)                            │
│  • API key (optional - not implemented)                     │
│                                                             │
│  Layer 3: Lambda                                            │
│  • IAM role-based permissions                               │
│  • Input validation                                         │
│  • Required field checking                                  │
│                                                             │
│  Layer 4: AWS Services                                      │
│  • DynamoDB encryption at rest                              │
│  • S3 bucket policies                                       │
│  • CloudWatch logging                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### IAM Permissions:

```
JobApplicationLambdaRole
├── AWSLambdaBasicExecutionRole
│   └── Allows: CloudWatch Logs write
│
├── AmazonDynamoDBFullAccess
│   ├── PutItem (create application)
│   ├── GetItem (get single application)
│   ├── Scan (get all applications)
│   ├── UpdateItem (update status)
│   └── DeleteItem (delete application)
│
└── AmazonS3FullAccess
    ├── GetObject (read resumes)
    ├── PutObject (upload resumes)
    └── GeneratePresignedUrl (create upload URLs)
```

## Scalability

### Current Capacity:

- **API Gateway**: 10,000 requests/second
- **Lambda**: 1,000 concurrent executions per region
- **DynamoDB**: Auto-scaling enabled
- **S3**: Unlimited storage, high throughput

### Cost Scaling:

```
Free Tier (First 12 months):
├── Lambda: 1M requests/month FREE
├── DynamoDB: 25 GB + 200M requests/month FREE
├── S3: 5 GB storage + 20k GET + 2k PUT FREE
└── API Gateway: 1M calls/month FREE

Post Free Tier (Estimated):
├── 100 applications/month: ~$0.50/month
├── 500 applications/month: ~$2.00/month
└── 1000 applications/month: ~$5.00/month
```

## Monitoring & Logging

### CloudWatch Integration:

```
┌────────────────────────────────────────────────┐
│              CLOUDWATCH                        │
├────────────────────────────────────────────────┤
│                                                │
│  Lambda Logs:                                  │
│  • /aws/lambda/job-app-submit                  │
│  • /aws/lambda/job-app-get-all                 │
│  • /aws/lambda/job-app-get-one                 │
│  • /aws/lambda/job-app-update                  │
│  • /aws/lambda/job-app-delete                  │
│  • /aws/lambda/job-app-upload-resume           │
│                                                │
│  Metrics:                                      │
│  • Lambda invocations                          │
│  • Lambda errors                               │
│  • Lambda duration                             │
│  • API Gateway requests                        │
│  • API Gateway latency                         │
│  • DynamoDB read/write capacity                │
│                                                │
│  Alarms (Optional):                            │
│  • Lambda error rate > 5%                      │
│  • API Gateway 5xx errors                      │
│  • DynamoDB throttling                         │
│                                                │
└────────────────────────────────────────────────┘
```

## Future Enhancements

### Phase 1: Security
- [ ] Add AWS Cognito for admin authentication
- [ ] Implement API key requirement
- [ ] Add rate limiting per IP
- [ ] Enable S3 bucket encryption
- [ ] Use private S3 with presigned URLs for reading

### Phase 2: Features
- [ ] Email notifications (AWS SES)
- [ ] SMS notifications (AWS SNS)
- [ ] PDF generation for applications
- [ ] Bulk export to CSV/Excel
- [ ] Advanced search and filtering

### Phase 3: Performance
- [ ] CloudFront CDN for frontend
- [ ] DynamoDB Global Secondary Indexes
- [ ] Lambda function optimization
- [ ] Caching with API Gateway

### Phase 4: Enterprise
- [ ] Custom domain with Route 53
- [ ] Multi-language support
- [ ] Interview scheduling integration
- [ ] Automated screening with AI
- [ ] Integration with ATS systems

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML/CSS/JavaScript | User interface |
| Hosting | S3 Static Website | Serve frontend files |
| API | API Gateway | RESTful API endpoints |
| Backend | Lambda (Node.js) | Serverless functions |
| Database | DynamoDB | NoSQL data storage |
| File Storage | S3 | Resume file storage |
| Authentication | None (future: Cognito) | User management |
| Monitoring | CloudWatch | Logging and metrics |
| Permissions | IAM | Access control |

---

**This architecture is fully serverless, highly scalable, and cost-effective!**
