import { useQuery } from "@tanstack/react-query";
import { useUserInfo } from "./useUserInfo";
import { fetchWorkOrderByUser } from "../api/workorder";
import { fetchTimeEntryByWorkOrder } from "../api/timeentry";
import { fetchTimeEntryOptionSets } from "../api/metadata";

export const useDataverse = () => {
    const { data: user } = useUserInfo();

    // Entity A
    const { data: workOrderList = [] } = useQuery({
        queryKey: ["workorder", user?.userId],
        queryFn: () => fetchWorkOrderByUser(user!.userId),
        enabled: !!user?.userId,
    });

    // Entity B（Entity Aの最初のIDで取得）
    const firstWorkOrderId = workOrderList[0]?.id;
    const { data: timeEntryList = [] } = useQuery({
        queryKey: ["timeentry", firstWorkOrderId],
        queryFn: () => fetchTimeEntryByWorkOrder(firstWorkOrderId!),
        enabled: !!firstWorkOrderId,
    });

    // 選択肢・タイムゾーン
    const { data: optionSets } = useQuery({
        queryKey: ["optionSets"],
        queryFn: fetchTimeEntryOptionSets,
        staleTime: Infinity,
    });

    return {
        user,
        workOrderList,
        timeEntryList,
        optionSets,
    };
};
