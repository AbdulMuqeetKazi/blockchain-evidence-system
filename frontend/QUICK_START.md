# 🚀 Quick Start Guide - Firebase Authentication

## What Was Added

✅ **Google Login Page** - Beautiful login screen with Google authentication  
✅ **Protected Routes** - Dashboard requires authentication  
✅ **User Profile** - Shows email and editable display name  
✅ **Edit Profile** - Modal to change display name  
✅ **Logout** - Sign out functionality  
✅ **Persistent Login** - Stay logged in across sessions  

## 🎯 How to Test (2 Options)

### Option A: Quick Demo (No Firebase Setup)
The app will load but you need Firebase credentials to actually login.

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **You'll see the login page** at `http://localhost:5173`

3. **To actually login**, you need Firebase credentials (see Option B)

### Option B: Full Setup with Firebase (5 minutes)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it: "Blockchain Evidence System"
4. Disable Google Analytics (optional)
5. Click **"Create project"**

#### Step 2: Enable Google Sign-In
1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle **"Enable"**
6. Choose a support email
7. Click **"Save"**

#### Step 3: Get Your Firebase Config
1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **Web icon** (`</>`)
5. Register app nickname: "Web App"
6. Click **"Register app"**
7. **Copy** the config object

#### Step 4: Add Config to `.env`
1. Open the `.env` file in project root
2. Replace the values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxx
```

#### Step 5: Restart & Test
1. **Restart** the dev server:
   ```bash
   npm run dev
   ```

2. **Open** `http://localhost:5173`

3. **Click** "Sign in with Google"

4. **Select** your Google account

5. **Success!** You should see the dashboard

## 🎮 How to Use

### Login
- Visit the app → Login page appears
- Click "Sign in with Google"
- Choose your Google account
- Redirected to dashboard

### View Profile
- Click on your **name/avatar** in top-right navbar
- Dropdown shows your email and name

### Edit Display Name
1. Click your **name/avatar**
2. Click **"Edit Profile"**
3. Change the display name
4. Click **"Save Changes"**
5. Your name updates everywhere

### Logout
1. Click your **name/avatar**
2. Click **"Logout"**
3. Redirected to login page

## 📁 Important Files

```
.env                        # Your Firebase credentials (KEEP SECRET!)
.env.example               # Template for .env file

FIREBASE_SETUP.md          # Detailed Firebase setup guide
AUTHENTICATION_FEATURES.md  # Complete feature documentation

src/app/
├── lib/firebase.ts        # Firebase configuration
├── contexts/AuthContext.tsx  # Authentication state
├── pages/Login.tsx        # Login page
├── components/
│   ├── ProtectedRoute.tsx # Route protection
│   └── ProfileModal.tsx   # Edit profile dialog
```

## 🔒 Security Notes

- ✅ `.env` file is in `.gitignore` (not committed to git)
- ✅ Firebase handles all OAuth securely
- ✅ Only authenticated users can access dashboard
- ✅ User sessions are managed by Firebase

## 🎨 What You'll See

### Login Page
- Clean design with shield logo
- "Sign in with Google" button with official branding
- Firebase setup instructions
- Error messages if login fails

### Navbar (After Login)
- **Left**: Blockchain Evidence System logo
- **Right**: 
  - Wallet Connect button (optional)
  - User profile dropdown showing:
    - Your name (editable)
    - Your email (from Google)
    - Edit Profile button
    - Logout button

### Profile Modal
- Email (read-only, from Google)
- Display name (editable)
- Save/Cancel buttons

## ❓ Troubleshooting

### "Missing opening {" error in console
- This was a CSS syntax error - already fixed!

### Login button doesn't work
- Check if you added Firebase credentials to `.env`
- Restart the dev server after changing `.env`
- Check browser console for errors

### "Auth domain not authorized"
- In Firebase Console → Authentication → Settings
- Add `localhost` to "Authorized domains"

### Display name not saving
- Check if localStorage is enabled in your browser
- Try in an incognito window to test

### Popup blocked
- Allow popups for localhost in browser settings
- Or click the popup icon in address bar

## 🎯 Next Steps

1. **Test the login flow** with your Google account
2. **Edit your profile** to see name changes
3. **Try logout** and login again
4. **Explore the dashboard** - all 6 pages are protected

## 📚 Additional Documentation

- `FIREBASE_SETUP.md` - Step-by-step Firebase setup
- `AUTHENTICATION_FEATURES.md` - Complete feature list
- `PROJECT_OVERVIEW.md` - App architecture
- `FEATURES.md` - All app features

## 💡 Tips

- **Development**: Use your personal Google account
- **Production**: Create separate Firebase project
- **Team**: Each team member can use their own Google account
- **Display Name**: Can be different from Google account name

---

🎉 **You're all set!** Just add Firebase credentials and start testing.

Need help? Check the detailed guides in `FIREBASE_SETUP.md`
