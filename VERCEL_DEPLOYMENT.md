# Deploying RiseWave Tech to Vercel

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free - sign up at [vercel.com](https://vercel.com))
- ✅ Your RiseWave Tech application code
- ✅ MongoDB Atlas connection string

---

## Step 1: Prepare Your Project for Deployment

### 1.1 Create .gitignore (if not exists)

Make sure `.env.local` is in your `.gitignore`:

```bash
# Navigate to project
cd C:\Users\luise\Documents\dev\risewave_tech\risewave-core

# Check if .gitignore exists
dir .gitignore
```

The `.gitignore` should already contain:

```
.env.local
node_modules
.next
```

### 1.2 Verify `package.json` Scripts

Your `package.json` should already have these scripts (check):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git Repository

```bash
# Navigate to your project
cd C:\Users\luise\Documents\dev\risewave_tech\risewave-core

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - RiseWave Tech E-commerce"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Name it: `risewave-tech`
4. **DO NOT** initialize with README (you already have code)
5. Click **"Create repository"**

### 2.3 Push to GitHub

GitHub will show you commands like this (use them):

```bash
git remote add origin https://github.com/YOUR_USERNAME/risewave-tech.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

---

## Step 3: Deploy on Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"risewave-tech"**
4. Click **"Import"**

### 3.3 Configure Project

Vercel will auto-detect Next.js. You should see:

- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `next build` ✅
- **Output Directory**: `.next` ✅

**Keep these defaults** - don't change them.

### 3.4 Add Environment Variables

This is **CRITICAL** - click **"Environment Variables"**:

Add these two variables:

| Name          | Value                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI` | `mongodb+srv://risewave_admin_user:R1s3M0ng0!2026@risewavecluster.7qzwdfm.mongodb.net/risewave?retryWrites=true&w=majority` |
| `JWT_SECRET`  | `4f8a9c2e1d7b6f3a8e5c9d2f7b4a6e8c1d3f5a7b9e2c4d6f8a1c3e5b7d9f2a4c`                                                          |

**For each variable:**

1. Enter the **Name**
2. Enter the **Value**
3. Select all environments: **Production**, **Preview**, **Development**
4. Click **"Add"**

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. You'll see a success screen with confetti! 🎉

---

## Step 4: Access Your Live Application

### Your URLs:

- **Production**: `https://risewave-tech.vercel.app`
- **Dashboard**: `https://vercel.com/YOUR_USERNAME/risewave-tech`

Click **"Visit"** to open your live app!

---

## Step 5: Seed Your Production Database

**IMPORTANT**: After first deployment, seed your database:

Visit: `https://risewave-tech.vercel.app/api/seed`

You should see:

```json
{
  "success": true,
  "message": "12 productos creados exitosamente",
  "count": 12
}
```

---

## Step 6: Test Your Live Application

1. **Homepage**: Check Cyber-Japandi design loads
2. **Register**: Create a new account
3. **Login**: Test authentication
4. **Catalog**: Verify products appear and filters work
5. **Cart**: Add items, check persistence
6. **Chatbot**: Test Risi bot
7. **Dashboard**: View user info

---

## Automatic Deployments

Now, every time you push to GitHub:

```bash
git add .
git commit -m "Updated feature X"
git push
```

Vercel will **automatically rebuild and redeploy** your app! 🚀

---

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel Dashboard
2. Click your project → **"Settings"**
3. **"Domains"** tab
4. Click **"Add"**
5. Enter: `www.risewave.tech` (or your domain)
6. Follow DNS configuration instructions

---

## Troubleshooting

### Build Failed?

**Check build logs** in Vercel dashboard:

- Look for error messages
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Import path issues

### Database Connection Error?

- Verify `MONGODB_URI` is correct in Vercel env variables
- Check MongoDB Atlas **Network Access**:
  - Go to MongoDB Atlas
  - **Network Access** → **Add IP Address**
  - Click **"Allow Access from Anywhere"** (for Vercel)
  - IP: `0.0.0.0/0`

### App is slow?

- First load might be slow (cold start)
- Subsequent loads will be fast
- Free tier has limitations

---

## Environment Variables Best Practices

### Never commit sensitive data:

❌ **DON'T**: Put secrets in code
✅ **DO**: Use Vercel environment variables

### To update environment variables:

1. Vercel Dashboard
2. Your project → **Settings**
3. **Environment Variables**
4. Edit or add new variables
5. **Redeploy** for changes to take effect

---

## Monitoring Your App

### Vercel Dashboard Shows:

- **Deployments**: History of all deploys
- **Analytics**: Page views, performance
- **Logs**: Runtime logs for debugging
- **Domains**: Manage custom domains

---

## Cost

- **Free Tier**: Perfect for this project
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Custom domains

---

## Quick Reference Commands

### Local Development

```bash
npm run dev
```

### Push Changes to Deploy

```bash
git add .
git commit -m "Your message"
git push
```

### View Logs

```bash
vercel logs
```

---

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Share the URL** with users/clients
3. **Set up analytics** (Vercel Analytics is free)
4. **Add custom domain** when ready
5. **Configure MercadoPago** for payments (when ready)

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **MongoDB Atlas**: Ensure IP whitelist includes Vercel

---

## Summary

✅ Push code to GitHub
✅ Import to Vercel
✅ Add environment variables
✅ Deploy
✅ Seed database
✅ Test live app

**Your app is now live at**: `https://risewave-tech.vercel.app`

🎉 **Congratulations!** Your RiseWave Tech E-commerce is now deployed!
