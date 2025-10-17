import { getXrm } from "../../utils/xrmUtils";

/** OptionSet の要素型 */
export type OptionItem = {
    value: string;
    label: string;
};

/** OptionSet 一覧の戻り値型 */
export type OptionSetMap = Record<string, OptionItem[]>;

/**
 * OptionSet および TimeZone 定義を取得する Dataverse クライアント
 */
export const optionSetClient = {
    /**
     * 指定されたエンティティと属性フィールドの OptionSet を取得
     * @param entity 対象エンティティ名
     * @param fields 対象フィールド配列
     */
    async getOptionSets(entity: string, fields: string[]): Promise<OptionSetMap> {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            const metadata = await xrm.Utility.getEntityMetadata(entity, fields);
            if (!metadata?.Attributes) return {};

            const attributes =
                typeof metadata.Attributes.get === "function"
                    ? fields.map((f) => metadata.Attributes.get(f)).filter(Boolean)
                    : metadata.Attributes;

            /** 単一属性から OptionSet 値一覧を抽出 */
            const getOptions = (logicalName: string): OptionItem[] => {
                const attr = Array.isArray(attributes)
                    ? attributes.find((a: any) => a.LogicalName === logicalName)
                    : metadata.Attributes.get(logicalName);

                if (!attr?.attributeDescriptor?.OptionSet?.Options) return [];

                return attr.attributeDescriptor.OptionSet.Options.map((opt: any) => ({
                    value: String(opt.Value),
                    label: opt.Label?.LocalizedLabels?.[0]?.Label || "(ラベル未定義)",
                }));
            };

            // すべての対象フィールドに対して OptionSet を取得
            const result: OptionSetMap = {};
            fields.forEach((field) => {
                result[field] = getOptions(field);
            });

            return result;
        } catch (error) {
            console.error(`OptionSet取得エラー (${entity}):`, error);
            throw error;
        }
    },

    /**
     * Dataverse の全タイムゾーン定義を取得
     * @returns タイムゾーン配列（timezonecode, userinterfacename）
     */
    async getTimeZones(): Promise<OptionItem[]> {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            const result = await xrm.WebApi.retrieveMultipleRecords(
                "timezonedefinition",
                "?$select=timezonecode,userinterfacename"
            );

            return result.entities.map((t: any) => ({
                value: String(t.timezonecode),
                label: t.userinterfacename,
            }));
        } catch (error) {
            console.error("TimeZone取得エラー:", error);
            return [];
        }
    },

    /**
     * proto_timeentry エンティティのタイムゾーン列を取得
     * - OptionSet列 or Lookup列 のどちらにも対応
     */
    async getProtoTimeEntryTimeZones(): Promise<OptionItem[]> {
        const xrm = getXrm();
        if (!xrm) throw new Error("Xrm 環境が存在しません。");

        try {
            // まず OptionSet として取得を試みる
            const options = await optionSetClient.getOptionSets("proto_timeentry", ["proto_timezone"]);
            if (options["proto_timezone"]?.length) {
                return options["proto_timezone"];
            }

            // OptionSetが存在しない場合は timezonedefinition から取得
            return await optionSetClient.getTimeZones();
        } catch (error) {
            console.error("proto_timeentry タイムゾーン取得エラー:", error);
            return [];
        }
    },
};
