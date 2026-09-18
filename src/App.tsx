import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Game, NavTab, SortOption, UserProfile, LibraryNotification } from './types';
import { INITIAL_GAMES } from './data/initialGames';
import { INITIAL_USER_PROFILE, ADMIN_USER_PROFILE } from './data/initialProfile';
import { FTPTopHeader } from './components/FTPTopHeader';
import { FTPBottomNav } from './components/FTPBottomNav';
import { FTPAnnouncementCard } from './components/FTPAnnouncementCard';
import { FTPLibraryHeader } from './components/FTPLibraryHeader';
import { FTPGameCard } from './components/FTPGameCard';
import { FTPGameDetailView } from './components/FTPGameDetailView';
import { FTPHomeView } from './components/FTPHomeView';
import { FTPRentalView } from './components/FTPRentalView';
import { FTPFreeView } from './components/FTPFreeView';
import { FTPRulesView } from './components/FTPRulesView';
import { FTPGuideView } from './components/FTPGuideView';
import { FTPProfileView } from './components/FTPProfileView';
import { FTPNotificationsModal } from './components/FTPNotificationsModal';
import { FTPDiscordModal } from './components/FTPDiscordModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { GameFormModal } from './components/GameFormModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { NewGameToastNotification } from './components/NewGameToastNotification';
import { CheckCircle2, X, Search, ShieldCheck, Monitor, CloudOff } from 'lucide-react';
import {
  db,
  testFirebaseConnection,
  seedInitialGamesIfEmpty,
  syncGameToCloud,
  deleteGameFromCloud,
  syncUserProfileToCloud,
  syncAnnouncementToCloud,
  GAMES_COLLECTION,
  SYSTEM_COLLECTION,
} from './lib/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const STORAGE_GAMES_KEY = 'ftp_steam_offline_games_v1';
const STORAGE_PROFILE_KEY = 'ftp_user_profile_v1';
const STORAGE_ANNOUNCEMENT_KEY = 'ftp_announcement_text_v1';
const STORAGE_NOTIFICATIONS_KEY = 'ftp_library_notifications_v1';

export default function App() {
  // User Profile state with local persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY) || localStorage.getItem('s7g_user_profile_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username) {
          if (parsed.username === 'Alex_GamerS7G' || parsed.username === 'Alex_GamerFTP') {
            parsed.username = 'Alex_Gamer';
          }
          if (parsed.discordHandle && parsed.discordHandle.includes('s7g')) {
            parsed.discordHandle = 'alex_gamer#1337';
          }
          if (parsed.tierBadge && parsed.tierBadge.includes('FTP')) {
            parsed.tierBadge = 'VIP DIAMANTE';
          }
          if (parsed.bio && parsed.bio.includes('FTP')) {
            parsed.bio = parsed.bio.replace(/FTP/g, 'FTP');
          }
          if (parsed.avatarUrl && parsed.avatarUrl.includes('unsplash.com')) {
            parsed.avatarUrl = parsed.isAdmin ? ADMIN_USER_PROFILE.avatarUrl : INITIAL_USER_PROFILE.avatarUrl;
          }
          if (Array.isArray(parsed.unlockedHistory)) {
            parsed.unlockedHistory = parsed.unlockedHistory.map((item: any) => {
              const match = INITIAL_GAMES.find((ig) => ig.id === item.gameId || ig.title.toLowerCase() === item.gameTitle?.toLowerCase());
              if (match && (!item.coverUrl || item.coverUrl.includes('unsplash.com'))) {
                return { ...item, coverUrl: match.coverUrl };
              }
              return item;
            });
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading user profile from storage', e);
    }
    return INITIAL_USER_PROFILE;
  });

  // Games state with local persistence
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_GAMES_KEY) ||
        localStorage.getItem('s7g_steam_offline_games_v3') ||
        localStorage.getItem('s7g_steam_offline_games_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((g: Game) => {
            const initialMatch = INITIAL_GAMES.find((ig) => ig.id === g.id || ig.title.toLowerCase() === g.title.toLowerCase());
            const needsImageUpdate = !g.coverUrl || g.coverUrl.includes('unsplash.com');
            const needsBannerUpdate = !g.bannerUrl || g.bannerUrl.includes('unsplash.com');
            let pass = g.accountPassword || '92https://discord.gg/xzyz2UQyjY';
            if (pass.includes('s7g_offline') || pass.includes('steamcommunity_vip') || pass.includes('ftpgames')) {
              pass = pass.replace(/discord\.gg\/s7g_offline/g, 'discord.gg/xzyz2UQyjY')
                         .replace(/https:\/\/t\.me\/steamcommunity_vip/g, 'https://discord.gg/xzyz2UQyjY')
                         .replace(/discord\.gg\/ftpgames/g, 'discord.gg/xzyz2UQyjY');
            }
            return {
              ...g,
              coverUrl: needsImageUpdate && initialMatch ? initialMatch.coverUrl : g.coverUrl,
              bannerUrl: needsBannerUpdate && initialMatch ? initialMatch.bannerUrl : (g.bannerUrl || initialMatch?.bannerUrl || g.coverUrl),
              accountPassword: pass,
            };
          });
        }
      }
    } catch (e) {
      console.error('Error loading games from storage', e);
    }
    return INITIAL_GAMES;
  });

  // Active navigation tab ('games' by default to match video)
  const [activeTab, setActiveTab] = useState<NavTab>('games');

  // Currently viewed game (when tapped in library, shows detail page)
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Search and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGameFormModalOpen, setIsGameFormModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  // Custom announcement text with persistence
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANNOUNCEMENT_KEY);
      if (saved && (saved.includes('no son compatibles') || saved.includes('no compatible'))) {
        localStorage.removeItem(STORAGE_ANNOUNCEMENT_KEY);
        return '';
      }
      return saved || '';
    } catch {
      return '';
    }
  });

  // Success Unlock Toast (matches video top green banner: "✓ Game unlocked successfully")
  const [unlockToast, setUnlockToast] = useState<string | null>(null);

  // Local Notifications & Active Non-Intrusive Toast alert for newly added games
  const [localNotifications, setLocalNotifications] = useState<LibraryNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading local notifications:', e);
    }
    return [];
  });

  const [activeNewGameToast, setActiveNewGameToast] = useState<LibraryNotification | null>(null);
  const isInitialGamesLoadedRef = useRef(false);
  const previousGamesMapRef = useRef<Record<string, boolean>>({});

  const triggerNewGameToast = (newGame: Game) => {
    const notif: LibraryNotification = {
      id: `notif-game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'new_game',
      title: '¡Nuevo juego añadido!',
      message: `El administrador ha añadido "${newGame.title}" a la biblioteca de FTP.`,
      timestamp: Date.now(),
      gameId: newGame.id,
      gameTitle: newGame.title,
      gameCoverUrl: newGame.coverUrl,
      gameCategory: newGame.genres && newGame.genres.length > 0 ? newGame.genres.slice(0, 2).join(' • ') : 'Steam Offline',
      read: false,
    };

    setLocalNotifications((prev) => [notif, ...prev.slice(0, 19)]);
    setActiveNewGameToast(notif);
  };

  // Populate known games map on first load
  useEffect(() => {
    if (games.length > 0 && Object.keys(previousGamesMapRef.current).length === 0) {
      const map: Record<string, boolean> = {};
      games.forEach((g) => {
        map[g.id] = true;
      });
      previousGamesMapRef.current = map;
    }
  }, [games]);

  // Persist local notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(localNotifications));
    } catch (e) {
      console.error('Error persisting local notifications', e);
    }
  }, [localNotifications]);

  // Cloud Database Connection & Sync Status
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Firebase Firestore Connection & Real-time Cloud Synchronization
  useEffect(() => {
    let unsubscribeGames: (() => void) | undefined;
    let unsubscribeAnnouncement: (() => void) | undefined;

    async function initCloudSync() {
      // Test server connectivity
      const connected = await testFirebaseConnection();
      setIsCloudConnected(connected);

      // Seed initial game library to Cloud Firestore if collection is empty
      await seedInitialGamesIfEmpty(INITIAL_GAMES);

      // Realtime listener for all games in the Cloud Firestore database
      try {
        unsubscribeGames = onSnapshot(
          collection(db, GAMES_COLLECTION),
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudGames: Game[] = [];
              snapshot.forEach((docSnap) => {
                cloudGames.push(docSnap.data() as Game);
              });
              if (cloudGames.length > 0) {
                // Check if new games were added by an administrator in another session
                if (isInitialGamesLoadedRef.current) {
                  const newlyAdded = cloudGames.find((cg) => !previousGamesMapRef.current[cg.id]);
                  if (newlyAdded) {
                    triggerNewGameToast(newlyAdded);
                  }
                }

                const newMap: Record<string, boolean> = {};
                cloudGames.forEach((cg) => {
                  newMap[cg.id] = true;
                });
                previousGamesMapRef.current = newMap;
                isInitialGamesLoadedRef.current = true;

                setGames(cloudGames);
                setIsCloudConnected(true);
              }
            }
          },
          (err) => {
            console.warn('Firestore games sync warning (using local fallback):', err);
          }
        );
      } catch (err) {
        console.error('Error attaching games cloud listener:', err);
      }

      // Realtime listener for global announcement
      try {
        unsubscribeAnnouncement = onSnapshot(
          doc(db, SYSTEM_COLLECTION, 'announcements'),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && typeof data.text === 'string' && data.text.trim().length > 0) {
                setAnnouncementText(data.text);
              }
            }
          },
          (err) => {
            console.warn('Firestore announcement sync warning:', err);
          }
        );
      } catch (err) {
        console.error('Error attaching announcement cloud listener:', err);
      }
    }

    initCloudSync();

    return () => {
      if (unsubscribeGames) unsubscribeGames();
      if (unsubscribeAnnouncement) unsubscribeAnnouncement();
    };
  }, []);

  // Persist games locally as fast cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
    } catch (e) {
      console.error('Error persisting games', e);
    }
  }, [games]);

  // Persist profile locally and sync to Cloud Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
      syncUserProfileToCloud(userProfile);
    } catch (e) {
      console.error('Error persisting user profile', e);
    }
  }, [userProfile]);

  // Persist announcement locally and sync to Cloud Firestore
  useEffect(() => {
    try {
      if (announcementText) {
        localStorage.setItem(STORAGE_ANNOUNCEMENT_KEY, announcementText);
        syncAnnouncementToCloud(announcementText);
      }
    } catch (e) {
      console.error('Error persisting announcement', e);
    }
  }, [announcementText]);

  // Registration & Auth Handlers
  const handleRegister = (newProfileData: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...newProfileData,
      isRegistered: true,
    }));
    setUnlockToast('¡Cuenta gamer creada con éxito! Bienvenido a FTP.');
    setTimeout(() => setUnlockToast(null), 4000);
  };

  const handleLoginAsAdmin = () => {
    setUserProfile(ADMIN_USER_PROFILE);
    setUnlockToast('👑 Sesión iniciada como Super Administrador');
    setTimeout(() => setUnlockToast(null), 4000);
  };

  const handleLoginAsUser = (username: string, email: string) => {
    setUserProfile((prev) => ({
      ...prev,
      username,
      email,
      isRegistered: true,
      role: 'user',
      isAdmin: false,
    }));
    setUnlockToast(`¡Bienvenido de nuevo, ${username}!`);
    setTimeout(() => setUnlockToast(null), 4000);
  };

  // Toggle between Super Admin and Standard User profile
  const handleToggleAdminProfile = () => {
    if (userProfile.isAdmin) {
      setUserProfile({
        ...INITIAL_USER_PROFILE,
        isRegistered: true,
        role: 'user',
        isAdmin: false,
      });
      setUnlockToast('Modo Gamer Estándar activado');
      setTimeout(() => setUnlockToast(null), 3000);
    } else {
      // Open standard login modal
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setIsAuthModalOpen(false);
    setUserProfile(ADMIN_USER_PROFILE);
    setUnlockToast('👑 Permisos de Super Admin autenticados con éxito');
    setTimeout(() => setUnlockToast(null), 4000);
  };

  // Game Management (Admin Powers)
  const handleAddNewGame = () => {
    setGameToEdit(null);
    setIsGameFormModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setGameToEdit(game);
    setIsGameFormModalOpen(true);
  };

  const handleSaveGame = (gameData: Omit<Game, 'id' | 'dateAdded'> & { id?: string }) => {
    if (gameData.id) {
      const updatedGame = { ...gameToEdit, ...gameData } as Game;
      setGames((prev) =>
        prev.map((g) => (g.id === gameData.id ? updatedGame : g))
      );
      syncGameToCloud(updatedGame);
      setUnlockToast(`Juego "${gameData.title}" actualizado con éxito`);
    } else {
      const newGame: Game = {
        ...gameData,
        id: `game-custom-${Date.now()}`,
        dateAdded: new Date().toLocaleDateString('es-ES'),
        favorite: false,
        hoursPlayed: 0,
        accountLikes: 0,
        isCodeLocked: gameData.isCodeLocked !== undefined ? gameData.isCodeLocked : true,
        unlockCode: gameData.unlockCode || 'H70409',
      };
      // Mark in ref so local listener doesn't duplicate toast
      previousGamesMapRef.current[newGame.id] = true;
      setGames((prev) => [newGame, ...prev]);
      syncGameToCloud(newGame);
      // Trigger non-intrusive toast alert system
      triggerNewGameToast(newGame);
    }
    setIsGameFormModalOpen(false);
    setGameToEdit(null);
  };

  const handleTestNewGameNotification = () => {
    const sample = games[0] || INITIAL_GAMES[0];
    const demoGame: Game = {
      ...sample,
      id: sample.id,
      title: `${sample.title} (Aviso Admin)`,
    };
    triggerNewGameToast(demoGame);
  };

  const handleDeleteGame = (gameId: string) => {
    const target = games.find((g) => g.id === gameId);
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    deleteGameFromCloud(gameId);
    if (selectedGameId === gameId) setSelectedGameId(null);
    setUnlockToast(`Juego "${target?.title || 'eliminado'}" borrado`);
    setTimeout(() => setUnlockToast(null), 3000);
  };

  const handleToggleGameLock = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const mod = { ...g, isCodeLocked: !g.isCodeLocked };
          syncGameToCloud(mod);
          return mod;
        }
        return g;
      })
    );
  };

  const handleUnlockAllGames = () => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        const mod = { ...g, isCodeLocked: false };
        syncGameToCloud(mod);
        return mod;
      });
      return updated;
    });
    setUnlockToast('⚡ Todos los juegos de la biblioteca han sido desbloqueados');
    setTimeout(() => setUnlockToast(null), 4000);
  };

  const handleLockAllGames = () => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        const mod = { ...g, isCodeLocked: true };
        syncGameToCloud(mod);
        return mod;
      });
      return updated;
    });
    setUnlockToast('🔒 Todos los juegos han sido bloqueados con código');
    setTimeout(() => setUnlockToast(null), 4000);
  };

  const handleResetDefaultGames = () => {
    setGames(INITIAL_GAMES);
    INITIAL_GAMES.forEach((g) => syncGameToCloud(g));
    setUnlockToast('Biblioteca restaurada a valores por defecto');
    setTimeout(() => setUnlockToast(null), 3000);
  };

  const handleUnlockAllAchievements = () => {
    setUserProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => ({ ...a, unlocked: true })),
    }));
    setUnlockToast('🏆 Todos los logros gamer desbloqueados');
    setTimeout(() => setUnlockToast(null), 3000);
  };

  const handleMaxLevel = () => {
    setUserProfile((prev) => ({
      ...prev,
      level: 99,
      xp: 99999,
      tierBadge: '👑 SUPER ADMIN SUPREMO',
    }));
    setUnlockToast('⭐ Nivel 99 y 99,999 XP otorgados');
    setTimeout(() => setUnlockToast(null), 3000);
  };

  const selectedGame = useMemo(() => {
    return games.find((g) => g.id === selectedGameId) || null;
  }, [games, selectedGameId]);

  // Scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g))
    );
  };

  // Unlock Game Handler - also logs to user profile history and grants XP
  const handleUnlockGame = (gameId: string) => {
    const targetGame = games.find((g) => g.id === gameId);

    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const mod = {
            ...g,
            isCodeLocked: false,
            accountUpdatedAgo: 'Hace un momento',
          };
          syncGameToCloud(mod);
          return mod;
        }
        return g;
      })
    );

    // Update user profile unlocked history, XP & level
    if (targetGame) {
      setUserProfile((prev) => {
        const alreadyInHistory = prev.unlockedHistory.some(
          (h) => h.gameId === gameId
        );
        const newHistoryItem = {
          id: `hist-${Date.now()}`,
          gameId: targetGame.id,
          gameTitle: targetGame.title,
          coverUrl: targetGame.coverUrl,
          unlockedAt: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          unlockCodeUsed: targetGame.unlockCode || 'H70409',
          accountUsername: targetGame.accountUsername || 'STEAM_VIP',
          platformDisplay: targetGame.platformDisplay || 'Steam Offline',
          genres: targetGame.genres,
        };

        const newXp = prev.xp + 150;
        const newLevel = newXp >= 3500 ? prev.level + 1 : prev.level;
        const finalXp = newXp >= 3500 ? newXp - 3500 : newXp;

        return {
          ...prev,
          xp: finalXp,
          level: newLevel,
          unlockedHistory: alreadyInHistory
            ? prev.unlockedHistory
            : [newHistoryItem, ...prev.unlockedHistory],
          achievements: prev.achievements.map((a) =>
            a.id === 'ach-first-unlock' ? { ...a, unlocked: true } : a
          ),
        };
      });
    }

    // Show exact green toast banner from video
    setUnlockToast('Juego desbloqueado con éxito');
    setTimeout(() => {
      setUnlockToast(null);
    }, 4000);
  };

  // Filter & Sort games for the Library Grid
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(term);
          const matchGenre = game.genres.some((g) =>
            g.toLowerCase().includes(term)
          );
          if (!matchTitle && !matchGenre) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'titulo') return a.title.localeCompare(b.title);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'horas') return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
        return 0; // Default order
      });
  }, [games, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-100 flex flex-col selection:bg-purple-600/40 selection:text-white font-sans antialiased">
      
      {/* Top Header with FTP Logo, User Profile Avatar, and +9 Notifications */}
      <FTPTopHeader
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        notificationCount={9 + localNotifications.filter((n) => !n.read).length}
        profileAvatarUrl={userProfile.avatarUrl}
        profileLevel={userProfile.level}
        isAdmin={userProfile.isAdmin}
        isCloudConnected={isCloudConnected}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenProfile={() => {
          setSelectedGameId(null);
          setActiveTab('profile');
          handleScrollToTop();
        }}
        onLogoClick={() => {
          setSelectedGameId(null);
          setActiveTab('home');
          handleScrollToTop();
        }}
      />

      {/* Top Toast Banner: "Game unlocked successfully" (as shown in video Frame 00:15) */}
      {unlockToast && (
        <div className="fixed top-14 inset-x-4 max-w-sm mx-auto z-50 flex items-center justify-between px-4 py-2.5 bg-[#0b1c18] border border-emerald-500/60 text-emerald-300 text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{unlockToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setUnlockToast(null)}
            className="text-emerald-400/80 hover:text-emerald-200 p-0.5 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 sm:px-4 pt-3 pb-24">
        
        {/* Navigation Tab Switching */}
        {activeTab === 'games' ? (
          /* GAMES TAB: Either Selected Game Detail OR Game Library Grid */
          selectedGame ? (
            <FTPGameDetailView
              game={selectedGame}
              isAdmin={userProfile.isAdmin}
              onBack={() => {
                setSelectedGameId(null);
                handleScrollToTop();
              }}
              onToggleFavorite={handleToggleFavorite}
              onUnlockGame={handleUnlockGame}
              onOpenSteamGuide={() => setActiveTab('guide')}
              onOpenDiscordChannel={() => setIsDiscordModalOpen(true)}
              onEditGame={handleEditGame}
              onDeleteGame={handleDeleteGame}
              onToggleLock={handleToggleGameLock}
            />
          ) : (
            <div>
              {/* Site Notice Announcement Card (Frame 00:01) */}
              <FTPAnnouncementCard
                customText={announcementText}
                isAdmin={userProfile.isAdmin}
                onEditAnnouncement={() => setIsAdminPanelOpen(true)}
                onOpenSecurityGuide={() => setIsSecurityModalOpen(true)}
              />

              {/* Game Library Header with vertical purple accent & count */}
              <FTPLibraryHeader
                totalCount={games.length}
                filteredCount={filteredGames.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isAdmin={userProfile.isAdmin}
                onAddNewGame={handleAddNewGame}
                onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
              />

              {/* 2-Column Grid of Game Cards */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                  {filteredGames.map((game) => (
                    <FTPGameCard
                      key={game.id}
                      game={game}
                      onSelect={(g) => {
                        setSelectedGameId(g.id);
                        handleScrollToTop();
                      }}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-[#1e2538] rounded-2xl bg-[#0f121e]/60 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141828] border border-[#20283c] flex items-center justify-center mx-auto text-purple-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">No se encontraron juegos</h3>
                  <p className="text-xs text-slate-400">
                    No hay resultados para '{searchTerm}'. Intenta buscar 'What' o 'SnowRunner'.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </div>
          )
        ) : activeTab === 'home' ? (
          /* HOME TAB: "PLAY ANY GAME OFFLINE" Hero Banner & Rental Section */
          <FTPHomeView
            onNavigateToGames={() => {
              setSelectedGameId(null);
              setActiveTab('games');
              handleScrollToTop();
            }}
            onNavigateToRental={() => {
              setActiveTab('rental');
              handleScrollToTop();
            }}
            onSelectGame={(game) => {
              setSelectedGameId(game.id);
              setActiveTab('games');
              handleScrollToTop();
            }}
            featuredGames={games}
          />
        ) : activeTab === 'rental' ? (
          /* RENTAL TAB */
          <FTPRentalView
            games={games}
            onSelectGame={(game) => {
              setSelectedGameId(game.id);
              setActiveTab('games');
              handleScrollToTop();
            }}
          />
        ) : activeTab === 'free' ? (
          /* FREE TAB */
          <FTPFreeView
            games={games}
            onSelectGame={(game) => {
              setSelectedGameId(game.id);
              setActiveTab('games');
              handleScrollToTop();
            }}
          />
        ) : activeTab === 'profile' ? (
          /* USER PROFILE TAB: Banner, Unlocked History, Account Management & Settings */
          <FTPProfileView
            profile={userProfile}
            games={games}
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
            onToggleAdminProfile={handleToggleAdminProfile}
            onUnlockAllGames={handleUnlockAllGames}
            onMaxLevel={handleMaxLevel}
            onUnlockAllAchievements={handleUnlockAllAchievements}
            onUpdateProfile={setUserProfile}
            onSwitchAccount={() => setIsAuthModalOpen(true)}
            onLogout={() => {
              setUserProfile({
                ...INITIAL_USER_PROFILE,
                isRegistered: false,
              });
              setUnlockToast('Has cerrado sesión correctamente.');
              setTimeout(() => setUnlockToast(null), 3000);
            }}
            onSelectGame={(gameId) => {
              setSelectedGameId(gameId);
              setActiveTab('games');
              handleScrollToTop();
            }}
            onClearHistory={() => {
              setUserProfile((prev) => ({ ...prev, unlockedHistory: [] }));
            }}
          />
        ) : activeTab === 'rules' ? (
          /* RULES TAB */
          <FTPRulesView />
        ) : activeTab === 'guide' ? (
          /* GUIDE TAB */
          <FTPGuideView />
        ) : null}

      </main>

      {/* Docked Bottom Nav with Tabs and Floating Action Buttons */}
      <FTPBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedGameId(null);
          setActiveTab(tab);
          handleScrollToTop();
        }}
        onScrollToTop={handleScrollToTop}
        onOpenAssistant={() => setIsDiscordModalOpen(true)}
      />

      {/* Notifications Modal (+9 bell) */}
      <FTPNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onOpenSecurityNotice={() => setIsSecurityModalOpen(true)}
        localNotifications={localNotifications}
        onSelectGame={(gameId) => {
          setSelectedGameId(gameId);
          setActiveTab('games');
          handleScrollToTop();
        }}
        onClearLocalNotifications={() => setLocalNotifications([])}
      />

      {/* Discord Support Bot Modal */}
      <FTPDiscordModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
        onUseTestCode={(code) => {
          if (selectedGame) {
            handleUnlockGame(selectedGame.id);
          }
        }}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        games={games}
        userProfile={userProfile}
        announcementText={announcementText}
        onUpdateAnnouncement={(text) => setAnnouncementText(text)}
        onAddNewGame={handleAddNewGame}
        onEditGame={handleEditGame}
        onDeleteGame={handleDeleteGame}
        onToggleGameLock={handleToggleGameLock}
        onUnlockAllGames={handleUnlockAllGames}
        onLockAllGames={handleLockAllGames}
        onResetDefaultGames={handleResetDefaultGames}
        onToggleAdminProfile={handleToggleAdminProfile}
        onUnlockAllAchievements={handleUnlockAllAchievements}
        onMaxLevel={handleMaxLevel}
        onTestNewGameNotification={handleTestNewGameNotification}
      />

      {/* Add / Edit Game Modal */}
      <GameFormModal
        isOpen={isGameFormModalOpen}
        gameToEdit={gameToEdit}
        onClose={() => {
          setIsGameFormModalOpen(false);
          setGameToEdit(null);
        }}
        onSave={handleSaveGame}
      />

      {/* Registration / Login Modal (Mandatory for new users, or on-demand to switch account / login) */}
      <AuthModal
        isOpen={!userProfile.isRegistered || isAuthModalOpen}
        onClose={userProfile.isRegistered ? () => setIsAuthModalOpen(false) : undefined}
        onRegister={(newProfileData) => {
          handleRegister(newProfileData);
          setIsAuthModalOpen(false);
        }}
        onLoginAsAdmin={() => {
          handleLoginAsAdmin();
          setIsAuthModalOpen(false);
        }}
        onLoginAsUser={(username, email) => {
          handleLoginAsUser(username, email);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Admin Authentication Modal (Requires Username & Password) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Security Notice Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0e1220] border border-blue-500/40 p-5 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-600/25 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Política de Seguridad de Cuentas Steam
                </h3>
                <span className="text-[11px] text-blue-300">
                  Protección de Licencias Offline
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                Para evitar que las cuentas sean marcadas o suspendidas por Valve, nuestro sistema de licencias monitoriza los identificadores de hardware autorizados.
              </p>
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-600/30 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Steam PC y GeForce NOW: COMPATIBLES</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Condición: SOLO NO TIENES QUE VINCULAR LA CUENTA</span>
                </div>
              </div>
              <p>
                Puedes usar el cliente oficial de Steam en tu PC o disfrutar tus juegos en <strong className="text-white">GeForce NOW</strong>. Lo único que debes recordar es <strong className="text-amber-300">no vincular la cuenta</strong> a ningún servicio externo ni perfil personal (inicia sesión únicamente dentro del juego para jugar). En PC, recuerda activar el modo Desconectado.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Non-intrusive Toast Alert when a new game is added by an administrator */}
      <NewGameToastNotification
        notification={activeNewGameToast}
        onClose={() => setActiveNewGameToast(null)}
        onViewGame={(gameId) => {
          setSelectedGameId(gameId);
          setActiveTab('games');
          handleScrollToTop();
        }}
        duration={6000}
      />

    </div>
  );
}
