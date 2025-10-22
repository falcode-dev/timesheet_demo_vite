import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import enLocale from "@fullcalendar/core/locales/en-gb";
import "./CalendarView.css";
import { useTranslation } from "react-i18next";

/** カレンダービューモード */
export type CalendarViewMode = "1日" | "3日" | "週";

/** CalendarView コンポーネントの Props */
export type CalendarViewProps = {
    viewMode: CalendarViewMode;
    currentDate: Date;
    onDateChange?: (newDate: Date) => void;
    onDateClick?: (range: { start: Date; end: Date }) => void;
    onEventClick?: (eventData: {
        id: string;
        title: string;
        start: Date;
        end: Date;
        extendedProps?: Record<string, any>;
    }) => void;
    events: EventInput[];
};

/**
 * FullCalendar ラッパーコンポーネント
 * - Dataverse の個人言語設定に応じた多言語対応
 * - 週／3日／1日の切替
 * - イベントクリック／日付選択ハンドリング
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    onDateChange,
    onDateClick,
    onEventClick,
    events,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const { i18n } = useTranslation();

    /** 言語に応じた FullCalendar locale の選択 */
    const currentLocale = i18n.language.startsWith("ja") ? jaLocale : enLocale;

    /** currentDate が変化した際にカレンダー表示を同期 */
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;
        const displayedDate = api.getDate();
        if (displayedDate.toDateString() !== currentDate.toDateString()) {
            api.gotoDate(currentDate);
        }
    }, [currentDate]);

    /** viewMode に応じて表示モード切替 */
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        const modeToView = {
            "1日": "timeGridDay",
            "3日": "timeGridThreeDay",
            "週": "timeGridWeek",
        } as const;

        api.changeView(modeToView[viewMode]);
    }, [viewMode]);

    /** 日付範囲選択時 */
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        onDateClick?.({ start: selectInfo.start, end: selectInfo.end });
    };

    /** イベントクリック時 */
    const handleEventClick = (clickInfo: EventClickArg) => {
        const { id, title, start, end, extendedProps } = clickInfo.event;
        onEventClick?.({
            id: String(id),
            title: String(title),
            start: start as Date,
            end: end as Date,
            extendedProps,
        });
    };

    /** 表示範囲変更時（日付が変わった時） */
    const handleDatesSet = (info: any) => {
        const newDate = info.start;
        if (
            onDateChange &&
            newDate.toDateString() !== currentDate.toDateString()
        ) {
            onDateChange(newDate);
        }
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={false}
                selectable
                selectMirror
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
                allDaySlot={false}
                slotDuration="00:30:00"
                height="100%"
                nowIndicator
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false
                }}
                dayHeaderFormat={{
                    day: 'numeric',
                    weekday: 'short'
                }}
                locale={currentLocale}
                firstDay={1}
                initialDate={currentDate}
                views={{
                    timeGridThreeDay: {
                        type: "timeGrid",
                        duration: { days: 3 },
                        // ✅ i18n連動：FullCalendar内部ボタンも翻訳
                        buttonText: i18n.language.startsWith("ja") ? "3日" : "3 Days",
                    },
                }}
                eventClassNames={(arg) =>
                    arg.event.extendedProps?.isTargetWO ? ["highlight-event"] : []
                }
                datesSet={handleDatesSet}
            />
        </div>
    );
};
