# Security Specification for Firestore Rules

## 1. Data Invariants
- Game documents in `/games/{gameId}` have public read access so any visitor or gamer can browse the library, view system requirements, and read guides.
- Games can be updated or created by administrators, or modified to increment likes or unlock game codes.
- User profiles in `/users/{userId}` allow reading public gamer profiles and writing/updating one's user profile.
- System announcements in `/system/announcements` can be read publicly and updated by administrators.

## 2. The Payloads
- Unauthenticated or malformed document writes exceeding max size limits or injecting illegal types are rejected.
- Document keys must meet length limits.
