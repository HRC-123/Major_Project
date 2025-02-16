import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [googleLoginDetails, setGoogleLoginDetails] = useState({});

  return (
    <GlobalContext.Provider
      value={{
        googleLoginDetails,
        setGoogleLoginDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
