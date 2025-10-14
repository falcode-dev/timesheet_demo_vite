import { useQuery } from "@tanstack/react-query";
import { useUserInfo } from "./useUserInfo";
import { fetchWorkOrderByUser } from "../api/workorder";
import { fetchTimeEntryByWorkOrder } from "../api/timeentry";
import { fetchTimeEntryOptionSets } from "../api/metadata";

// ============================
// ✅ OptionSet の柔軟な型
// ============================
export type OptionSetMap = Record<string, { value: string; label: string }[]>;

export const useDataverse = () => {
    const { data: user } = useUserInfo();

    // ============================
    // ✅ WorkOrder 取得
    // ============================
    const { data: workOrderList = [] } = useQuery({
        queryKey: ["workorder", user?.userId],
        queryFn: () => fetchWorkOrderByUser(user!.userId),
        enabled: !!user?.userId,
    });

    // ============================
    // ✅ TimeEntry 取得
    // ============================
    const firstWorkOrderId = workOrderList[0]?.id;
    const { data: timeEntryList = [] } = useQuery({
        queryKey: ["timeentry", firstWorkOrderId],
        queryFn: () => fetchTimeEntryByWorkOrder(firstWorkOrderId!),
        enabled: !!firstWorkOrderId,
    });

    // ============================
    // ✅ OptionSet / TimeZone 取得
    // ============================
    const { data: optionSets = {} } = useQuery<OptionSetMap>({
        queryKey: ["optionSets"],
        queryFn: fetchTimeEntryOptionSets,
        staleTime: Infinity,
    });

    // ============================
    // ✅ 戻り値
    // ============================
    return {
        user,
        workOrderList,
        timeEntryList,
        optionSets,
    };
};
