// src/hooks/useAppController.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getXrm } from "../utils/xrmUtils";
import { dataverseClient } from "../api/dataverseClient";
import { getUrlParams } from "../utils/url";
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

interface OptionSets {
    maincategory?: { value: string; label: string }[];
    timecategory?: { value: string; label: string }[];
    paymenttype?: { value: string; label: string }[];
    timezone?: { value: string; label: string }[];
}

/* ===============================
   API取得関数群
=============================== */

/** WorkOrder一覧 */
const fetchWorkOrders = async (): Promise<{ id: string; name: string }[]> => {
    const xrm = getXrm();
    if (!xrm) {
        // ✅ ローカルモックデータ
        return [
            { id: "wo-001", name: "ワークオーダサンプル①" },
            { id: "wo-002", name: "ワークオーダサンプル②" },
        ];
    }

    const result = await xrm.WebApi.retrieveMultipleRecords(
        "proto_workorder",
        "?$select=proto_workorderid,proto_wonumber"
    );
    return result.entities.map((r: any) => ({
        id: r.proto_workorderid,
        name: r.proto_wonumber,
    }));
};

/** OptionSet一覧 */
const fetchOptionSets = async (): Promise<OptionSets> => {
    const maincategory = await dataverseClient.getOptionSets("proto_timeentry", ["proto_maincategory"]);
    const timecategory = await dataverseClient.getOptionSets("proto_timeentry", ["proto_timecategory"]);
    const paymenttype = await dataverseClient.getOptionSets("proto_timeentry", ["proto_paymenttype"]);
    const timezone = await dataverseClient.getTimeZones();

    return {
        maincategory: maincategory["proto_maincategory"] || [],
        timecategory: timecategory["proto_timecategory"] || [],
        paymenttype: paymenttype["proto_paymenttype"] || [],
        timezone,
    };
};

/** TimeEntry一覧 */
const fetchEvents = async (selectedWO: string): Promise<EventData[]> => {
    const xrm = getXrm();

    // ✅ ローカルモック（Dataverseなし環境用）
    if (!xrm) {
        const localMock = JSON.parse(localStorage.getItem("mockEvents") || "[]");
        return localMock.length
            ? localMock
            : [
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
   useAppController本体
=============================== */
export const useAppController = () => {
    const { recordid } = getUrlParams();
    const queryClient = useQueryClient();
    const xrm = getXrm();

    // -----------------------------
    // UI状態
    // -----------------------------
    const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
    const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">("週");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    // -----------------------------
    // データ取得（React Query）
    // -----------------------------
    const { data: workOrders = [] } = useQuery({
        queryKey: ["workOrders"],
        queryFn: fetchWorkOrders,
    });

    const { data: optionSets = {} } = useQuery({
        queryKey: ["optionSets"],
        queryFn: fetchOptionSets,
        staleTime: Infinity,
    });

    const {
        data: events = [],
        refetch: refetchEvents,
    } = useQuery({
        queryKey: ["events", selectedWO],
        queryFn: () => fetchEvents(selectedWO),
        enabled: !!selectedWO,
    });

    // -----------------------------
    // TimeEntry 登録・更新
    // -----------------------------
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const isUpdate = !!data.id;

            // ✅ Dataverseありの場合
            if (xrm) {
                return isUpdate
                    ? dataverseClient.updateTimeEntry(data.id, data)
                    : dataverseClient.createTimeEntry(data);
            }

            // ✅ ローカルモード：localStorageを直接操作
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

    // ✅ モーダル送信処理
    const handleTimeEntrySubmit = async (data: any) => {
        await mutation.mutateAsync(data);
        await refetchEvents(); // ✅ Dataverseでもローカルでも即反映
        setIsTimeEntryModalOpen(false);
        setSelectedEvent(null);
        setSelectedDateTime(null);
    };

    // -----------------------------
    // カレンダー操作
    // -----------------------------
    const getShiftDays = () => (viewMode === "1日" ? 1 : viewMode === "3日" ? 3 : 7);
    const handlePrev = () => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - getShiftDays())));
    const handleNext = () => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + getShiftDays())));
    const handleToday = () => setCurrentDate(new Date());

    // -----------------------------
    // 返却値
    // -----------------------------
    return {
        // データ
        workOrders,
        optionSets,
        events,

        // ステート
        selectedWO,
        setSelectedWO,
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        isTimeEntryModalOpen,
        setIsTimeEntryModalOpen,
        selectedDateTime,
        setSelectedDateTime,
        selectedEvent,
        setSelectedEvent,

        // 操作
        handleTimeEntrySubmit,
        handlePrev,
        handleNext,
        handleToday,

        // 手動リフェッチ
        refetchEvents,
    };
};
