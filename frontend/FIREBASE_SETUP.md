# Firebase Google Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started** (if first time)
3. Go to **Sign-in method** tab
4. Click on **Google** in the providers list
5. Toggle **Enable**
6. Set project support email
7. Click **Save**

## Step 3: Register Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register app with a nickname (e.g., "Blockchain Evidence System")
5. Copy the Firebase configuration object

## Step 4: Add Firebase Config to Your Project

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Step 5: Configure Authorized Domains

1. In Firebase Console > Authentication > Settings
2. Under **Authorized domains**, add:
   - `localhost` (for development)
   - Your production domain (when deploying)

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Click "Sign in with Google"
4. Select your Google account
5. You should be redirected to the dashboard

## Features Implemented

### Login Page
- Google Sign-in button with official branding
- Error handling and loading states
- Firebase configuration instructions
- Responsive design with glassmorphism

### Authentication Flow
- Protected routes (redirects to login if not authenticated)
- Persistent authentication (stays logged in on refresh)
- Automatic redirect to dashboard after login

### User Profile
- Display user's email from Google account
- Editable display name (stored in localStorage)
- Profile dropdown in navbar with:
  - User name and email
  - Edit Profile option
  - Logout option

### Profile Edit Modal
- Edit display name
- View email (read-only)
- Save/Cancel actions
- Professional modal design

### Navbar Updates
- User avatar with initials
- Display name and email
- Dropdown menu
- Logout functionality
- Wallet connect (optional, can be used alongside authentication)

## File Structure

```
src/app/
├── lib/
│   └── firebase.ts              # Firebase initialization
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── components/
│   ├── ProtectedRoute.tsx       # Route protection
│   └── ProfileModal.tsx         # Edit profile modal
├── pages/
│   └── Login.tsx                # Login page
└── components/layout/
    └── Navbar.tsx               # Updated with profile dropdown
```

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Credentials are loaded from `.env`
3. **Firebase Security Rules** - Configure Firestore/Storage rules in Firebase Console
4. **API Key Restrictions** - Restrict API keys in Google Cloud Console (optional but recommended)

## Customization

### Change Display Name Default
Edit `AuthContext.tsx` line where `displayName` is set:
```typescript
setDisplayNameState(savedName || user.displayName || "Custom Default");
```

### Add More Profile Fields
Extend the profile modal and localStorage to store additional user information like:
- Phone number
- Department
- Role/Title

### Add Profile Picture
Integrate Google profile photo:
```typescript
user?.photoURL
```

## Troubleshooting

### "Auth domain not authorized"
- Add your domain to **Authorized domains** in Firebase Console

### "API key invalid"
- Double-check your `.env` file matches Firebase config
- Restart dev server after changing `.env`

### "Popup blocked"
- Enable popups for localhost in browser settings
- Or switch to redirect method in `firebase.ts`

### Display name not saving
- Check browser localStorage is enabled
- Open DevTools > Application > Local Storage

## Production Deployment

Before deploying to production:

1. Add production domain to Firebase Authorized domains
2. Update environment variables on hosting platform
3. Configure Firebase Security Rules
4. Enable only necessary authentication methods
5. Set up proper error logging

## Support

For issues with:
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
- **Google Auth**: [Authentication Docs](https://firebase.google.com/docs/auth)
- **This App**: Check browser console for errors
