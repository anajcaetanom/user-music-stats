import { createContext, useContext, useState } from "react";

const UiContext = createContext();

export const UiProvider = ({ children }) => {
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAppOpen, setIsAppOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
  
    return (
        <UiContext.Provider value={{
            showResults,
            setShowResults,
            isLoading,
            setIsLoading,
            isAppOpen,
            setIsAppOpen,
            isClosing, 
            setIsClosing
        }}>
            {children}
        </UiContext.Provider>
    );
};

export const useUi = () => useContext(UiContext);