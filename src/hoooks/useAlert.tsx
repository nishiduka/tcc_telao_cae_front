import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

interface AlertContextType {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  closeAlert: () => void;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    if (alert.isOpen) {
      setTimeout(() => {
        setAlert({ isOpen: false, message: '' });
      }, 15000);
    }
  }, [alert]);

  const closeAlert = useCallback(() => {
    setAlert({ isOpen: false, message: '' });
  }, []);

  return (
    <AlertContext.Provider value={{ alert, setAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
