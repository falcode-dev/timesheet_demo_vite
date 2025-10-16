// src/api/dataverseClient/timeEntryClient.ts
import { getXrm } from "../../utils/xrmUtils";

/** --------------------------------------------------
 * 🔹 JST文字列変換ユーティリティ
 * -------------------------------------------------- */
const toJstString = (date: Date): string => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
};

/**
 * TimeEntry の Dataverse CRUD クライアント
 */
export const timeEntryClient = {
    // =====================================================
    // ✅ 登録処理（create）
    // =====================================================
    async createTimeEntry(data: any) {
        const xrm = getXrm();
        const entityName = "proto_timeentry";

        const record: any = {
            proto_name: data.title || "現場作業",
            proto_maincategory: Number(data.mainCategory) || null,
            proto_timecategory: Number(data.timeCategory) || null,
            proto_paymenttype: Number(data.paymentType) || null,
            proto_timezone: Number(data.location) || null,
            proto_startdatetime: toJstString(data.start),
            proto_enddatetime: toJstString(data.end),
        };

        if (data.wo) {
            record["proto_wonumber@odata.bind"] = `/proto_workorders(${data.wo})`;
        }

        if (xrm && xrm.WebApi?.createRecord) {
            try {
                const result = await xrm.WebApi.createRecord(entityName, record);
                console.log("✅ Dataverse登録成功:", result);
                return { id: result.id, ...record };
            } catch (error) {
                console.error("❌ Dataverse 登録失敗:", error);
                throw error;
            }
        }

        // ✅ ローカル環境フォールバック
        console.log("💾 ローカル登録:", record);
        const mockId = `local-${Date.now()}`;
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        existing.push({ id: mockId, ...record });
        localStorage.setItem("localEvents", JSON.stringify(existing));
        return { id: mockId, ...record };
    },

    // =====================================================
    // ✅ 更新処理（update）
    // =====================================================
    async updateTimeEntry(id: string, data: any) {
        const xrm = getXrm();
        const entityName = "proto_timeentry";

        const record: any = {
            proto_name: data.title || "現場作業",
            proto_maincategory: Number(data.mainCategory) || null,
            proto_timecategory: Number(data.timeCategory) || null,
            proto_paymenttype: Number(data.paymentType) || null,
            proto_timezone: Number(data.location) || null,
            proto_startdatetime: toJstString(data.start),
            proto_enddatetime: toJstString(data.end),
        };

        if (data.wo) {
            record["proto_wonumber@odata.bind"] = `/proto_workorders(${data.wo})`;
        }

        if (xrm && xrm.WebApi?.updateRecord) {
            try {
                await xrm.WebApi.updateRecord(entityName, id, record);
                console.log("✅ Dataverse更新成功");
                return { id, ...record };
            } catch (error) {
                console.error("❌ Dataverse 更新失敗:", error);
                throw error;
            }
        }

        // ✅ ローカル環境フォールバック
        console.log("💾 ローカル更新:", record);
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        const updated = existing.map((ev: any) => (ev.id === id ? { ...ev, ...record } : ev));
        localStorage.setItem("localEvents", JSON.stringify(updated));
        return { id, ...record };
    },
};
