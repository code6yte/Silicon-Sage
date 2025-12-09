/**
 * Optional: Cache performance monitoring
 * Add this to track cache efficiency during development
 */

export class CacheMonitor {
  constructor(name) {
    this.name = name;
    this.hits = 0;
    this.misses = 0;
    this.startTime = Date.now();
  }

  recordHit() {
    this.hits++;
  }

  recordMiss() {
    this.misses++;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total === 0 ? 0 : ((this.hits / total) * 100).toFixed(2);
    const uptime = ((Date.now() - this.startTime) / 1000 / 60).toFixed(1); // minutes

    return {
      name: this.name,
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: `${hitRate}%`,
      uptime: `${uptime}m`,
    };
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    this.startTime = Date.now();
  }

  log() {
    const stats = this.getStats();
    console.table(stats);
  }
}

// Create monitors for each collection
export const rolesMonitor = new CacheMonitor("Roadmap Roles Cache");
export const languagesMonitor = new CacheMonitor("Programming Languages Cache");

// Log stats every 5 minutes during development
if (process.env.NODE_ENV === "development") {
  setInterval(() => {
    console.log("\n📊 Cache Performance Stats:");
    rolesMonitor.log();
    languagesMonitor.log();
  }, 5 * 60 * 1000);
}
