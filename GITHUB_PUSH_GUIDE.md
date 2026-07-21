# Push to GitHub - Step by Step Guide

Follow these steps to push your JobPrep project to GitHub.

---

## ✅ Pre-Push Checklist

Before pushing to GitHub, verify:

- [x] All files are present in the project
- [x] .gitignore is configured
- [x] config.js is excluded (sensitive data protected)
- [x] config.example.js is included (template for others)
- [x] README.md is complete
- [x] Documentation files are ready

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website

1. **Go to GitHub.com** and log in
2. **Click the "+" icon** (top right) → **"New repository"**
3. **Fill in details:**
   - **Repository name:** `jobprep-serverless-portal` (or your choice)
   - **Description:** "A serverless job application portal built with AWS Lambda, DynamoDB, S3, and API Gateway"
   - **Visibility:** Public or Private (your choice)
   - **⚠️ DO NOT initialize with README** (we already have one)
   - **⚠️ DO NOT add .gitignore** (we already have one)
   - **⚠️ DO NOT add license yet** (optional, can add later)
4. **Click "Create repository"**
5. **Copy the repository URL** (looks like: `https://github.com/username/jobprep-serverless-portal.git`)

---

## Step 2: Initialize Git in Your Project

Open **Command Prompt** or **PowerShell** in your project folder:

```cmd
cd C:\Users\ishra\Desktop\job_portal
```

### Initialize Git:

```cmd
git init
```

**Expected output:**
```
Initialized empty Git repository in C:/Users/ishra/Desktop/job_portal/.git/
```

---

## Step 3: Configure Git (First Time Only)

If this is your first time using Git, set your name and email:

```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual GitHub username and email.

---

## Step 4: Check What Will Be Committed

See what files will be included:

```cmd
git status
```

**Expected output:**
```
Untracked files:
  .gitignore
  README.md
  index.html
  admin.html
  styles.css
  app.js
  admin.js
  config.example.js
  ... (all other files EXCEPT config.js)
```

**✅ Verify:** `config.js` should NOT appear in the list (it's ignored)

**❌ If config.js appears:**
```cmd
git rm --cached config.js
```

---

## Step 5: Add All Files to Git

```cmd
git add .
```

This stages all files for commit (except those in .gitignore).

### Verify files are staged:

```cmd
git status
```

**Expected output:**
```
Changes to be committed:
  new file: .gitignore
  new file: README.md
  new file: index.html
  new file: admin.html
  ... (all files listed in green)
```

---

## Step 6: Create Your First Commit

```cmd
git commit -m "Initial commit: JobPrep serverless career portal"
```

**Expected output:**
```
[master (root-commit) abc1234] Initial commit: JobPrep serverless career portal
 XX files changed, XXXX insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 ...
```

---

## Step 7: Connect to GitHub Repository

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:

```cmd
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Example:**
```cmd
git remote add origin https://github.com/johndoe/jobprep-serverless-portal.git
```

### Verify remote is added:

```cmd
git remote -v
```

**Expected output:**
```
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (push)
```

---

## Step 8: Rename Branch to 'main' (GitHub Standard)

```cmd
git branch -M main
```

This renames your default branch from 'master' to 'main' (GitHub's current standard).

---

## Step 9: Push to GitHub

```cmd
git push -u origin main
```

**You may be prompted for GitHub credentials:**

### If using HTTPS (recommended):
- **Username:** Your GitHub username
- **Password:** Your GitHub **Personal Access Token** (NOT your regular password)

### Don't have a Personal Access Token?
1. Go to GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Select scopes: `repo` (full control)
5. Copy the token (you won't see it again!)
6. Use this token as your password

**Expected output:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XXX.XX KiB | XXX.XX MiB/s, done.
Total XX (delta X), reused X (delta X)
To https://github.com/YOUR_USERNAME/REPO_NAME.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## ✅ Step 10: Verify on GitHub

1. **Go to your GitHub repository URL**
2. **Refresh the page**
3. **You should see all your files!** ✨
4. **Check README.md is displayed** at the bottom of the page

---

## 📝 Files That Were Pushed:

✅ **Frontend Files:**
- index.html
- admin.html
- styles.css
- app.js
- admin.js

✅ **Backend Files (Lambda):**
- lambda-submit-application.js
- lambda-get-applications.js
- lambda-get-single-application.js
- lambda-update-application.js
- lambda-delete-application.js
- lambda-upload-resume.js

✅ **Configuration:**
- config.example.js (template)
- package.json

✅ **Documentation:**
- README.md
- DEPLOYMENT_GUIDE.md
- DEPLOYMENT_CHECKLIST.md
- LAMBDA_SETUP_CHECKLIST.md
- API_GATEWAY_SETUP_GUIDE.md
- ARCHITECTURE.md
- TROUBLESHOOTING.md
- QUICK_START.md

✅ **Git Files:**
- .gitignore

❌ **Files NOT Pushed (Protected):**
- config.js (contains your actual API URL and bucket name)
- .vscode/ (IDE settings)

---

## 🔄 Making Future Changes

### After editing files:

```cmd
# See what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Example workflow:
```cmd
# Made changes to styles.css
git add styles.css
git commit -m "Update color scheme to darker green"
git push
```

---

## 🎨 Add a Nice README Badge

Add this to the top of your README.md to show it's deployed:

```markdown
![Deployment](https://img.shields.io/badge/Deployed-AWS-orange?style=flat&logo=amazon-aws)
![Status](https://img.shields.io/badge/Status-Live-success)
```

---

## 📋 Quick Command Reference

| Command | Description |
|---------|-------------|
| `git status` | See what files changed |
| `git add .` | Stage all changes |
| `git add filename` | Stage specific file |
| `git commit -m "message"` | Commit with message |
| `git push` | Push to GitHub |
| `git pull` | Pull latest from GitHub |
| `git log` | See commit history |
| `git diff` | See what changed |

---

## 🐛 Troubleshooting

### ❌ Error: "fatal: not a git repository"
**Solution:**
```cmd
git init
```

### ❌ Error: "remote origin already exists"
**Solution:**
```cmd
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### ❌ Error: "failed to push some refs"
**Solution:**
```cmd
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### ❌ Error: "config.js is being tracked"
**Solution:**
```cmd
git rm --cached config.js
git commit -m "Remove config.js from tracking"
git push
```

### ❌ GitHub asks for username/password but rejects password
**Solution:** Use a **Personal Access Token** instead of your password
1. Generate at: github.com → Settings → Developer settings → Personal access tokens
2. Use token as password

---

## 📱 Optional: Add GitHub Topics

After pushing, add topics to your repository for discoverability:

1. Go to your repository on GitHub
2. Click **"About"** ⚙️ (gear icon)
3. Add topics:
   - `aws`
   - `lambda`
   - `dynamodb`
   - `s3`
   - `serverless`
   - `api-gateway`
   - `javascript`
   - `nodejs`
   - `career-portal`
   - `job-application`

---

## 🌟 Make Repository Look Professional

1. **Add a LICENSE file** (GitHub can generate one for you)
2. **Add repository description** in Settings
3. **Pin repository** to your profile
4. **Add website URL** in About section (your S3 website URL)

---

## ✅ Success Checklist

After pushing, verify:

- [ ] Repository is visible on GitHub
- [ ] README.md displays correctly
- [ ] All documentation files are present
- [ ] Lambda function files are included
- [ ] Frontend files are included
- [ ] config.js is NOT visible (protected)
- [ ] config.example.js IS visible (template)
- [ ] .gitignore is working
- [ ] Repository description is set
- [ ] Topics are added

---

## 🎉 Congratulations!

Your JobPrep project is now on GitHub! 🚀

**Next steps:**
1. Share the repository link
2. Add it to your portfolio
3. Include in your resume/LinkedIn
4. Consider making it public to showcase your skills

---

**Repository Structure:**
```
github.com/YOUR_USERNAME/jobprep-serverless-portal
├── 📄 README.md (detailed project info)
├── 🎨 Frontend files
├── ⚡ Lambda functions
├── 📚 Documentation
└── ⚙️ Configuration template
```

**Your GitHub repository link:**
```
https://github.com/YOUR_USERNAME/jobprep-serverless-portal
```

**Share this to showcase your AWS serverless skills!** ⭐
