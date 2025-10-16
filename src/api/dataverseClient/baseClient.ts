// src/api/dataverseClient/baseClient.ts
import { getXrm } from "../../utils/xrmUtils";

/**
 * Dataverse WebAPI 共通クライアント
 * （全体共通で利用する基本操作群）
 */
export const baseClient = {
    /** --------------------------------------------------
     * 🔹 複数レコード取得
     * -------------------------------------------------- */
    async retrieveMultiple(entity: string, query: string) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");
        const result = await xrm.WebApi.retrieveMultipleRecords(entity, query);
        return result.entities;
    },

    /** --------------------------------------------------
     * 🔹 単一レコード取得
     * -------------------------------------------------- */
    async retrieve(entity: string, id: string, query?: string) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");
        const result = await xrm.WebApi.retrieveRecord(entity, id, query ?? "");
        return result;
    },

    /** --------------------------------------------------
     * 🔹 レコード削除
     * -------------------------------------------------- */
    async delete(entity: string, id: string) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");
        await xrm.WebApi.deleteRecord(entity, id);
        return true;
    },
};
