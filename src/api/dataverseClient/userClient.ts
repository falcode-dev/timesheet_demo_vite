import { getXrm } from "../../utils/xrmUtils";

/** ユーザー情報の型定義 */
export type UserRecord = {
    id: string;               // proto_bookableresourceid
    firstName: string;        // 名（proto_mei）
    lastName: string;         // 姓（proto_sei）
    employeeId?: string;      // 任意（必要に応じて）
};

/**
 * Dataverse ユーザー情報取得クライアント
 * - ログイン中ユーザーに紐づく proto_bookableresource レコードを取得
 * - ローカル開発時はモックデータを返す
 */
export const userClient = {
    /** 現在のユーザー情報を取得 */
    async getCurrentUser(): Promise<UserRecord> {
        const xrm = getXrm();

        // ローカル環境（Dataverseなしの場合）
        if (!xrm) {
            return {
                id: "local-resource",
                firstName: "太郎",
                lastName: "テスト",
                employeeId: "999999",
            };
        }

        try {
            // ログイン中のユーザーIDを取得
            const globalCtx = xrm.Utility.getGlobalContext();
            const userId = globalCtx.userSettings.userId.replace(/[{}]/g, "");

            // proto_bookableresource から、対応するユーザーIDのレコードを検索
            const query = `?$select=proto_bookableresourceid,_proto_systemuser_value,proto_shimei,proto_sei,proto_mei
                           &$filter=_proto_systemuser_value/systemuserid eq ${userId}`;

            const result = await xrm.WebApi.retrieveMultipleRecords(
                "proto_bookableresource",
                query
            );

            if (!result.entities.length) {
                throw new Error("対応する proto_bookableresource レコードが見つかりません。");
            }

            const record = result.entities[0];

            return {
                id: record.proto_bookableresourceid,
                firstName: record.proto_mei ?? "",
                lastName: record.proto_sei ?? "",
                employeeId: record.proto_shimei ?? "", // ※社員番号ではなく氏名（必要に応じて変更可）
            };
        } catch (error) {
            console.error("ユーザー情報取得エラー:", error);
            throw new Error("Dataverse からユーザー情報の取得に失敗しました。");
        }
    },
};
