import { useQuery } from "@tanstack/react-query";
import { resourceClient } from "../api/dataverseClient/resourceClient";

/**
 * BookableResource 一覧取得用フック
 */
export const useResources = () => {
    const query = useQuery({
        queryKey: ["resources"],
        queryFn: () => resourceClient.getResources(),
    });

    return {
        resources: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
    };
};
