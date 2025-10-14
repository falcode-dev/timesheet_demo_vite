import { useState, useEffect } from "react";
import { getXrm } from "../utils/xrmUtils";
import { dataverseClient } from "../api/dataverseClient";

/** Dataverse UTC → JST 補正 */
const fromUtcToJst = (datetimeString: string): string => {
    if (!datetimeString) return "";
    const date = new Date(datetimeString);
    const corrected = new Date(date.getTime() - 9 * 60 * 60 * 1000);
    return corrected.toISOString();
};

/** URLパラメータ取得ユーティリティ */
const getUrlParams = (): Record<string, string> => {
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
        obj[key.toLowerCase()] = value;
    });
    return obj;
};

export interface EventData {
    id: string;
    title: string;
    start: string;
    end: string;
    workOrderId: string;
    extendedProps?: Record<string, any>;
}

export const useAppController = () => {
    const { recordid } = getUrlParams();

    // ----------------------------
    // 状態管理
    // ----------------------------
    const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
    const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">("週");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    const [workOrders, setWorkOrders] = useState<{ id: string; name: string }[]>([]);
    const [events, setEvents] = useState<EventData[]>([]);
    const [optionSets, setOptionSets] = useState<{
        category?: { value: string; label: string }[];
        status?: { value: string; label: string }[];
        timezone?: { value: string; label: string }[];
    }>({});

    // ----------------------------
    // WorkOrder 取得
    // ----------------------------
    const fetchWorkOrders = async () => {
        const xrm = getXrm();
        if (!xrm) {
            setWorkOrders([
                { id: "wo-001", name: "サンプル現場A" },
                { id: "wo-002", name: "サンプル現場B" },
            ]);
            return;
        }

        try {
            const result = await xrm.WebApi.retrieveMultipleRecords(
                "proto_workorder",
                "?$select=proto_workorderid,proto_wonumber"
            );
            const mapped = result.entities.map((r: any) => ({
                id: r.proto_workorderid,
                name: r.proto_wonumber,
            }));
            setWorkOrders(mapped);
        } catch (err) {
            console.error("❌ WorkOrder取得失敗:", err);
        }
    };

    // ----------------------------
    // OptionSet 取得
    // ----------------------------
    const fetchOptionSets = async () => {
        try {
            const category = await dataverseClient.getOptionSets("proto_timeentry", ["proto_maincategory"]);
            const status = await dataverseClient.getOptionSets("proto_timeentry", ["proto_paymenttype"]);
            const timezone = await dataverseClient.getTimeZones();
            setOptionSets({
                category: category["proto_maincategory"] || [],
                status: status["proto_paymenttype"] || [],
                timezone,
            });
        } catch (err) {
            console.error("❌ OptionSet取得失敗:", err);
        }
    };

    // ----------------------------
    // TimeEntry 取得
    // ----------------------------
    const fetchEvents = async () => {
        const xrm = getXrm();
        if (!xrm) {
            setEvents([
                {
                    id: "1",
                    title: "モック会議",
                    start: "2025-10-14T09:00:00",
                    end: "2025-10-14T10:00:00",
                    workOrderId: "wo-001",
                },
            ]);
            return;
        }

        try {
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

            setEvents(selectedWO === "all" ? formatted : formatted.filter((e) => e.workOrderId === selectedWO));
        } catch (err) {
            console.error("❌ TimeEntry取得失敗:", err);
        }
    };

    // ----------------------------
    // TimeEntry 登録・更新
    // ----------------------------
    const handleTimeEntrySubmit = async (data: any) => {
        try {
            const isUpdate = data.id && events.some((ev) => ev.id === data.id);
            let result: any;

            if (isUpdate) {
                result = await dataverseClient.updateTimeEntry(data.id, data);
                setEvents((prev) =>
                    prev.map((ev) =>
                        ev.id === data.id
                            ? { ...ev, title: result.proto_name, start: data.start, end: data.end }
                            : ev
                    )
                );
            } else {
                result = await dataverseClient.createTimeEntry(data);
                const newEvent = {
                    id: result.id,
                    title: result.proto_name || "新しい作業",
                    start: data.start,
                    end: data.end,
                    workOrderId: selectedWO !== "all" ? selectedWO : "unknown",
                };
                setEvents((prev) => [...prev, newEvent]);
            }

            setIsTimeEntryModalOpen(false);
            setTimeout(() => {
                fetchEvents();
                fetchOptionSets();
            }, 800);
        } catch (err) {
            console.error("❌ TimeEntry登録/更新失敗:", err);
            alert("保存に失敗しました。詳細はコンソールを確認してください。");
        }
    };

    // ----------------------------
    // カレンダー操作
    // ----------------------------
    const getShiftDays = () => (viewMode === "1日" ? 1 : viewMode === "3日" ? 3 : 7);

    const handlePrev = () => {
        const days = getShiftDays();
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - days);
            return newDate;
        });
    };

    const handleNext = () => {
        const days = getShiftDays();
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    const handleToday = () => setCurrentDate(new Date());

    // ----------------------------
    // 初期データ取得
    // ----------------------------
    useEffect(() => {
        fetchWorkOrders();
        fetchOptionSets();
        fetchEvents();
    }, [selectedWO]);

    // ----------------------------
    // 返却
    // ----------------------------
    return {
        workOrders,
        optionSets,
        events,
        setEvents,
        selectedWO,
        setSelectedWO,
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate, // ✅ これを追加
        isTimeEntryModalOpen,
        setIsTimeEntryModalOpen,
        selectedDateTime,
        setSelectedDateTime,
        selectedEvent,
        setSelectedEvent,
        handleTimeEntrySubmit,
        handlePrev,
        handleNext,
        handleToday,
    };
};
