import { dataverseClient } from "../api/dataverseClient";

export const fetchTimeEntryOptionSets = async () => {
    const fields = ["cr0f8_category", "cr0f8_subcategory"];
    const result = await dataverseClient.getOptionSets("cr0f8_timeentryid", fields);

    // ✅ TimeZone は専用エンティティから取得
    const timezones = await dataverseClient.getTimeZones();

    return {
        category: result.cr0f8_category ?? [],
        status: result.cr0f8_subcategory ?? [],
        timezone: timezones,
    };
};
