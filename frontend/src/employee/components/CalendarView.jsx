import React, { useMemo, useState } from 'react';

// events: Array of { eventDate, eventType, location, status, _id }
// onSelectDate?: (date, eventsForDate) => void
const CalendarView = ({ events = [], onSelectDate }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!e?.eventDate) return;
      const d = new Date(e.eventDate);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const weeks = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const chunks = [];
    for (let i = 0; i < cells.length; i += 7) {
      chunks.push(cells.slice(i, i + 7));
    }
    return chunks;
  }, [currentMonth, startDay, daysInMonth]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goPrev = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const goNext = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'in-progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  const renderDayCell = (date) => {
    if (!date) {
      return <div className="h-24 border border-gray-100 bg-gray-50" />;
    }
    const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    const items = eventsByDate[key] || [];
    const isToday = isSameDay(date, today);
    return (
      <button
        onClick={() => onSelectDate && onSelectDate(date, items)}
        className={`h-24 w-full border border-gray-100 p-2 text-left hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : 'bg-white'}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${isToday ? 'text-[#2563EB]' : 'text-gray-600'}`}>{date.getDate()}</span>
          {items.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {items.length}
            </span>
          )}
        </div>
        <div className="mt-2 space-y-1">
          {items.slice(0, 2).map((ev) => (
            <div key={ev._id || ev.id} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(ev.status)}`} />
              <span className="truncate text-xs text-[#1E293B]">{ev.eventType || 'Event'}</span>
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-[10px] text-gray-500">+{items.length - 2} more</div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="px-2 py-1 rounded hover:bg-gray-100">◀</button>
          <h3 className="text-lg font-semibold text-[#1E293B]">{monthLabel}</h3>
          <button onClick={goNext} className="px-2 py-1 rounded hover:bg-gray-100">▶</button>
        </div>
        <div className="hidden md:flex gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> In Progress</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Completed</span>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="px-2 py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0">
        {weeks.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((date, di) => (
              <div key={`${wi}-${di}`}>{renderDayCell(date)}</div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;


