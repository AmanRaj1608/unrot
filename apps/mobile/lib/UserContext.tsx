import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserId = "aman" | "another";

interface UserContextValue {
  userId: UserId;
  setUserId: (id: UserId) => void;
}

const UserContext = createContext<UserContextValue>({
  userId: "aman",
  setUserId: () => {},
});

const STORAGE_KEY = "unrot:userId";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<UserId>("aman");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "aman" || stored === "another") {
        setUserIdState(stored);
      }
    });
  }, []);

  const setUserId = useCallback((id: UserId) => {
    setUserIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id);
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
