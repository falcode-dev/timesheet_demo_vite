import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getXrm } from "../utils/xrmUtils";
import { dataverseClient } from "../api/dataverseClient";
import { fromUtcToJst } from "../utils/dateUtils";

/** イベントデータ型 */
export type EventData = {
    id: string;
    title: string;
    start: string;
    end: string;
    workOrderId: string;
    maincategory?: number;
    timecategory?: number;
    paymenttype?: number;
    timezone?: string;
    extendedProps?: Record<string, any>;
};

/**
 * Dataverse またはローカルモックからイベント一覧を取得
 */
const fetchEvents = async (): Promise<EventData[]> => {
    const xrm = getXrm();

    // ローカル環境（モックデータ）
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
            {
                id: "2",
                title: "別WOの打合せ",
                start: "2025-10-14T13:00:00",
                end: "2025-10-14T14:00:00",
                workOrderId: "wo-002",
            },
        ];
    }

    // Dataverse 環境
    const entityName = "proto_workorder";
    const navigationName = "proto_timeentry_wonumber_proto_workorder";
    const userId = xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");

    const query =
        `?$select=proto_workorderid,proto_wonumber` +
        `&$filter=_createdby_value eq ${userId}` +
        `&$expand=${navigationName}(` +
        `$select=proto_timeentryid,proto_name,proto_startdatetime,proto_enddatetime,` +
        `proto_maincategory,proto_paymenttype,proto_timecategory,proto_timezone)`;

    const result = await xrm.WebApi.retrieveMultipleRecords(entityName, query);

    // データ整形
    return result.entities.flatMap((wo: any) =>
        (wo[navigationName] || []).map((t: any) => ({
            id: t.proto_timeentryid,
            title: t.proto_name || "作業",
            start: fromUtcToJst(t.proto_startdatetime),
            end: fromUtcToJst(t.proto_enddatetime),
            workOrderId: wo.proto_workorderid,
            maincategory: t.proto_maincategory,
            timecategory: t.proto_timecategory,
            paymenttype: t.proto_paymenttype,
            timezone: t.proto_timezone ?? null,
            extendedProps: {
                timezone: t.proto_timezone ?? null,
            },
        }))
    );
};

/**
 * イベント詳細を取得（既存データから取得、API呼び出しなし）
 */
const fetchEventDetail = async (id: string, allEvents: EventData[]) => {
    // 既存のイベントデータから検索
    const event = allEvents.find(e => e.id === id);
    if (!event) {
        console.warn("イベントが見つかりません:", id);
        return null;
    }

    return {
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        maincategory: event.maincategory?.toString(),
        timecategory: event.timecategory?.toString(),
        paymenttype: event.paymenttype?.toString(),
        timezone: event.timezone,
        workOrder: event.workOrderId,
    };
};

/**
 * イベント一覧・登録・更新・詳細取得を統合管理するフック
 */
export const useEvents = (selectedWO: string) => {
    const queryClient = useQueryClient();
    const xrm = getXrm();

    /** イベント一覧取得 */
    const {
        data: allEvents = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
    });

    /** 選択中の WorkOrder に対応するイベントを強調 */
    const events = allEvents.map((e) => ({
        ...e,
        extendedProps: {
            ...e.extendedProps,
            isTargetWO: selectedWO === "all" || e.workOrderId === selectedWO,
        },
    }));

    /** 登録・更新処理 */
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const isUpdate = !!data.id;

            // Dataverse 環境
            if (xrm) {
                return isUpdate
                    ? dataverseClient.updateTimeEntry(data.id, data)
                    : dataverseClient.createTimeEntry(data);
            }

            // ローカルモード
            const current = JSON.parse(localStorage.getItem("mockEvents") || "[]");
            if (isUpdate) {
                const updated = current.map((e: any) =>
                    e.id === data.id ? { ...e, ...data } : e
                );
                localStorage.setItem("mockEvents", JSON.stringify(updated));
            } else {
                const newItem = { ...data, id: String(Date.now()) };
                localStorage.setItem("mockEvents", JSON.stringify([...current, newItem]));
            }
            return true;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["events"] });
            await queryClient.refetchQueries({ queryKey: ["events"] });
        },
        onError: (err) => {
            console.error("TimeEntry登録/更新失敗:", err);
            alert("保存に失敗しました。詳細はコンソールを確認してください。");
        },
    });

    /** モーダル送信処理 */
    const handleSubmit = async (data: any) => {
        // 複数のデータ形式に対応
        let processedData: any;

        if (data.startDate && data.endDate) {
            // TimeEntryData型（複製処理で使用）の場合：TimeEntryInput型に変換
            const start = new Date(`${data.startDate}T${data.startHour}:${data.startMinute}`);
            const end = new Date(`${data.endDate}T${data.endHour}:${data.endMinute}`);

            processedData = {
                id: data.id,
                title: '現場作業', // デフォルトタイトル
                wo: data.wo || '',
                start: start,
                end: end,
                timezone: data.timezone || '',
                mainCategory: data.mainCategory || '',
                timeCategory: data.timeCategory || '',
                paymentType: data.paymentType || '',
            };
        } else if (data.start && data.end && typeof data.start === 'object' && typeof data.end === 'object') {
            // Event型（複製処理）またはTimeEntryModal型（新規・更新）の場合
            if (data.timecategory !== undefined || data.maincategory !== undefined) {
                // Event型の場合：TimeEntryInput型に変換
                processedData = {
                    id: data.id,
                    title: '現場作業', // デフォルトタイトル
                    wo: data.workOrder || '',
                    start: data.start,
                    end: data.end,
                    timezone: data.timezone || '',
                    mainCategory: data.maincategory || '',
                    timeCategory: data.timecategory || '',
                    paymentType: data.paymenttype || '',
                };
            } else {
                // TimeEntryModal型の場合：TimeEntryInput型に変換
                processedData = {
                    id: data.id,
                    title: '現場作業', // デフォルトタイトル
                    wo: data.wo || '',
                    start: data.start,
                    end: data.end,
                    timezone: data.timezone || '',
                    mainCategory: data.mainCategory || '',
                    timeCategory: data.timeCategory || '',
                    paymentType: data.paymentType || '',
                };
            }
        } else {
            // その他の場合：そのまま使用
            processedData = data;
        }

        await mutation.mutateAsync(processedData);
        await refetch();
    };

    return {
        events,
        isLoading,
        isError,
        refetchEvents: refetch,
        createOrUpdateEvent: handleSubmit,
        fetchEventDetail: (id: string) => fetchEventDetail(id, allEvents),
    };
};
