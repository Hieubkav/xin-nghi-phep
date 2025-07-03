import { LeaveRequestData } from '../types.ts';

interface CacheEntry {
  data: string;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
}

export class CacheService {
  private static readonly CACHE_PREFIX = 'leave_request_cache_';
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_CACHE_SIZE = 50; // Maximum number of cached entries

  // Tạo cache key từ form data
  private static createCacheKey(formData: LeaveRequestData): string {
    // Tạo hash đơn giản từ form data
    const keyData = {
      fullName: formData.fullName.trim(),
      position: formData.position.trim(),
      recipientName: formData.recipientName.trim(),
      recipientPosition: formData.recipientPosition.trim(),
      leaveType: formData.leaveType,
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim(),
      reason: formData.reason.trim(),
      notes: formData.notes.trim(),
      tone: formData.tone,
      remoteWork: formData.remoteWork,
      checkEmail: formData.checkEmail
    };

    const jsonString = JSON.stringify(keyData);
    return this.CACHE_PREFIX + this.simpleHash(jsonString);
  }

  // Hash function đơn giản
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Lưu vào cache
  static set(formData: LeaveRequestData, result: string, ttl: number = this.DEFAULT_TTL): void {
    try {
      const key = this.createCacheKey(formData);
      const now = Date.now();
      
      const entry: CacheEntry = {
        data: result,
        timestamp: now,
        expiresAt: now + ttl
      };

      localStorage.setItem(key, JSON.stringify(entry));
      
      // Cleanup old entries if cache is too large
      this.cleanupCache();
      
      console.log('Cached result for key:', key);
    } catch (error) {
      console.warn('Failed to cache result:', error);
    }
  }

  // Lấy từ cache
  static get(formData: LeaveRequestData): string | null {
    try {
      const key = this.createCacheKey(formData);
      const cached = localStorage.getItem(key);
      
      if (!cached) {
        this.updateStats('miss');
        return null;
      }

      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Kiểm tra expiration
      if (now > entry.expiresAt) {
        localStorage.removeItem(key);
        this.updateStats('miss');
        return null;
      }

      this.updateStats('hit');
      console.log('Cache hit for key:', key);
      return entry.data;
    } catch (error) {
      console.warn('Failed to get cached result:', error);
      this.updateStats('miss');
      return null;
    }
  }

  // Xóa cache entry
  static remove(formData: LeaveRequestData): void {
    try {
      const key = this.createCacheKey(formData);
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove cache entry:', error);
    }
  }

  // Xóa tất cả cache
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset stats
      localStorage.removeItem('cache_stats');
      console.log('Cache cleared');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Cleanup cache cũ
  private static cleanupCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      if (cacheKeys.length <= this.MAX_CACHE_SIZE) {
        return;
      }

      // Lấy thông tin về các cache entries
      const entries = cacheKeys.map(key => {
        try {
          const entry: CacheEntry = JSON.parse(localStorage.getItem(key) || '{}');
          return { key, timestamp: entry.timestamp || 0 };
        } catch {
          return { key, timestamp: 0 };
        }
      });

      // Sắp xếp theo timestamp (cũ nhất trước)
      entries.sort((a, b) => a.timestamp - b.timestamp);

      // Xóa các entries cũ nhất
      const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 10);
      toRemove.forEach(({ key }) => {
        localStorage.removeItem(key);
      });

      console.log(`Cleaned up ${toRemove.length} old cache entries`);
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }

  // Cập nhật thống kê cache
  private static updateStats(type: 'hit' | 'miss'): void {
    try {
      const stats = this.getStats();
      
      if (type === 'hit') {
        stats.hits++;
      } else {
        stats.misses++;
      }
      
      stats.totalRequests = stats.hits + stats.misses;
      stats.hitRate = stats.totalRequests > 0 ? (stats.hits / stats.totalRequests) * 100 : 0;
      
      localStorage.setItem('cache_stats', JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to update cache stats:', error);
    }
  }

  // Lấy thống kê cache
  static getStats(): CacheStats {
    try {
      const cached = localStorage.getItem('cache_stats');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
    }
    
    return {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0
    };
  }

  // Lấy thông tin cache
  static getCacheInfo(): { size: number; entries: Array<{ key: string; timestamp: number; expiresAt: number }> } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      const entries = cacheKeys.map(key => {
        try {
          const entry: CacheEntry = JSON.parse(localStorage.getItem(key) || '{}');
          return {
            key: key.replace(this.CACHE_PREFIX, ''),
            timestamp: entry.timestamp || 0,
            expiresAt: entry.expiresAt || 0
          };
        } catch {
          return {
            key: key.replace(this.CACHE_PREFIX, ''),
            timestamp: 0,
            expiresAt: 0
          };
        }
      });

      return {
        size: cacheKeys.length,
        entries: entries.sort((a, b) => b.timestamp - a.timestamp)
      };
    } catch (error) {
      console.warn('Failed to get cache info:', error);
      return { size: 0, entries: [] };
    }
  }

  // Kiểm tra xem có cache cho form data này không
  static hasCache(formData: LeaveRequestData): boolean {
    const key = this.createCacheKey(formData);
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return false;

      const entry: CacheEntry = JSON.parse(cached);
      return Date.now() <= entry.expiresAt;
    } catch {
      return false;
    }
  }

  // Preload cache cho các form data phổ biến
  static preloadCommonCaches(): void {
    // Có thể implement logic để preload các cache phổ biến
    console.log('Cache service initialized');
  }
}
