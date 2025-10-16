import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AllowedUserContextType = {
    allowedUsers: string[]; // 許可済みユーザーのID一覧
    setAllowedUsers: (users: string[]) => void;
};

const UserListContext = createContext<AllowedUserContextType | undefined>(undefined);

export const UserListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allowedUsers, setAllowedUsers] = useState<string[]>([]);

    return (
        <UserListContext.Provider value={{ allowedUsers, setAllowedUsers }}>
            {children}
        </UserListContext.Provider>
    );
};

// カスタムフック
export const useAllowedUsers = (): AllowedUserContextType => {
    const context = useContext(UserListContext);
    if (!context) throw new Error("useAllowedUsers must be used within a UserListProvider");
    return context;
};
