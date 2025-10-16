// src/hooks/useWorkOrders.ts
import { useQuery } from "@tanstack/react-query";
import { dataverseClient } from "../api/dataverseClient";

/** WorkOrderの取得Hook */
export const useWorkOrders = () => {
    const query = useQuery({
        queryKey: ["workOrders"],
        queryFn: dataverseClient.getWorkOrders,
    });
    return {
        workOrders: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        refetchWorkOrders: query.refetch,
    };
};
