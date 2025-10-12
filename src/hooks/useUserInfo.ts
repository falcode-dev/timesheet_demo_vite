import { useQuery } from "@tanstack/react-query";
import { getXrm } from "../utils/xrmUtils";

export type UserInfo = {
    userId: string;
    userName: string;
    organizationName: string;
};

export const useUserInfo = () => {
    return useQuery<UserInfo | null>({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const xrm = getXrm();
            if (!xrm) return null;

            const ctx = xrm.Utility.getGlobalContext();
            return {
                userId: ctx.userSettings.userId.replace(/[{}]/g, ""),
                userName: ctx.userSettings.userName,
                organizationName: ctx.organizationSettings.uniqueName,
            };
        },
        staleTime: Infinity, // ユーザー情報は基本変わらない
    });
};
