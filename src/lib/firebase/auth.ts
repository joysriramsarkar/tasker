"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from './config';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (error) {
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
