import React, { createContext, useContext } from "react";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children, tasks, profile, categories }) => (
    <AppDataContext.Provider value={{ tasks, profile, categories }}>
        {children}
    </AppDataContext.Provider>
);
