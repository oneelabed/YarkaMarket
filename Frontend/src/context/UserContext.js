import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentUser, setCurrentUser] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            credentials: "include"
          }
        });
        if (!res.ok) throw new Error("Failed to fetch current user");
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
     // eslint-disable-next-line 
  }, [token]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
