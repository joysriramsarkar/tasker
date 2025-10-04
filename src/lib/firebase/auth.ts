// THIS FILE IS AN EXACT DUPLICATE OF src/firebase/auth.ts
"use client";

import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from './auth-context';


export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (error) {
    return { error };
  }
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (error) {
    return { error };
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
        await updateProfile(result.user, { displayName });
    }
    // Manually refetch the user to get the updated profile
    const updatedUser = auth.currentUser;
    if(updatedUser) await updatedUser.reload();

    return { user: auth.currentUser };
  } catch(error) {
    return { error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch(error) {
    return { error };
  }
}


export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
}
