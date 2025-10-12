import { getXrm } from "../utils/xrmUtils";

/** Dataverse WebAPI 共通クライアント */
export const dataverseClient = {
    async retrieveMultiple(entity: string, query: string) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");
        const result = await xrm.WebApi.retrieveMultipleRecords(entity, query);
        return result.entities;
    },

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
     * 🌐 TimeZone 定義の取得（別エンティティから取得）
     * --------------------------------------------------
     * TimeZone は OptionSet ではなく timezonedefinition エンティティに存在
     */
    async getTimeZones() {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            // 例: timezonedefinition の DisplayName と StandardName を取得
            const result = await xrm.WebApi.retrieveMultipleRecords(
                "timezonedefinition",
                "?$select=timezonecode,standardname,userinterfacename"
            );

            return result.entities.map((t: any) => ({
                value: String(t.timezonecode),
                // label: t.displayname || t.standardname || `(コード: ${t.timezonecode})`,
                label: t.userinterfacename,
            }));
        } catch (err) {
            console.error("TimeZone取得失敗:", err);
            return [];
        }
    },
};
