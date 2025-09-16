import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/me", {
          headers: {
            Authorization: `Bearer ${token}`
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
  }, [token]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
