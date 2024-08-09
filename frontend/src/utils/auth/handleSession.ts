/* eslint-disable @typescript-eslint/no-explicit-any */

export const setSession = (key: string, data: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to set session storage:', error);
    }
  };
  
  export const getSession = (key: string): any | null => {
    try {
      const sessionData = sessionStorage.getItem(key);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Failed to get session storage:', error);
      return null;
    }
  };
  
  export const clearSession = (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear session storage:', error);
    }
  };
  