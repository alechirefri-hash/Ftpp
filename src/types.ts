export type NavTab =
  | 'home'
  | 'games'
  | 'rental'
  | 'free'
  | 'rules'
  | 'guide'
  | 'profile'
  | 'library'
  | 'keys'
  | 'settings';

export interface UnlockedGameHistoryItem {
  id: string;
  gameId: string;
  gameTitle: string;
  coverUrl: string;
  unlockedAt: string;
  unlockCodeUsed: string;
  accountUsername: string;
  platformDisplay?: string;
  genres?: string[];
}

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfileSettings {
  autoOfflinePrompt: boolean;
  soundEffects: boolean;
  streamerMode: boolean;
  discordSync: boolean;
  publicProfile: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  tag: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  discordHandle: string;
  steamId64: string;
  preferredRegion: string;
  level: number;
  xp: number;
  tierBadge: string;
  memberSince: string;
  isRegistered?: boolean;
  email?: string;
  role?: 'admin' | 'user';
  isAdmin?: boolean;
  unlockedHistory: UnlockedGameHistoryItem[];
  achievements: ProfileAchievement[];
  settings: UserProfileSettings;
}

export type Platform =
  | 'Steam'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo Switch'
  | 'Epic Games'
  | 'GOG'
  | 'PC'
  | 'Retro'
  | 'Otro';

export type GameStatus =
  | 'jugando'
  | 'completado'
  | 'pendiente'
  | 'deseado'
  | 'pausado';

export interface GameComment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar?: string;
}

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  platformDisplay?: string;
  badge?: string;
  accessBadge?: string;
  status: GameStatus;
  rating: number;
  hoursPlayed: number;
  coverUrl: string;
  bannerUrl?: string;
  genres: string[];
  releaseYear?: number;
  developer?: string;
  review: string;
  personalNotes: string;
  guideNotes?: string;
  isPrivateGuide?: boolean;
  favorite: boolean;
  dateAdded: string;
  finishedDate?: string;
  // FTP Steam Account unlock features
  isCodeLocked?: boolean;
  unlockCode?: string;
  accountUsername?: string;
  accountPassword?: string;
  accountUpdatedAgo?: string;
  accountLikes?: number;
  systemRequirementsMin?: string;
  systemRequirementsRec?: string;
  comments?: GameComment[];
  isRental?: boolean;
  isFree?: boolean;
}

export type FilterStatus = 'todos' | GameStatus | 'favoritos';
export type SortOption = 'default' | 'recientes' | 'rating' | 'horas' | 'titulo';

// Dashboard Profile Types for backward compatibility
export type SyncStatusBadge = 'SYNCED' | 'ACTION REQUIRED' | 'WAITING...';

export type StatusSubtext =
  | 'Status: Operational'
  | 'Status: Key Needed'
  | 'Status: Processing';

export type ActionButtonLabel = 'VIEW PROFILE' | 'CHECK STATUS' | 'FETCHING';

export interface GameProfile {
  id: string;
  title: string;
  badge: SyncStatusBadge;
  statusSubtext: StatusSubtext;
  actionLabel: ActionButtonLabel;
  favorite: boolean;
  gamesCount: number;
  featuredGame: string;
  coverImage: string;
  platformDisplay: string;
  lastSynced: string;
  syncTag: string;
  keyId?: string;
  healthScore: number;
  description: string;
  activeGames: string[];
}

export type SortStatusOption =
  | 'all'
  | 'synced'
  | 'action_required'
  | 'waiting'
  | 'favorites'
  | 'az';

export interface LibraryNotification {
  id: string;
  type: 'new_game' | 'system' | 'update';
  title: string;
  message: string;
  timestamp: number;
  gameId?: string;
  gameTitle?: string;
  gameCoverUrl?: string;
  gameCategory?: string;
  read?: boolean;
}


