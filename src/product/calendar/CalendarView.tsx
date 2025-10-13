import React from "react";
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

export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    onDateChange,
    onDateClick,
    onEventClick,
    events,
}) => {
    const handleDateSelect = (selectInfo: any) => {
        onDateClick?.({ start: selectInfo.start, end: selectInfo.end });
    };

    const handleEventClick = (clickInfo: any) => {
        onEventClick?.(clickInfo.event);
    };

    const getViewName = () => {
        switch (viewMode) {
            case "1日":
                return "timeGridDay";
            case "3日":
                return "timeGridThreeDay";
            default:
                return "timeGridWeek";
        }
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={getViewName()}
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
                    // ✅ カスタムビューを正しく定義
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
