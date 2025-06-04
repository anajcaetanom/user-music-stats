import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [timespan, setTimespan] = useState("");
  const [category, setCategory] = useState("");
  const [charts, setCharts] = useState([]);
  const [source, setSource] = useState("");

  return (
    <AppContext.Provider value ={{
      showResults,
      setShowResults,
      isLoading,
      setIsLoading,
      username,
      setUsername,
      timespan,
      setTimespan,
      category,
      setCategory,
      charts,
      setCharts,
      source,
      setSource
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);