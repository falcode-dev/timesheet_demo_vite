import { getXrm } from "../../utils/xrmUtils";

/** ユーザー情報の型定義 */
export type UserRecord = {
    id: string;
    firstName: string;
    lastName: string;
    employeeId?: string;
};

/**
 * Dataverse ユーザー情報取得クライアント
 * - ログイン中ユーザーの基本情報を取得
 * - ローカル開発時はモックデータを返す
 */
export const userClient = {
    /** 現在のユーザー情報を取得 */
    async getCurrentUser(): Promise<UserRecord> {
        const xrm = getXrm();

        // ローカル開発環境（Dataverse が存在しない場合）
        if (!xrm) {
            return {
                id: "local-user",
                firstName: "太郎",
                lastName: "テスト",
                employeeId: "999999",
            };
        }

        try {
            const globalCtx = xrm.Utility.getGlobalContext();
            const userId = globalCtx.userSettings.userId.replace(/[{}]/g, "");

            // Dataverse から現在の systemuser レコードを取得
            // 社員番号列（employeeid）は環境により異なる場合あり
            const result = await xrm.WebApi.retrieveRecord(
                "systemuser",
                userId,
                "?$select=firstname,lastname,employeeid"
            );

            return {
                id: userId,
                firstName: result.firstname ?? "",
                lastName: result.lastname ?? "",
                employeeId: result.employeeid ?? "",
            };
        } catch (error) {
            console.error("ユーザー情報取得エラー:", error);
            throw new Error("Dataverse からユーザー情報の取得に失敗しました。");
        }
    },
};
