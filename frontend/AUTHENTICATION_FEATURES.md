# 🔐 Authentication Features

## ✅ Implemented Features

### 1. **Google Login Page**
- Professional login page with Google Sign-in button
- Displays before accessing the dashboard
- Includes Firebase setup instructions
- Error handling for failed login attempts
- Loading states during authentication

**Location**: `/login`

### 2. **Protected Routes**
- All dashboard pages require authentication
- Automatic redirect to login page if not authenticated
- Persists authentication state (stays logged in on refresh)
- Loading screen while checking authentication status

### 3. **User Profile Display**
- Shows user's **email** from Google account
- Shows editable **display name**
- Profile dropdown in top-right navbar
- Professional avatar icon with gradient background

### 4. **Edit Profile Feature**
- Click on profile dropdown → "Edit Profile"
- Modal dialog to edit display name
- Email display (read-only, from Google)
- Save/Cancel buttons
- Changes saved to localStorage

### 5. **Logout Functionality**
- "Logout" button in profile dropdown
- Properly signs out from Firebase
- Redirects to login page
- Clears user session

### 6. **Display Name Logic**
- **Priority 1**: Custom name set by user (editable)
- **Priority 2**: Google account display name
- **Priority 3**: Email username (before @)
- **Priority 4**: "User" as fallback

## 🎨 UI Components

### Login Page
```
- Centered card with glassmorphism
- Shield icon logo
- Google sign-in button with official branding
- Firebase setup instructions
- Error messages display
- Responsive design
```

### Navbar Profile Section
```
- User avatar (icon with gradient)
- Display name (editable)
- Email (from Google)
- Dropdown menu:
  ✏️ Edit Profile
  🚪 Logout
```

### Profile Edit Modal
```
- Modal overlay with backdrop blur
- Email field (read-only)
- Display name input (editable)
- Save/Cancel buttons
- Close button (X)
```

## 🔄 User Flow

1. **First Visit**
   ```
   User visits app
   → Not authenticated
   → Redirected to /login
   → Clicks "Sign in with Google"
   → Google OAuth popup
   → User selects account
   → Authenticated ✓
   → Redirected to / (Dashboard)
   ```

2. **Edit Profile**
   ```
   Click profile avatar/name
   → Dropdown appears
   → Click "Edit Profile"
   → Modal opens
   → Change display name
   → Click "Save Changes"
   → Name updated everywhere
   ```

3. **Logout**
   ```
   Click profile avatar/name
   → Dropdown appears
   → Click "Logout"
   → Signed out from Firebase
   → Redirected to /login
   ```

4. **Return Visit**
   ```
   User returns (browser refresh)
   → AuthContext checks Firebase auth state
   → User still authenticated ✓
   → Shows dashboard directly
   (No need to login again)
   ```

## 📂 File Structure

```
src/app/
├── lib/
│   └── firebase.ts                 # Firebase initialization
│
├── contexts/
│   └── AuthContext.tsx             # Global auth state
│                                   # - user
│                                   # - displayName
│                                   # - signInWithGoogle()
│                                   # - signOut()
│                                   # - setDisplayName()
│
├── components/
│   ├── ProtectedRoute.tsx          # Route wrapper for auth check
│   ├── ProfileModal.tsx            # Edit profile dialog
│   └── layout/
│       └── Navbar.tsx              # Updated with profile dropdown
│
├── pages/
│   └── Login.tsx                   # Google login page
│
└── routes.tsx                      # Protected route configuration
```

## 🔧 How It Works

### AuthContext
Central authentication state management using React Context:

```typescript
{
  user: User | null           // Firebase user object
  displayName: string         // User's display name
  loading: boolean           // Auth check in progress
  signInWithGoogle()         // Login function
  signOut()                  // Logout function
  setDisplayName(name)       // Update display name
}
```

### Protected Routes
Wraps authenticated pages:

```typescript
<ProtectedRoute>
  <MainLayout />
</ProtectedRoute>
```

If not authenticated → Redirect to `/login`  
If authenticated → Show content

### Display Name Storage
- Stored in **localStorage** with key: `displayName_{userId}`
- Persists across sessions
- Unique per user (if multiple users on same browser)
- Falls back to Google display name if not set

## 🚀 Setup Instructions

### For Development

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project

2. **Enable Google Authentication**
   - Authentication → Sign-in method
   - Enable Google provider

3. **Get Firebase Config**
   - Project Settings → General
   - Copy Firebase SDK config

4. **Add to `.env` File**
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

See `FIREBASE_SETUP.md` for detailed instructions.

## 🎯 Features by Location

### Login Page (`/login`)
- ✅ Google sign-in button
- ✅ Error handling
- ✅ Loading states
- ✅ Setup instructions
- ✅ Professional design

### Navbar (All Pages)
- ✅ User avatar
- ✅ Display name
- ✅ Email display
- ✅ Profile dropdown
- ✅ Edit profile option
- ✅ Logout option

### Profile Modal
- ✅ Edit display name
- ✅ View email (read-only)
- ✅ Save changes
- ✅ Close/Cancel
- ✅ Validation

## 🔒 Security

- ✅ Environment variables for credentials
- ✅ Firebase handles OAuth securely
- ✅ Protected routes prevent unauthorized access
- ✅ User session managed by Firebase
- ✅ No sensitive data in localStorage (only display name)

## 🎨 Customization Options

### Change Default Display Name
Edit `AuthContext.tsx` line 33:
```typescript
setDisplayNameState(savedName || user.displayName || "Your Default");
```

### Add More Profile Fields
Extend `ProfileModal.tsx` and add inputs for:
- Phone number
- Department
- Job title
- Bio

### Use Google Profile Photo
In `Navbar.tsx`, replace avatar icon:
```typescript
{user?.photoURL ? (
  <img src={user.photoURL} className="w-8 h-8 rounded-lg" />
) : (
  <User className="w-4 h-4 text-[#3B82F6]" />
)}
```

### Change Login Page Branding
Edit `Login.tsx` to customize:
- Logo
- Title
- Description
- Colors

## 📊 State Management

Authentication state is available app-wide via `useAuth()` hook:

```typescript
const { user, displayName, signInWithGoogle, signOut } = useAuth();

// Check if logged in
if (user) {
  // User is authenticated
}

// Get user email
const email = user?.email;

// Update display name
setDisplayName("New Name");
```

## ✨ Next Steps (Optional Enhancements)

1. **Email/Password Authentication**
   - Add email/password sign-in option
   - Password reset functionality

2. **Social Logins**
   - Add GitHub, Microsoft, Twitter authentication

3. **User Roles**
   - Admin, Investigator, Viewer roles
   - Role-based access control

4. **Profile Pictures**
   - Upload custom profile photos
   - Store in Firebase Storage

5. **Two-Factor Authentication**
   - Add 2FA for extra security

6. **User Settings**
   - Theme preferences
   - Notification settings
   - Language selection

---

🎉 **Authentication system is fully functional and ready to use!**

Just add your Firebase credentials and test the login flow.
