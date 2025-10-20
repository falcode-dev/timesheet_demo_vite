import { optionSetClient } from "./optionSetClient";
import { timeEntryClient } from "./timeEntryClient";
import { workOrderClient } from "./workOrderClient";
import { subcategoryClient } from "./subcategoryClient";
import { taskClient } from "./taskClient";

/**
 * Dataverse 各機能をまとめたエクスポートオブジェクト
 * - 各エンティティクライアントを統合して 1 つのクライアントとして利用可能
 */
export const dataverseClient = {
    ...optionSetClient,
    ...timeEntryClient,
    ...workOrderClient,
    ...subcategoryClient,
    ...taskClient,
};

// 型安全のため、個別 export も許可
export {
    optionSetClient,
    timeEntryClient,
    workOrderClient,
    subcategoryClient,
    taskClient,
};
