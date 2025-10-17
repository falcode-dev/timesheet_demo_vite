// src/api/dataverseClient/timeEntryClient.ts
import { getXrm } from "../../utils/xrmUtils";

/** TimeEntry 登録・更新時の入力データ型 */
export type TimeEntryInput = {
    id?: string;
    title?: string;
    mainCategory?: string | number | null;
    timeCategory?: string | number | null;
    paymentType?: string | number | null;
    timezone?: string | number | null;
    start?: Date;
    end?: Date;
    wo?: string; // WorkOrder ID
};

/** Dataverse 登録・更新後の返却型 */
export type TimeEntryRecord = {
    id: string;
    title: string;
    mainCategory: number | null;
    timeCategory: number | null;
    paymentType: number | null;
    timezone: number | null;
    start: string;
    end: string;
    wo?: string;
};

/** Date → JST 文字列（yyyy-MM-ddTHH:mm:ss）変換 */
const toJstString = (date?: Date): string => {
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
 * TimeEntry の Dataverse API クライアント
 */
export const timeEntryClient = {
    /** 新規登録 */
    async createTimeEntry(data: TimeEntryInput): Promise<TimeEntryRecord> {
        const xrm = getXrm();
        const entityName = "proto_timeentry";

        const record: TimeEntryRecord = {
            id: "",
            title: data.title || "現場作業",
            mainCategory: data.mainCategory ? Number(data.mainCategory) : null,
            timeCategory: data.timeCategory ? Number(data.timeCategory) : null,
            paymentType: data.paymentType ? Number(data.paymentType) : null,
            timezone: data.timezone ? Number(data.timezone) : null,
            start: toJstString(data.start),
            end: toJstString(data.end),
            wo: data.wo,
        };

        // Dataverse登録形式に変換
        const payload: Record<string, any> = {
            proto_name: record.title,
            proto_maincategory: record.mainCategory,
            proto_timecategory: record.timeCategory,
            proto_paymenttype: record.paymentType,
            proto_timezone: record.timezone,
            proto_startdatetime: record.start,
            proto_enddatetime: record.end,
        };

        if (record.wo) {
            payload["proto_wonumber@odata.bind"] = `/proto_workorders(${record.wo})`;
        }

        // Dataverse 登録
        if (xrm?.WebApi?.createRecord) {
            try {
                const result = await xrm.WebApi.createRecord(entityName, payload);
                console.log("Dataverse 登録成功:", result);
                return { ...record, id: result.id };
            } catch (error) {
                console.error("Dataverse 登録失敗:", error);
                throw error;
            }
        }

        // ローカル環境フォールバック
        const mockId = `local-${Date.now()}`;
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        const updated = [...existing, { ...record, id: mockId }];
        localStorage.setItem("localEvents", JSON.stringify(updated));

        console.log("ローカル登録:", record);
        return { ...record, id: mockId };
    },

    /** 更新 */
    async updateTimeEntry(id: string, data: TimeEntryInput): Promise<TimeEntryRecord> {
        const xrm = getXrm();
        const entityName = "proto_timeentry";

        const record: TimeEntryRecord = {
            id,
            title: data.title || "現場作業",
            mainCategory: data.mainCategory ? Number(data.mainCategory) : null,
            timeCategory: data.timeCategory ? Number(data.timeCategory) : null,
            paymentType: data.paymentType ? Number(data.paymentType) : null,
            timezone: data.timezone ? Number(data.timezone) : null,
            start: toJstString(data.start),
            end: toJstString(data.end),
            wo: data.wo,
        };

        const payload: Record<string, any> = {
            proto_name: record.title,
            proto_maincategory: record.mainCategory,
            proto_timecategory: record.timeCategory,
            proto_paymenttype: record.paymentType,
            proto_timezone: record.timezone,
            proto_startdatetime: record.start,
            proto_enddatetime: record.end,
        };

        if (record.wo) {
            payload["proto_wonumber@odata.bind"] = `/proto_workorders(${record.wo})`;
        }

        // Dataverse 更新
        if (xrm?.WebApi?.updateRecord) {
            try {
                await xrm.WebApi.updateRecord(entityName, id, payload);
                console.log("Dataverse 更新成功:", id);
                return record;
            } catch (error) {
                console.error("Dataverse 更新失敗:", error);
                throw error;
            }
        }

        // ローカル更新
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        const updated = existing.map((ev: any) => (ev.id === id ? { ...ev, ...record } : ev));
        localStorage.setItem("localEvents", JSON.stringify(updated));

        console.log("ローカル更新:", record);
        return record;
    },
};
