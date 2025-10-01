# 🎭 Broedies Got Talent

A complete React + Firebase talent show app for Laerskool Broederstroom featuring real-time voting, trivia, and live audience interaction.

## ✨ Features

### 🎪 Admin Panel (`/admin`)
- **Act Management**: Add, edit, delete, and reorder talent show acts
- **Voting Control**: Start/stop voting for each act with real-time updates
- **Trivia Management**: Create and activate trivia questions between acts
- **Comment Moderation**: Approve or remove audience comments
- **Live Display**: Direct link to projector screen for live viewing

### 👥 Audience App (`/vote`)
- **Star Rating**: Rate performances 1-5 stars with beautiful animations
- **Comments & Emojis**: Share thoughts with text and emoji reactions
- **Live Trivia**: Participate in trivia questions between acts
- **Real-time Updates**: See live score updates and voting status
- **Mobile Optimized**: Touch-friendly interface for all devices

### 📺 Display Screen (`/display`)
- **Live Results**: Real-time average scores and vote counts
- **Floating Comments**: Animated audience comments and emojis
- **Trivia Results**: Live answer percentages and statistics
- **Full-screen Mode**: Optimized for projector/projection screen
- **Smooth Animations**: Framer Motion powered transitions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth + Firestore + Hosting)
- **Routing**: React Router v6
- **State Management**: React Context + Custom Hooks

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account (free Spark plan)
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd broedies-got-talent
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "broedies-got-talent"
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Copy your Firebase config

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your Firebase config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📱 Usage Guide

### For Administrators
1. **Login**: Use `/login` with admin credentials
2. **Add Acts**: Click "Add New Act" or "Add Sample Data"
3. **Activate Act**: Click "Activate" on an act to make it live
4. **Start Voting**: Click "Start Voting" to open audience voting
5. **Monitor Results**: Watch live updates in the admin panel
6. **Display View**: Click "Display View" for projector screen

### For Audience
1. **Visit**: Go to `/vote` on any device
2. **Rate**: Tap stars to rate the current performance (1-5)
3. **Comment**: Share thoughts with text and emojis
4. **Trivia**: Answer questions between acts
5. **Results**: See live scores and comments

### For Display/Projection
1. **Full Screen**: Open `/display` in full-screen mode
2. **Project**: Connect to projector or large screen
3. **Live Updates**: Watch real-time results and comments

## 🔥 Firebase Deployment

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase
```bash
firebase init
# Select: Hosting, Firestore
# Use existing project: broedies-got-talent
# Public directory: dist
# Single-page app: Yes
```

### 3. Build and Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## 🎨 Customization

### Colors and Theme
Edit `tailwind.config.js` to customize:
- Primary colors (indigo theme)
- Secondary colors (yellow theme)  
- Accent colors (pink theme)

### School Branding
Update in `src/pages/`:
- School name and logo
- Color scheme
- Contact information

### Sample Data
Modify `src/data/seedData.ts`:
- Default acts
- Trivia questions
- Emoji options

## 📊 Data Structure

### Acts Collection
```typescript
{
  id: string;           // Auto-generated (ACT001, ACT002...)
  name: string;         // Performance name
  grade: string;        // School grade
  description: string;  // Performance description
  order: number;        // Display order
  isActive: boolean;    // Currently performing
  isVotingOpen: boolean; // Voting status
  avgScore: number;     // Average rating
  votesCount: number;   // Total votes
  createdAt: Date;
  updatedAt: Date;
}
```

### Votes Collection
```typescript
{
  id: string;
  actId: string;        // Reference to act
  rating: number;       // 1-5 stars
  userId?: string;      // Optional user ID
  createdAt: Date;
}
```

### Comments Collection
```typescript
{
  id: string;
  actId: string;        // Reference to act
  text?: string;        // Comment text
  emoji?: string;       // Emoji reaction
  approved: boolean;    // Admin approval
  createdAt: Date;
}
```

### Trivia Collection
```typescript
{
  id: string;
  question: string;     // Trivia question
  options: string[];   // Answer options
  correctOption: number; // Index of correct answer
  isActive: boolean;    // Currently active
  results: Record<number, number>; // optionIndex: count
  createdAt: Date;
}
```

## 🔒 Security Rules

The app uses Firebase Security Rules to ensure:
- Public read access for all collections
- Authenticated write access for votes and comments
- Admin-only access for act and trivia management
- Vote immutability (cannot be modified once created)

## 🎯 Demo Credentials

For testing purposes:
- **Email**: admin@demo.com
- **Password**: password123

## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- Touch interactions
- Mobile voting
- Tablet displays
- Large projection screens

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Check `.env.local` file exists
   - Verify all environment variables are set
   - Ensure Firebase project is properly configured

2. **Authentication Issues**
   - Enable Email/Password auth in Firebase Console
   - Check Firestore security rules
   - Verify user permissions

3. **Real-time Updates Not Working**
   - Check Firestore rules allow read access
   - Verify Firebase project is active
   - Check browser console for errors

4. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript errors in console
   - Verify all imports are correct

### Support
For issues or questions:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test with sample data first
4. Check network connectivity

## 🎉 Features Highlights

- ⚡ **Real-time Updates**: Live voting results and comments
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 📱 **Mobile First**: Optimized for all device sizes
- 🔒 **Secure**: Firebase security rules and authentication
- 🚀 **Fast**: Vite build system and optimized performance
- 🎭 **School Ready**: Perfect for talent shows and events
- 📺 **Projector Ready**: Full-screen display mode
- 🎯 **Trivia System**: Interactive questions between acts
- 💬 **Social Features**: Comments and emoji reactions
- ⭐ **Rating System**: 1-5 star voting with animations

## 📄 License

This project is created for Laerskool Broederstroom. Feel free to adapt for your school!

---

**Built with ❤️ for Laerskool Broederstroom Talent Show**

