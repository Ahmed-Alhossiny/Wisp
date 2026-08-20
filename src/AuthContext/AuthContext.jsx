import { createContext, useState } from "react";

export const authContext = createContext();

export function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);

  return (
    <authContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </authContext.Provider>
  );
}
