import { optionSetClient } from "./optionSetClient";
import { timeEntryClient } from "./timeEntryClient";
import { workOrderClient } from "./workOrderClient";

/**
 * Dataverse 各機能をまとめたエクスポートオブジェクト
 */
export const dataverseClient = {
    ...optionSetClient,
    ...timeEntryClient,
    ...workOrderClient,
};

// 型安全のため、個別exportも許可
export {
    optionSetClient,
    timeEntryClient,
    workOrderClient,
};
