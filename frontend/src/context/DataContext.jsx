import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [username, setUsername] = useState("");
    const [timespan, setTimespan] = useState("");
    const [category, setCategory] = useState("");
    const [profilePic, setProfilePic] = useState("");
     
    return (
        <DataContext.Provider value ={{
            username,
            setUsername,
            timespan,
            setTimespan,
            category,
            setCategory,
            profilePic,
            setProfilePic
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);