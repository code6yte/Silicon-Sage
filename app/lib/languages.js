import clientPromise from './mongodb';

const dbName = process.env.MONGODB_DB || 'Silicon';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

let languagesCache = null;
let languagesCacheTime = 0;

export async function getProgrammingLanguages(limit = null) {
  const now = Date.now();

  // Return cached data if still valid
  if (languagesCache && now - languagesCacheTime < CACHE_DURATION) {
    return limit ? languagesCache.slice(0, limit) : languagesCache;
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  // Only fetch necessary fields to reduce bandwidth
  const languages = await db
    .collection('programming_languages')
    .find({}, {
      projection: {
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
    })
    .sort({ order: 1 })
    .toArray();

  // Remove MongoDB's _id field
  languagesCache = languages.map(({ _id, ...rest }) => rest);
  languagesCacheTime = now;

  return limit ? languagesCache.slice(0, limit) : languagesCache;
}

export async function getProgrammingLanguageBySlug(slug) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const language = await db.collection('programming_languages').findOne(
    { slug },
    {
      projection: {
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
      },
    }
  );

  return language ? { ...language } : null;
}

// Get paginated languages for lazy loading
export async function getPaginatedLanguages(page = 1, pageSize = 6) {
  const allLanguages = await getProgrammingLanguages();
  const skip = (page - 1) * pageSize;
  const paginatedLanguages = allLanguages.slice(skip, skip + pageSize);

  return {
    data: paginatedLanguages,
    page,
    pageSize,
    total: allLanguages.length,
    hasMore: skip + pageSize < allLanguages.length,
  };
}

// Clear cache manually if needed
export function clearLanguagesCache() {
  languagesCache = null;
  languagesCacheTime = 0;
}
