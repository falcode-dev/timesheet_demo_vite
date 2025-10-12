import { getXrm } from "../utils/xrmUtils";

/** Dataverse WebAPI 共通クライアント */
export const dataverseClient = {
    async retrieveMultiple(entity: string, query: string) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");
        const result = await xrm.WebApi.retrieveMultipleRecords(entity, query);
        return result.entities;
    },

    /** --------------------------------------------------
     * 🎛️ OptionSet（選択肢列）取得
     * --------------------------------------------------
     * 複数列対応・Map/Array両対応
     * useOptionSets の実装方針を踏襲
     */
    async getOptionSets(entity: string, fields: string[]) {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            const metadata = await xrm.Utility.getEntityMetadata(entity, fields);
            if (!metadata?.Attributes) return {};

            // Dataverse環境によってはMap型か配列型のどちらかになる
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

            // フィールドごとのOptionSetをまとめて返す
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
};
