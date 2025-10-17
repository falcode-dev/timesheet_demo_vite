import { getXrm } from "../../utils/xrmUtils";

/** WorkOrder データ型 */
export type WorkOrder = {
    id: string;
    name: string;
};

/**
 * WorkOrder 関連の Dataverse API クライアント
 * - 現在のユーザーが作成した WorkOrder の一覧を取得
 * - 将来的に CRUD 操作を拡張可能な構成
 */
export const workOrderClient = {
    /** WorkOrder 一覧取得 */
    async getWorkOrders(): Promise<WorkOrder[]> {
        const xrm = getXrm();

        // ローカル環境（モックデータ）
        if (!xrm) {
            return [
                { id: "wo-001", name: "ワークオーダサンプル①" },
                { id: "wo-002", name: "ワークオーダサンプル②" },
            ];
        }

        // Dataverse 環境
        try {
            const userId = xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");

            // 自分が作成した WorkOrder のみ取得
            const query =
                `?$select=proto_workorderid,proto_wonumber` +
                `&$filter=_createdby_value eq ${userId}`;

            const result = await xrm.WebApi.retrieveMultipleRecords("proto_workorder", query);

            // データ整形
            return result.entities.map((record: any) => ({
                id: record.proto_workorderid,
                name: record.proto_wonumber,
            }));
        } catch (error) {
            console.error("WorkOrder取得エラー:", error);
            return [];
        }
    },
};
