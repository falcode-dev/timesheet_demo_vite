import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import "./CalendarView.css";

interface CalendarViewProps {
    viewMode: "1日" | "3日" | "週";
    currentDate: Date;
    onDateChange: (newDate: Date) => void;
    onDateClick?: (range: { start: Date; end: Date }) => void;
    onEventClick?: (eventData: any) => void;
    events: any[];
}

/**
 * FullCalendar 表示コンポーネント
 * - currentDate 変更時にカレンダー移動
 * - viewMode に応じた表示切替
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    // onDateChange,
    onDateClick,
    onEventClick,
    events,
}) => {
    const calendarRef = useRef<FullCalendar>(null);

    // -------------------------------
    // 📅 currentDate が変わったら移動
    // -------------------------------
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.gotoDate(currentDate);
        }
    }, [currentDate]);

    // -------------------------------
    // 🔄 viewMode が変わったらビュー変更
    // -------------------------------
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        switch (viewMode) {
            case "1日":
                api.changeView("timeGridDay");
                break;
            case "3日":
                api.changeView("timeGridThreeDay");
                break;
            default:
                api.changeView("timeGridWeek");
                break;
        }
    }, [viewMode]);

    // -------------------------------
    // 📅 日付クリック・イベントクリック
    // -------------------------------
    const handleDateSelect = (selectInfo: any) => {
        onDateClick?.({ start: selectInfo.start, end: selectInfo.end });
    };

    const handleEventClick = (clickInfo: any) => {
        onEventClick?.(clickInfo.event);
    };

    // -------------------------------
    // ✅ JSX
    // -------------------------------
    return (
        <div className="calendar-wrapper">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable
                selectMirror
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
                headerToolbar={false}
                allDaySlot={false}
                slotDuration="00:30:00"
                height="100%"
                nowIndicator
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                locale={jaLocale}
                firstDay={1}
                initialDate={currentDate}
                views={{
                    // ✅ カスタム3日ビュー定義
                    timeGridThreeDay: {
                        type: "timeGrid",
                        duration: { days: 3 },
                        buttonText: "3日",
                    },
                }}
            />
        </div>
    );
};
