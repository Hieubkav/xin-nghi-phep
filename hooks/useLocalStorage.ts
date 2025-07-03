import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lấy giá trị từ localStorage hoặc sử dụng giá trị mặc định
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Hàm để cập nhật giá trị
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép value là một function để có thể sử dụng như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Xóa giá trị khỏi localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Hook chuyên dụng cho form data
export function useFormPersistence<T>(key: string, initialValue: T) {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  // Auto-save sau mỗi 2 giây khi có thay đổi
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const setValueWithAutoSave = (newValue: T | ((val: T) => T)) => {
    setValue(newValue);
    
    // Clear timeout cũ
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set timeout mới
    const timeout = setTimeout(() => {
      console.log('Auto-saved form data');
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };
  
  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);
  
  return [value, setValueWithAutoSave, removeValue] as const;
}
