'use client';
import { createContext, useContext, useState } from "react";

const ActiveNavContext = createContext<[string, (isLoading: string) => void]>(["", (isLoading: string) => {}]);

export default function useActiveNav() {
    return useContext(ActiveNavContext);
}

export function ActiveNavProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [activeNav, setActiveNav] = useState("");

    return (
        <ActiveNavContext.Provider value={[activeNav, setActiveNav]}>
            {children}
        </ActiveNavContext.Provider>
    );
}