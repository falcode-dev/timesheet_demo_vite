import { dataverseClient } from "./dataverseClient";

export type OptionItem = { label: string; value: string };

export const fetchTimeEntryOptionSets = async () => {
    // まとめて取得（3列同時）
    const fields = ["cr0f8_category", "cr0f8_subcategory", "cr0f8_region"];

    // getOptionSets は { [fieldName]: OptionItem[] } を返す
    const result = await dataverseClient.getOptionSets("cr0f8_timeentryid", fields);

    return {
        category: result.cr0f8_category ?? [],
        status: result.cr0f8_subcategory ?? [],
        timezone: result.cr0f8_region ?? [],
    };
};
