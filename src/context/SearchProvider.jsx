import React, { createContext, useEffect, useState } from "react";

// Create the context
export const SearchContext = createContext();

// Provide the context
export const SearchProvider = ({ children }) => {
  const [searchTerms, setSearchTerms] = useState("");



  return (
    <SearchContext.Provider value={{ searchTerms, setSearchTerms }}>
      {children}
    </SearchContext.Provider>
  );
};
