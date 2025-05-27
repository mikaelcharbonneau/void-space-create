import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const defaultContext: UserContextType = {
  user: null,
  loading: false
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loading, setLoading] = useState(true);

  // Since we don't need authentication, we'll just create a default user
  const defaultUser: User = {
    id: '1',
    email: '',
    name: 'HPE Technician',
  };

  useEffect(() => {
    // Simulate loading the user
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <UserContext.Provider value={{ user: defaultUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
