// src/api/dataverseClient/resourceClient.ts
import { getXrm } from "../../utils/xrmUtils";

/** Bookable Resource 型定義 */
export type ResourceRecord = {
    id: string;
    number?: string;
    name: string;
    lastName?: string;
    firstName?: string;
    fullName?: string;
};

/**
 * Bookable Resource（リソース）Dataverse クライアント
 * - Dataverse から proto_bookableresource を取得
 * - ローカル開発時はモックデータを返す
 */
export const resourceClient = {
    /** リソース一覧取得 */
    async getResources(): Promise<ResourceRecord[]> {
        const xrm = getXrm();

        // ローカル開発環境（Dataverseが無い場合）
        if (!xrm) {
            return [
                { id: "1", number: "0001", name: "田中 太郎" },
                { id: "2", number: "0002", name: "佐藤 花子" },
                { id: "3", number: "0003", name: "鈴木 次郎" },
            ];
        }

        try {
            const entityName = "proto_bookableresource";
            const query =
                "?$select=proto_bookableresourceid,proto_sei,proto_mei,proto_shimei,proto_name";

            // Dataverse からレコード取得
            const result = await xrm.WebApi.retrieveMultipleRecords(entityName, query);

            // データ整形
            return result.entities.map((r: any): ResourceRecord => ({
                id: r.proto_bookableresourceid,
                number: r.proto_employeeid ?? "",
                lastName: r.proto_sei ?? "",
                firstName: r.proto_mei ?? "",
                fullName: r.proto_shimei ?? "",
                name: r.proto_name ?? "",
            }));
        } catch (error) {
            console.error("リソース取得エラー:", error);
            return [];
        }
    },
};
