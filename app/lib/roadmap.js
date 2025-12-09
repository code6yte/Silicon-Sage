import clientPromise from './mongodb';

const dbName = process.env.MONGODB_DB || 'Silicon';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

let rolesCache = null;
let rolesCacheTime = 0;

export async function getRoadmapRoles(limit = null) {
  const now = Date.now();

  // Return cached data if still valid
  if (rolesCache && now - rolesCacheTime < CACHE_DURATION) {
    return limit ? rolesCache.slice(0, limit) : rolesCache;
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  // Only fetch necessary fields to reduce bandwidth
  const roles = await db
    .collection('roadmap_roles')
    .find({}, { projection: { title: 1, slug: 1, url: 1, category: 1, order: 1 } })
    .sort({ order: 1 })
    .toArray();

  // Remove MongoDB's _id field
  rolesCache = roles.map(({ _id, ...rest }) => rest);
  rolesCacheTime = now;

  return limit ? rolesCache.slice(0, limit) : rolesCache;
}

export async function getRoadmapRoleBySlug(slug) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const role = await db
    .collection('roadmap_roles')
    .findOne({ slug }, { projection: { title: 1, slug: 1, url: 1, category: 1 } });

  return role ? { ...role } : null;
}

// Get paginated roadmap roles for lazy loading
export async function getPaginatedRoadmapRoles(page = 1, pageSize = 20) {
  const allRoles = await getRoadmapRoles();
  const skip = (page - 1) * pageSize;
  const paginatedRoles = allRoles.slice(skip, skip + pageSize);

  return {
    data: paginatedRoles,
    page,
    pageSize,
    total: allRoles.length,
    hasMore: skip + pageSize < allRoles.length,
  };
}

// Clear cache manually if needed
export function clearRoadmapCache() {
  rolesCache = null;
  rolesCacheTime = 0;
}
