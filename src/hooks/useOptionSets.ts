import { useQuery } from "@tanstack/react-query";
import { optionSetClient } from "../api/dataverseClient/optionSetClient";

/**
 * Dataverse から OptionSet 一覧を取得する関数
 * - 各属性ごとに並列で取得
 */
const fetchOptionSets = async (): Promise<{
    maincategory?: { value: string; label: string }[];
    timecategory?: { value: string; label: string }[];
    paymenttype?: { value: string; label: string }[];
    timezone?: { value: string; label: string }[];
}> => {
    const [maincategory, timecategory, paymenttype, timezone] = await Promise.all([
        optionSetClient.getOptionSets("proto_timeentry", ["proto_maincategory"]),
        optionSetClient.getOptionSets("proto_timeentry", ["proto_timecategory"]),
        optionSetClient.getOptionSets("proto_timeentry", ["proto_paymenttype"]),
        optionSetClient.getProtoTimeEntryTimeZones(),
    ]);

    return {
        maincategory: maincategory["proto_maincategory"] ?? [],
        timecategory: timecategory["proto_timecategory"] ?? [],
        paymenttype: paymenttype["proto_paymenttype"] ?? [],
        timezone,
    };
};

/**
 * OptionSet データを取得・キャッシュするカスタムフック
 * - React Query により自動キャッシュ・再取得管理を行う
 */
export const useOptionSets = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["optionSets"],
        queryFn: fetchOptionSets,
        staleTime: Infinity, // キャッシュを永続化（再取得しない）
    });

    return {
        /** 取得した OptionSet データ */
        optionSets: data ?? {},

        /** ローディング状態 */
        isLoading,

        /** エラー状態 */
        isError,
    };
};
