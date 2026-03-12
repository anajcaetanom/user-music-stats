import { createContext, useContext, useState } from 'react';

const UiContext = createContext(null);

export const UiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  return (
    <UiContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isAppOpen,
        setIsAppOpen,
        isClosing,
        setIsClosing,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => useContext(UiContext);
