import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const setupAdmin = async (email, password) => {
  try {
    console.log('Starting admin setup process...');

    // Check if email is already registered
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email is already registered. Please use a different email or try logging in.'
      };
    }

    // Create user in Firebase Authentication
    console.log('Creating user in Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    
    // Set up admin role in Firestore
    console.log('Setting up admin role in Firestore...');
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    console.log('Admin setup completed successfully');
    return {
      success: true,
      message: 'Admin user created successfully. You can now log in.'
    };
  } catch (error) {
    console.error('Error in admin setup:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        message: 'This email is already registered. Please use a different email or try logging in.'
      };
    }
    
    if (error.code === 'auth/invalid-email') {
      return {
        success: false,
        message: 'Invalid email address. Please check the email format.'
      };
    }
    
    if (error.code === 'auth/weak-password') {
      return {
        success: false,
        message: 'Password is too weak. Please use a stronger password.'
      };
    }

    return {
      success: false,
      message: `Error creating admin account: ${error.message}`
    };
  }
}; 