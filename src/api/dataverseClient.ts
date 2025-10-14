import { getXrm } from "../utils/xrmUtils";

/** Dataverse WebAPI 共通クライアント */
export const dataverseClient = {
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
     * 🔹 オプションセットの取得
     * -------------------------------------------------- */
    async getOptionSets(entity: string, fields: string[]) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            const metadata = await xrm.Utility.getEntityMetadata(entity, fields);
            if (!metadata?.Attributes) return {};

            const attributes =
                typeof metadata.Attributes.get === "function"
                    ? fields.map((f) => metadata.Attributes.get(f)).filter(Boolean)
                    : metadata.Attributes;

            const getOptions = (logicalName: string) => {
                const attr = Array.isArray(attributes)
                    ? attributes.find((a: any) => a.LogicalName === logicalName)
                    : metadata.Attributes.get(logicalName);

                if (!attr || !attr.attributeDescriptor) return [];
                const options = attr.attributeDescriptor.OptionSet || [];

                return options.map((opt: any) => ({
                    value: String(opt.Value),
                    label: opt.Label || "(ラベル未定義)",
                }));
            };

            const result: Record<string, { value: string; label: string }[]> = {};
            fields.forEach((field) => {
                result[field] = getOptions(field);
            });

            return result;
        } catch (err) {
            console.error(`OptionSet取得失敗 (${entity}):`, err);
            throw err;
        }
    },

    /** --------------------------------------------------
     * 🔹 TimeZone 定義の取得
     * -------------------------------------------------- */
    async getTimeZones() {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            const result = await xrm.WebApi.retrieveMultipleRecords(
                "timezonedefinition",
                "?$select=timezonecode,standardname,userinterfacename"
            );

            return result.entities.map((t: any) => ({
                value: String(t.timezonecode),
                label: t.userinterfacename,
            }));
        } catch (err) {
            console.error("TimeZone取得失敗:", err);
            return [];
        }
    },

    // =====================================================
    // ✅ TimeEntry 登録処理（Dataverseへのcreate）
    // =====================================================
    async createTimeEntry(data: any) {
        const xrm = getXrm();
        const entityName = "cr0f8_timeentryid";

        const record: any = {
            cr0f8_name: data.title || "現場作業",
            // proto_timecategory: Number(data.timeCategory) || null,
            // proto_maincategory: Number(data.category) || null,
            cr0f8_category_type: Number(data.paymentType) || null,
            cr0f8_region: Number(data.paymentType) || null,
            cr0f8_startdatetime: toJstString(data.start),
            cr0f8_enddatetime: toJstString(data.end),
        };

        if (data.wo) {
            record["cr0f8_proto_worktask_timeentry@odata.bind"] = `/cr0f8_proto_worktasks(${data.wo})`;
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

        // ✅ ローカル環境用フォールバック
        console.log("💾 ローカル登録:", record);
        const mockId = `local-${Date.now()}`;
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        existing.push({ id: mockId, ...record });
        localStorage.setItem("localEvents", JSON.stringify(existing));
        return { id: mockId, ...record };
    },

    // =====================================================
    // ✅ TimeEntry 更新処理（Dataverseへのupdate）
    // =====================================================
    async updateTimeEntry(id: string, data: any) {
        const xrm = getXrm();
        const entityName = "cr0f8_timeentryid";

        const record: any = {
            cr0f8_name: data.title || "現場作業",
            // proto_timecategory: Number(data.timeCategory) || null,
            // proto_maincategory: Number(data.category) || null,
            cr0f8_category_type: Number(data.paymentType) || null,
            cr0f8_region: Number(data.paymentType) || null,
            cr0f8_startdatetime: toJstString(data.start),
            cr0f8_enddatetime: toJstString(data.end),
        };

        if (data.wo) {
            record["cr0f8_proto_worktask_timeentry@odata.bind"] = `/cr0f8_proto_worktasks(${data.wo})`;
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

        // ✅ ローカル環境用フォールバック
        console.log("💾 ローカル更新:", record);
        const existing = JSON.parse(localStorage.getItem("localEvents") || "[]");
        const updated = existing.map((ev: any) => (ev.id === id ? { ...ev, ...record } : ev));
        localStorage.setItem("localEvents", JSON.stringify(updated));
        return { id, ...record };
    },
};

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
