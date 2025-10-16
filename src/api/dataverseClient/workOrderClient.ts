// src/api/dataverseClient/workOrderClient.ts
import { getXrm } from "../../utils/xrmUtils";

/**
 * WorkOrder 関連のAPIクライアント
 * （将来的にCRUDを追加できるよう拡張設計）
 */
export const workOrderClient = {
    /** WorkOrder 一覧取得（現在のユーザー作成分のみ） */
    async getWorkOrders(): Promise<{ id: string; name: string }[]> {
        const xrm = getXrm();

        // ✅ ローカル開発用モックデータ
        if (!xrm) {
            return [
                { id: "wo-001", name: "ワークオーダサンプル①" },
                { id: "wo-002", name: "ワークオーダサンプル②" },
            ];
        }

        // ✅ 現在のユーザー GUID を取得（{ }を除去）
        const globalCtx = xrm.Utility.getGlobalContext();
        const userId = globalCtx.userSettings.userId.replace(/[{}]/g, "");

        // ✅ 自分が作成したレコードのみ取得
        const query =
            `?$select=proto_workorderid,proto_wonumber` +
            `&$filter=_createdby_value eq ${userId}`;

        try {
            const result = await xrm.WebApi.retrieveMultipleRecords("proto_workorder", query);

            // ✅ Dataverse → アプリ用データ形式に整形
            return result.entities.map((r: any) => ({
                id: r.proto_workorderid,  // GUID
                name: r.proto_wonumber,   // 表示用WO番号
            }));
        } catch (error) {
            console.error("❌ WorkOrder取得失敗:", error);
            return [];
        }
    },
};
