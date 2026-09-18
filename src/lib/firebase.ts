import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';
import { Game, UserProfile } from '../types';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId if provided
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Connection test helper
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, using local cached state');
      return false;
    }
    // Any non-fatal response still means server reachable
    return true;
  }
}

// Collections references
export const GAMES_COLLECTION = 'games';
export const USERS_COLLECTION = 'users';
export const SYSTEM_COLLECTION = 'system';

/**
 * Cloud Sync Service for Games
 */
export async function syncGameToCloud(game: Game): Promise<void> {
  try {
    const docRef = doc(db, GAMES_COLLECTION, game.id);
    await setDoc(docRef, game, { merge: true });
  } catch (err) {
    console.error(`Error saving game ${game.id} to cloud:`, err);
  }
}

export async function deleteGameFromCloud(gameId: string): Promise<void> {
  try {
    const docRef = doc(db, GAMES_COLLECTION, gameId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting game ${gameId} from cloud:`, err);
  }
}

/**
 * Seed initial games to Cloud Firestore if database is empty
 */
export async function seedInitialGamesIfEmpty(initialGames: Game[]): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, GAMES_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Cloud database is empty. Seeding initial game library to Firestore...');
      for (const game of initialGames) {
        const docRef = doc(db, GAMES_COLLECTION, game.id);
        await setDoc(docRef, game);
      }
      console.log('Cloud database seeded successfully with initial games.');
    }
  } catch (err) {
    console.error('Error seeding initial games to cloud:', err);
  }
}

/**
 * Cloud Sync Service for User Profile
 */
export async function syncUserProfileToCloud(profile: UserProfile): Promise<void> {
  try {
    if (!profile.id) return;
    const docRef = doc(db, USERS_COLLECTION, profile.id);
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.error('Error syncing user profile to cloud:', err);
  }
}

/**
 * Cloud Sync Service for Global Announcement
 */
export async function syncAnnouncementToCloud(text: string): Promise<void> {
  try {
    const docRef = doc(db, SYSTEM_COLLECTION, 'announcements');
    await setDoc(docRef, { text, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Error syncing announcement to cloud:', err);
  }
}
