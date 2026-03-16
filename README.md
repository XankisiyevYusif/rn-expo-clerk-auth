# Mystica — AI-Powered Fortune Telling & Astrology App

## Overview

Mystica is a mystical mobile application built using **React Native (Expo)** and **Firebase**.
The app provides AI-powered fortune readings (coffee, tarot, palm reading, dream interpretation) combined with personalized astrology features such as birth charts, compatibility analysis, and daily horoscopes.

The design focuses on a **dark cosmic aesthetic**, smooth animations, and scalable architecture suitable for thousands of users.

---

# Tech Stack

| Layer                  | Technology                             |
| ---------------------- | -------------------------------------- |
| Mobile Framework       | React Native + Expo (TypeScript)       |
| Navigation             | React Navigation (Stack + Bottom Tabs) |
| State Management       | Zustand                                |
| Authentication         | Clerk                                  |
| Backend Database       | Firebase Firestore                     |
| Storage                | Firebase Storage                       |
| AI Engine              | OpenAI GPT-4o                          |
| Astrology Calculations | Swiss Ephemeris / AstrologyAPI         |
| City Search            | Open-Meteo Geocoding API               |
| Scaling                | react-native-size-matters              |
| UI Effects             | expo-linear-gradient, expo-blur        |
| Icons                  | @expo/vector-icons                     |
| Notifications          | Firebase Cloud Messaging               |
| Payments               | RevenueCat                             |

---

# Architecture

Mobile App (Expo)
│
│ Authentication
▼
Clerk

```
    │  
    │ User Identity (JWT / Clerk User ID)  
    ▼  
```

Firebase

```
    │  
    │ Database  
    ▼  
```

Firestore

```
    │  
    │ AI Requests  
    ▼  
```

Secure Backend / Firebase Functions

```
    │  
    ▼  
```

OpenAI GPT-4o

IMPORTANT
OpenAI API keys must **never** be used directly in the mobile app.
All AI requests must go through a **secure backend endpoint or Firebase Cloud Function**.

---

# Design System

## Colors

Background: #0A0A0F
Card Background: #12121A
Primary: #7311d4
Primary Light: #9333EA
Highlight: #C084FC
Accent Pink: #d4119d
Gold: #F59E0B

Text Primary: #F1F0FF
Text Muted: rgba(148,163,184,0.7)

---

## Gradients

Primary Button
['#7311d4', '#9d50bb']

Title Gradient
['#7311d4', '#d411b4']

Background
['#0A0A0F', '#0F0A1A', '#0A0A0F']

---

## Typography

Headings

* serif font
* bold
* white or violet color

Body Text

* system font
* soft white color

Labels

* uppercase
* letterSpacing: 2

---

# UI Components

Glass Card

* BlurView
* dark translucent background
* subtle border

Buttons

* LinearGradient background
* height 54
* borderRadius 14

Inputs

* glass style input
* purple focus border

Back Button

* circular BlurView
* soft purple glow

---

# Project Structure

```
mystica
│
├── App.tsx
├── app.json
│
├── src
│
│   ├── screens
│   │   ├── SplashScreen.tsx
│   │   ├── EmailSignupScreen.tsx
│   │   ├── OnboardingDetailsScreen.tsx
│   │   ├── OnboardingInterestsScreen.tsx
│   │   ├── OnboardingNotificationsScreen.tsx
│   │
│   │   ├── HomeScreen.tsx
│   │   ├── CoffeeReadingScreen.tsx
│   │   ├── TarotScreen.tsx
│   │   ├── PalmReadingScreen.tsx
│   │   ├── DreamScreen.tsx
│   │   ├── NumerologyScreen.tsx
│   │   ├── BirthChartScreen.tsx
│   │   ├── CompatibilityScreen.tsx
│   │   └── ProfileScreen.tsx
│
│   ├── navigation
│   │   ├── RootNavigator.tsx
│   │   ├── OnboardingNavigator.tsx
│   │   └── MainNavigator.tsx
│
│   ├── components
│   │   ├── GlassCard.tsx
│   │   ├── StarBackground.tsx
│   │   ├── ProgressDots.tsx
│   │   └── ProgressBar.tsx
│
│   ├── services
│   │   ├── aiService.ts
│   │   ├── astrologyService.ts
│   │   ├── readingService.ts
│   │   └── userService.ts
│
│   ├── firebase
│   │   ├── firebaseConfig.ts
│   │   └── firestoreService.ts
│
│   ├── auth
│   │   ├── clerkProvider.tsx
│   │   ├── signIn.ts
│   │   └── signOut.ts
│
│   ├── store
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   └── fortuneStore.ts
│
│   ├── hooks
│   │   ├── useAuth.ts
│   │   └── useUser.ts
│
│   └── utils
│       ├── dateUtils.ts
│       └── astrologyUtils.ts
```

---

# Firestore Database Schema

Collection: users

Document path:

```
users/{clerkId}
```

User document:

```
{
  clerkId: string
  email: string
  displayName: string
  photoURL: string

  createdAt: Timestamp

  birthDate: string
  birthTime: string | null
  birthCity: string

  birthLat: number
  birthLon: number

  interests: string[]

  sunSign: string
  moonSign: string
  risingSign: string
  venusSign: string
  marsSign: string

  onboardingCompleted: boolean
  onboardingStep: number

  isPremium: boolean
  coins: number
}
```

Subcollection:

```
users/{clerkId}/readings
```

Reading document:

```
{
  id: string
  type: 'coffee' | 'tarot' | 'palm' | 'dream' | 'numerology'
  createdAt: Timestamp
  result: string
  imageUrl?: string
  isFavorite: boolean
}
```

---

# Authentication Flow (Clerk)

App Launch

Clerk Session Check

No Session
→ Login Screen

Login Methods

* Google Sign In
* Apple Sign In
* Email / Password

Session Exists

If onboardingCompleted = false
→ Onboarding Flow

If onboardingCompleted = true
→ Main App

Sign Out
→ Login Screen

IMPORTANT

Authentication must **always use Clerk**.

Use these hooks:

```
useAuth()
useUser()
```

User ID must always be:

```
user.id
```

This value is stored in Firestore as **clerkId**.

Firebase Auth must **never be used**.

Firebase is used only for:

* Firestore database
* Storage
* Cloud functions

---

# Onboarding Flow

Step 1
Login (Google / Apple / Email)

Step 2
User Details
Name
Birth Date
Birth Time
Birth City

Step 3
Interest Selection
Love
Career
Health
Family
Growth
Spirituality

Step 4
Push Notification Permission

After completion:

```
onboardingCompleted = true
```

User is redirected to HomeScreen.

---

# Fortune Reading Features

Coffee Reading
Input: photo of coffee cup
AI: GPT-4o Vision

Tarot Reading
Random tarot card draw
AI interpretation

Palm Reading
Hand photo analysis

Dream Interpretation
User text description

Numerology
Name + birth date analysis

---

# AI Prompt Strategy

System prompt example:

You are an experienced mystical fortune teller.
Provide a symbolic and mystical interpretation.

Use emotional and imaginative language.

User data available:

* name
* zodiac sign
* interests

Response format:

2-4 paragraphs mystical interpretation.

---

# Daily Astrology

Daily horoscope per zodiac sign

Weekly horoscope

Moon phase calendar

Retrograde alerts

---

# Compatibility Analysis

Input:

Birth date A
Birth date B

Output:

Love compatibility
Communication compatibility
Emotional connection
Long term potential

AI generates detailed relationship analysis.

---

# Profile Features

User zodiac badge

Sun / Moon / Rising signs

Reading history

Favorite readings

Daily streak counter

---

# Monetization

Free Users

1 coffee reading per day
Daily horoscope

Premium Users

Unlimited readings
Full birth chart
Compatibility analysis

Coins

Earn by watching ads
Purchase coin packages

Subscriptions handled with RevenueCat.

---

# Key Development Rules

Always use TypeScript.

Use functional React components.

Use Zustand for global state.

Use services layer for API calls.

Never store API keys in the client.

Always use Clerk for authentication.

Keep components small and reusable.