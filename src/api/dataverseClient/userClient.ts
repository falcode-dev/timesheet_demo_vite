import { getXrm } from "../../utils/xrmUtils";

export const userClient = {
    async getCurrentUser(): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        employeeid?: string;
    }> {
        const xrm = getXrm();

        if (!xrm) {
            return {
                id: "local-user",
                firstName: "太郎",
                lastName: "テスト",
                employeeid: "999999",
            };
        }

        try {
            const globalCtx = xrm.Utility.getGlobalContext();
            const userId = globalCtx.userSettings.userId.replace(/[{}]/g, "");

            // ✅ 社員番号列のスキーマ名を実際の環境に合わせて変更してください
            const result = await xrm.WebApi.retrieveRecord(
                "systemuser",
                userId,
                "?$select=firstname,lastname,employeeid"
            );

            return {
                id: userId,
                firstName: result.firstname ?? "",
                lastName: result.lastname ?? "",
                employeeid: result.employeeid ?? "",
            };
        } catch (error) {
            console.error("❌ ユーザー情報取得失敗:", error);
            throw error;
        }
    },
};
