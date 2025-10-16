// src/hooks/useEvents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getXrm } from "../utils/xrmUtils";
import { dataverseClient } from "../api/dataverseClient";
import { fromUtcToJst } from "../utils/dateUtils";

/* ===============================
   型定義
=============================== */
export interface EventData {
    id: string;
    title: string;
    start: string;
    end: string;
    workOrderId: string;
    extendedProps?: Record<string, any>;
}

/* ===============================
   イベント一覧取得
=============================== */
const fetchEvents = async (selectedWO: string): Promise<EventData[]> => {
    const xrm = getXrm();

    // ✅ ローカルモック
    if (!xrm) {
        const localMock = JSON.parse(localStorage.getItem("mockEvents") || "[]");
        if (localMock.length > 0) return localMock;
        return [
            {
                id: "1",
                title: "モック会議",
                start: "2025-10-14T09:00:00",
                end: "2025-10-14T10:00:00",
                workOrderId: "wo-001",
            },
        ];
    }

    // ✅ Dataverse環境
    const entityName = "proto_workorder";
    const navigationName = "proto_timeentry_wonumber_proto_workorder";
    const globalCtx = xrm.Utility.getGlobalContext();
    const userId = globalCtx.userSettings.userId.replace(/[{}]/g, "");

    const query =
        `?$select=proto_workorderid,proto_wonumber&$filter=_createdby_value eq ${userId}` +
        `&$expand=${navigationName}(` +
        `$select=proto_timeentryid,proto_name,proto_startdatetime,proto_enddatetime,` +
        `proto_maincategory,proto_paymenttype,proto_timecategory` +
        `)`;

    const result = await xrm.WebApi.retrieveMultipleRecords(entityName, query);

    const formatted: EventData[] = result.entities.flatMap((wo: any) =>
        (wo[navigationName] || []).map((t: any) => ({
            id: t.proto_timeentryid,
            title: t.proto_name || "作業",
            start: fromUtcToJst(t.proto_startdatetime),
            end: fromUtcToJst(t.proto_enddatetime),
            workOrderId: wo.proto_workorderid,
        }))
    );

    return selectedWO === "all"
        ? formatted
        : formatted.filter((e) => e.workOrderId === selectedWO);
};

/* ===============================
   🔹 イベント詳細取得（クリック時用）
=============================== */
const fetchEventDetail = async (id: string) => {
    const xrm = getXrm();

    if (!xrm) {
        // ✅ ローカル環境: localStorageから該当イベントを取得
        const local = JSON.parse(localStorage.getItem("mockEvents") || "[]");
        return local.find((e: any) => e.id === id);
    }

    // ✅ Dataverse環境
    const entityName = "proto_timeentry";
    const query =
        `?$select=proto_name,proto_startdatetime,proto_enddatetime,` +
        `proto_maincategory,proto_paymenttype,proto_timecategory` +
        `&$expand=proto_wonumber($select=proto_wonumber,proto_workorderid)`;

    const record = await dataverseClient.retrieve(entityName, id, query);

    // ✅ 必要に応じて UTC→JST 変換
    return {
        id,
        title: record.proto_name,
        start: fromUtcToJst(record.proto_startdatetime),
        end: fromUtcToJst(record.proto_enddatetime),
        maincategory: record.proto_maincategory,
        timecategory: record.proto_timecategory,
        paymenttype: record.proto_paymenttype,
        workOrder: record.proto_wonumber?.proto_workorderid,
        workOrderDesc: record.proto_wonumber?.proto_description,
    };
};

/* ===============================
   useEvents本体
=============================== */
export const useEvents = (selectedWO: string) => {
    const queryClient = useQueryClient();
    const xrm = getXrm();

    // 一覧取得
    const eventsQuery = useQuery({
        queryKey: ["events", selectedWO],
        queryFn: () => fetchEvents(selectedWO),
        enabled: !!selectedWO,
    });

    // 登録・更新
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const isUpdate = !!data.id;

            if (xrm) {
                return isUpdate
                    ? dataverseClient.updateTimeEntry(data.id, data)
                    : dataverseClient.createTimeEntry(data);
            }

            // ✅ ローカルモード
            const current = JSON.parse(localStorage.getItem("mockEvents") || "[]");
            if (isUpdate) {
                const updated = current.map((e: any) => (e.id === data.id ? { ...e, ...data } : e));
                localStorage.setItem("mockEvents", JSON.stringify(updated));
            } else {
                const newItem = { ...data, id: String(Date.now()) };
                localStorage.setItem("mockEvents", JSON.stringify([...current, newItem]));
            }
            return true;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["events", selectedWO] });
            await queryClient.refetchQueries({ queryKey: ["events", selectedWO] });
        },
        onError: (err) => {
            console.error("❌ TimeEntry登録/更新失敗:", err);
            alert("保存に失敗しました。詳細はコンソールを確認してください。");
        },
    });

    // モーダルから呼ばれる送信関数
    const handleSubmit = async (data: any) => {
        await mutation.mutateAsync(data);
        await eventsQuery.refetch();
    };

    return {
        // 一覧
        events: eventsQuery.data ?? [],
        isLoading: eventsQuery.isLoading,
        isError: eventsQuery.isError,
        refetchEvents: eventsQuery.refetch,

        // 登録・更新
        createOrUpdateEvent: handleSubmit,

        // ✅ 新規追加：詳細取得
        fetchEventDetail,
    };
};
