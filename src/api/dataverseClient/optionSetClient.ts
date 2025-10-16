// src/api/dataverseClient/optionSetClient.ts
import { getXrm } from "../../utils/xrmUtils";

/**
 * OptionSet および TimeZone 定義の取得クライアント
 */
export const optionSetClient = {
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
            console.error(`❌ OptionSet取得失敗 (${entity}):`, err);
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
            console.error("❌ TimeZone取得失敗:", err);
            return [];
        }
    },
};
