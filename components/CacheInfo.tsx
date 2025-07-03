import React, { useState, useEffect } from 'react';
import { CacheService } from '../services/cacheService.ts';

interface CacheInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

const CacheInfo: React.FC<CacheInfoProps> = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState(CacheService.getStats());
  const [cacheInfo, setCacheInfo] = useState(CacheService.getCacheInfo());

  useEffect(() => {
    if (isVisible) {
      const updateInfo = () => {
        setStats(CacheService.getStats());
        setCacheInfo(CacheService.getCacheInfo());
      };

      updateInfo();
      const interval = setInterval(updateInfo, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClearCache = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả cache?')) {
      CacheService.clear();
      setStats(CacheService.getStats());
      setCacheInfo(CacheService.getCacheInfo());
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Thông tin Cache</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Cache Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê Cache</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.hits}</div>
                <div className="text-sm text-blue-800">Cache Hits</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.misses}</div>
                <div className="text-sm text-red-800">Cache Misses</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalRequests}</div>
                <div className="text-sm text-green-800">Tổng requests</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.hitRate.toFixed(1)}%</div>
                <div className="text-sm text-purple-800">Hit Rate</div>
              </div>
            </div>
          </div>

          {/* Cache Entries */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Cache Entries ({cacheInfo.size})
              </h3>
              <button
                onClick={handleClearCache}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                disabled={cacheInfo.size === 0}
              >
                Xóa tất cả Cache
              </button>
            </div>
            
            {cacheInfo.size === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có cache nào được lưu
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cache Key
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian tạo
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian còn lại
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cacheInfo.entries.map((entry, index) => {
                      const isExpired = Date.now() > entry.expiresAt;
                      return (
                        <tr key={index} className={isExpired ? 'bg-red-50' : ''}>
                          <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                            {entry.key.substring(0, 12)}...
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {formatDate(entry.timestamp)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {formatTimeRemaining(entry.expiresAt)}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isExpired 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isExpired ? 'Hết hạn' : 'Hoạt động'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cache Benefits */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Lợi ích của Cache:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Giảm thời gian chờ khi tạo đơn với dữ liệu tương tự</li>
              <li>• Tiết kiệm API calls và chi phí</li>
              <li>• Cải thiện trải nghiệm người dùng</li>
              <li>• Cache tự động hết hạn sau 24 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheInfo;
