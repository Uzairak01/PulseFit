# ⚡ PulseFit | Daily Workout Tracker & Posture Guide

PulseFit is a premium, glassmorphic workout tracker and exercise form companion. Designed with a dark, high-contrast visual system and vibrant neon accents, PulseFit helps you log sets, track consecutive daily streaks, view detailed posture instruction guides, and visualize your progress over time.

It is designed to work **offline-first** using `LocalStorage`, with an built-in bridge to sync data to **Firebase Firestore** when configured.

---

## 🚀 Key Features

*   📊 **Interactive Dashboard**: View weekly activity metrics, total volume lifted, active minutes, and charts illustrating your daily/weekly fitness progression.
*   🔥 **Smart Streak Tracking**: Keep the momentum going. The application calculates your current and best streaks dynamically based on logs of completed sets.
*   🏋️ **Workout Logger**: Log exercises by adding sets, specifying reps, weights, or durations (for cardio/time-based movements), and checking them off as you complete them.
*   📖 **Comprehensive Exercise Directory**: Browse a curated library of movements categorized by target muscle groups (Chest, Back, Legs, Shoulders, Arms, Core, Cardio).
*   🧘 **Posture Form Guides**: Avoid injury with detailed instructions, execution cues, target muscle lists, and common mistakes to watch out for.
*   📅 **History & Progress Calendar**: Revisit your past workout logs chronologically to track consistency.
*   ☁️ **Firebase & Offline Hybrid Sync**: Dual-storage design. Works locally on your device by default and can sync to cloud firestore databases when enabled.

---

## 🛠️ Tech Stack

*   **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vite.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database & Auth**: [Firebase Firestore](https://firebase.google.com/) (Optional Sync)
*   **Styling**: Premium Vanilla CSS (features glassmorphism, responsive sidebar layout for desktop, and sticky bottom navigation bar for mobile devices).

---

## 📁 Project Structure

```text
tryingOutFirebase/
├── src/
│   ├── components/            # UI Views & Components
│   │   ├── Dashboard.tsx          # Progress charts, streak summary, recent workouts
│   │   ├── WorkoutLogger.tsx      # Set/rep/weight logging interface with save action
│   │   ├── HistoryView.tsx        # Calendar-based workout history log viewer
│   │   ├── ExerciseDirectory.tsx  # Categorized muscle group lists and search filters
│   │   └── ExerciseGuide.tsx      # Instructions, form cues, and common mistakes
│   ├── data/
│   │   └── exercises.ts           # Pre-loaded database of movements & posture info
│   ├── utils/
│   │   └── storage.ts             # Storage service coordinating LocalStorage and Firebase
│   ├── firebase.ts            # Firebase stubs, adapters, and environment toggles
│   ├── types.ts               # Shared TypeScript typings for Exercises, Logs, and Streaks
│   ├── App.tsx                # Main layout coordinator and sidebar/navigation
│   ├── main.tsx               # App entry point
│   ├── index.css              # Core design system tokens, CSS variables, and styling
│   └── App.css                # Global layout tweaks
```

---

## 💻 Getting Started

### Prerequisites

*   Node.js (v18.0.0 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository and navigate to the project directory:
    ```bash
    git clone <repository-url>
    cd tryingOutFirebase
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Enabling Firebase Sync

To transition from local-only storage to cloud database syncing:

1.  **Install Firebase SDK**:
    ```bash
    npm install firebase
    ```

2.  **Configure Firebase Settings**:
    Open [src/firebase.ts](file:///d:/me/Programming/Web/tryingOutFirebase/src/firebase.ts) and replace the configuration stub with your Firebase Web Project API details:
    ```typescript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

3.  **Uncomment Firestore Imports & Initializer**:
    In [src/firebase.ts](file:///d:/me/Programming/Web/tryingOutFirebase/src/firebase.ts), uncomment lines 9 to 26 to activate the Firebase SDK connection.

4.  **Activate Firebase Integration**:
    Change the `IS_FIREBASE_ENABLED` feature flag to `true`:
    ```typescript
    export const IS_FIREBASE_ENABLED = true;
    ```

When `IS_FIREBASE_ENABLED` is true, the `storageService` will automatically persist logs to LocalStorage first and then push updates asynchronously to Firestore, maintaining offline support with cross-device syncing.

---

## 📜 Build and Production

To build the application for hosting:

```bash
npm run build
```

This compiles TypeScript, checks ESLint guidelines, and builds static production assets into the `dist/` directory, ready to deploy to Firebase Hosting, Vercel, Netlify, or similar platforms.
