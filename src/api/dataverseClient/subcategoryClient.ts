import { getXrm } from "../../utils/xrmUtils";

/** SubCategory データ型 */
export type SubCategory = {
    id: string;
    name: string;
};

/**
 * SubCategory 関連 Dataverse クライアント
 * - 全件取得（管理者権限を想定）
 */
export const subcategoryClient = {
    /** 一覧取得 */
    async getSubcategories(): Promise<SubCategory[]> {
        const xrm = getXrm();

        // 🔹 ローカルモック
        if (!xrm) {
            return [
                { id: "sub-001", name: "教育" },
                { id: "sub-002", name: "品質改善" },
                { id: "sub-003", name: "業務効率化" },
            ];
        }

        try {
            const query = "?$select=proto_subcategoryid,proto_name";
            const result = await xrm.WebApi.retrieveMultipleRecords("proto_subcategory", query);

            return result.entities.map((record: any) => ({
                id: record.proto_subcategoryid,
                name: record.proto_name,
            }));
        } catch (error) {
            console.error("SubCategory取得エラー:", error);
            return [];
        }
    },
};
