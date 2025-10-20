import { getXrm } from "../../utils/xrmUtils";

/** Task データ型 */
export type Task = {
    id: string;
    name: string;
    subcategoryId?: string;
};

/**
 * Task 関連 Dataverse クライアント
 * - 全件取得（カテゴリとの紐づき含む）
 */
export const taskClient = {
    /** 一覧取得 */
    async getTasks(): Promise<Task[]> {
        const xrm = getXrm();

        // 🔹 ローカルモック
        if (!xrm) {
            return [
                { id: "task-001", name: "資料作成", subcategoryId: "sub-001" },
                { id: "task-002", name: "会議準備", subcategoryId: "sub-003" },
                { id: "task-003", name: "品質テスト", subcategoryId: "sub-002" },
            ];
        }

        try {
            const query =
                "?$select=proto_taskid,proto_name";
            const result = await xrm.WebApi.retrieveMultipleRecords("proto_task", query);

            return result.entities.map((record: any) => ({
                id: record.proto_taskid,
                name: record.proto_name,
                // subcategoryId: record._proto_subcategory_value,
            }));
        } catch (error) {
            console.error("Task取得エラー:", error);
            return [];
        }
    },
};
