// src/hooks/useOptionSets.ts
import { useQuery } from "@tanstack/react-query";
import { dataverseClient } from "../api/dataverseClient";

/** OptionSet一覧を取得 */
const fetchOptionSets = async (): Promise<{
    maincategory?: { value: string; label: string }[];
    timecategory?: { value: string; label: string }[];
    paymenttype?: { value: string; label: string }[];
    timezone?: { value: string; label: string }[];
}> => {
    const [maincategory, timecategory, paymenttype, timezone] = await Promise.all([
        dataverseClient.getOptionSets("proto_timeentry", ["proto_maincategory"]),
        dataverseClient.getOptionSets("proto_timeentry", ["proto_timecategory"]),
        dataverseClient.getOptionSets("proto_timeentry", ["proto_paymenttype"]),
        dataverseClient.getTimeZones(),
    ]);

    return {
        maincategory: maincategory["proto_maincategory"] ?? [],
        timecategory: timecategory["proto_timecategory"] ?? [],
        paymenttype: paymenttype["proto_paymenttype"] ?? [],
        timezone,
    };
};

/** OptionSet取得Hook */
export const useOptionSets = () => {
    const query = useQuery({
        queryKey: ["optionSets"],
        queryFn: fetchOptionSets,
        staleTime: Infinity, // キャッシュ永続
    });
    return {
        optionSets: query.data ?? {},
        isLoading: query.isLoading,
        isError: query.isError,
    };
};
