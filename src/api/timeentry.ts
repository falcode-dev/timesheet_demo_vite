import { dataverseClient } from "./dataverseClient";

export type TimeEntry = {
    id: string;
    name: string;
    start: string;
    end: string;
};

export const fetchTimeEntryByWorkOrder = async (workOrderId: string): Promise<TimeEntry[]> => {
    const records = await dataverseClient.retrieveMultiple(
        "cr0f8_timeentryid",
        `?$select=cr0f8_name,cr0f8_startdatetime,cr0f8_enddatetime,_cr0f8_proto_worktask_timeentry_value&$filter=_cr0f8_proto_worktask_timeentry_value eq ${workOrderId}`
    );
    return records.map((e: any) => ({
        id: e["cr0f8_timeentryidid"],
        name: e["cr0f8_name"],
        start: e["cr0f8_startdatetime"],
        end: e["cr0f8_enddatetime"],
    }));
};
