import { dataverseClient } from "./dataverseClient";

export type WorkOrder = {
    id: string;
    name: string;
};

export const fetchWorkOrderByUser = async (userId: string): Promise<WorkOrder[]> => {
    const records = await dataverseClient.retrieveMultiple(
        "cr0f8_proto_worktask",
        `?$select=cr0f8_proto_worktaskname&$filter=_createdby_value eq ${userId}`
    );
    return records.map((e: any) => ({
        id: e["cr0f8_proto_worktaskid"],
        name: e["cr0f8_proto_worktaskname"],
    }));
};
