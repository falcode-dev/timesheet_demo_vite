// src/api/dataverseClient/index.ts
import { baseClient } from "./baseClient";
import { optionSetClient } from "./optionSetClient";
import { timeEntryClient } from "./timeEntryClient";
import { workOrderClient } from "./workOrderClient";

/**
 * Dataverse 各機能をまとめたエクスポートオブジェクト
 */
export const dataverseClient = {
    ...baseClient,
    ...optionSetClient,
    ...timeEntryClient,
    ...workOrderClient,
};

// 型安全のため、個別exportも許可
export {
    baseClient,
    optionSetClient,
    timeEntryClient,
    workOrderClient,
};
