import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCAL_STORAGE_KEYS = {
  FAVORITE_MEDITATION_KEYS_ARRAY: 'favoriteMeditationKeysArray',
}

export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(defaultValue);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        const rawValue = await AsyncStorage.getItem(key);
        if (rawValue !== null) {
          setStoredValue(JSON.parse(rawValue));
        }
      } catch (error) {
        console.warn(`useLocalStorage: Failed to load key "${key}"`, error);
      }
    };
    loadValue();
  }, [key]);

  // Save to AsyncStorage when updated
  const setValue = useCallback(
    (value) => {
      setStoredValue(value);
      try {
        AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`useLocalStorage: Failed to save key "${key}"`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
