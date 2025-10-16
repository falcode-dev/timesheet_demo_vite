// src/api/dataverseClient/workOrderClient.ts
import { getXrm } from "../../utils/xrmUtils";

/**
 * WorkOrder 関連のAPIクライアント
 * （将来的にCRUDを追加できるよう拡張設計）
 */
export const workOrderClient = {
    /** WorkOrder 一覧取得 */
    async getWorkOrders(): Promise<{ id: string; name: string }[]> {
        const xrm = getXrm();
        if (!xrm) {
            return [
                { id: "wo-001", name: "ワークオーダサンプル①" },
                { id: "wo-002", name: "ワークオーダサンプル②" },
            ];
        }

        const result = await xrm.WebApi.retrieveMultipleRecords(
            "proto_workorder",
            "?$select=proto_workorderid,proto_wonumber"
        );

        return result.entities.map((r: any) => ({
            id: r.proto_workorderid,
            name: r.proto_wonumber,
        }));
    },
};
