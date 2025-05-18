# Billing App

A modern billing application for small businesses with Firebase backend. The app allows admins to manage customers, stock, and bills, while customers can view their bills and payment status.

## Features

### Admin Features
- Customer Management (Create/View Customers)
- Stock Management (Add/Edit Stock Items)
- Bill Management (Create/Update Bills)
- Payment Status Tracking
- Auto Bill Reset Every 6 Months

### Customer Features
- View Bills
- Check Payment Status
- View Payment Options
- Contact Information

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Functions)
- **Deployment**: Vercel (Frontend), Firebase Hosting (Backend)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd billing-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Set up Firestore Database
   - Get your Firebase configuration

4. Configure Firebase:
   - Replace the Firebase configuration in `src/config/firebase.js` with your project's configuration

5. Start the development server:
```bash
npm start
```

## Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Set up admin user

2. **Firestore Database**
   - Create collections:
     - users (for customers and admin)
     - stock (for inventory)
     - bills (for customer bills)

3. **Firebase Functions**
   - Set up function for auto bill reset every 6 months

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
│   ├── admin/     # Admin dashboard pages
│   └── customer/  # Customer dashboard pages
├── hooks/         # Custom hooks
├── config/        # Configuration files
└── utils/         # Utility functions
```

## Deployment

1. **Frontend (Vercel)**
```bash
npm run build
vercel deploy
```

2. **Backend (Firebase)**
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email kollahemasundharam.tech9@gmail.com or create an issue in the repository. 
