import { useState, useEffect } from "react";

function usePersistState<T>(key: string, initialValue: T) {
  // Retrieve stored value from localStorage
  const storedValue = localStorage.getItem(key);
  
  let initial: T;
  
  try {
    initial = storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    initial = initialValue;
  }

  // useState to store the value
  const [value, setValue] = useState<T>(initial);

  // useEffect to update localStorage when the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export default usePersistState;
