import { useQuery } from "@tanstack/react-query";
import { userClient } from "../api/dataverseClient/userClient";

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => userClient.getCurrentUser(),
    });

    return {
        currentUser: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};
