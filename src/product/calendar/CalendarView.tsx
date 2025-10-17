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
    onDateChange?: (newDate: Date) => void;
    onDateClick?: (range: { start: Date; end: Date }) => void;
    onEventClick?: (eventData: any) => void;
    events: any[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    onDateChange,
    onDateClick,
    onEventClick,
    events,
}) => {
    const calendarRef = useRef<FullCalendar>(null);

    // -------------------------------
    // 📅 currentDate が変わったらカレンダー移動
    // -------------------------------
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;
        // FullCalendar 側がすでに同じ日付を表示しているならスキップ
        const calendarDate = api.getDate();
        if (calendarDate.toDateString() !== currentDate.toDateString()) {
            api.gotoDate(currentDate);
        }
    }, [currentDate]);

    // -------------------------------
    // 🔄 viewMode 変更
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
    // 📅 日付選択
    // -------------------------------
    const handleDateSelect = (selectInfo: any) => {
        onDateClick?.({ start: selectInfo.start, end: selectInfo.end });
    };

    // -------------------------------
    // 🎯 イベントクリック
    // -------------------------------
    const handleEventClick = (clickInfo: any) => {
        const { id, title, start, end, extendedProps } = clickInfo.event;
        onEventClick?.({ id, title, start, end, extendedProps });
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
                locale={jaLocale}
                firstDay={1}
                initialDate={currentDate}
                views={{
                    timeGridThreeDay: {
                        type: "timeGrid",
                        duration: { days: 3 },
                        buttonText: "3日",
                    },
                }}
                eventClassNames={(arg) => {
                    const { isTargetWO } = arg.event.extendedProps;
                    return isTargetWO ? ["highlight-event"] : [];
                }}
                datesSet={(info) => {
                    const newDate = info.start;
                    if (
                        onDateChange &&
                        newDate.toDateString() !== currentDate.toDateString()
                    ) {
                        onDateChange(newDate);
                    }
                }}
            />

        </div>
    );
};
