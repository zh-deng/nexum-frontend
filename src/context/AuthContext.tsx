import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { getCurrentUser } from "../lib/api/auth";
import { AuthUser } from "../types/auth";

type AuthContextType = {
	user: AuthUser | null;
	setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		getCurrentUser()
			.then(setUser)
			.catch(() => setUser(null));
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
