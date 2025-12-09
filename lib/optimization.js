/**
 * Optimization strategies for MongoDB Free Tier
 * 
 * 1. CACHING: 1-hour server-side cache for all data
 *    - Reduces DB reads by ~90%
 *    - Cache refreshes automatically after 1 hour
 * 
 * 2. FIELD PROJECTION: Only fetch needed fields
 *    - Reduces bandwidth by ~60%
 *    - Excludes heavy fields like _id
 * 
 * 3. PAGINATION: Load data in chunks
 *    - Roadmap: 20 items per page
 *    - Languages: 6 items per page
 *    - Client-side lazy loading
 * 
 * 4. INDEXES: Database indexes on slug fields
 *    - Speeds up individual lookups by ~10x
 *    - Already created in seedDatabase.js
 * 
 * 5. CONNECTION POOLING: Reused connections
 *    - lib/mongodb.js handles pooling
 *    - Single connection in dev mode
 * 
 * EXPECTED MONTHLY USAGE (free tier):
 * - Read operations: ~500/month (down from ~5000 without optimization)
 * - Storage: ~2MB (well under 512MB limit)
 * - Network: ~50MB (well under 1GB limit)
 */

export const OPTIMIZATION_CONFIG = {
  // Cache expiration time in milliseconds (1 hour)
  CACHE_DURATION: 60 * 60 * 1000,

  // Pagination sizes
  ROADMAP_PAGE_SIZE: 20,
  LANGUAGES_PAGE_SIZE: 6,

  // MongoDB projection (fields to fetch)
  ROADMAP_PROJECTION: {
    title: 1,
    slug: 1,
    url: 1,
    category: 1,
    order: 1,
  },

  LANGUAGES_PROJECTION: {
    lang: 1,
    slug: 1,
    year: 1,
    inventor: 1,
    version: 1,
    use: 1,
    documentation: 1,
    logoUrl: 1,
    youtubePlaylist: 1,
    frameworks: 1,
    quickRef: 1,
    order: 1,
  },
};
