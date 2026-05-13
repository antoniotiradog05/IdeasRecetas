import { useState } from 'react';

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function useWeek() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const goNext = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goPrev = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goToday = () => setWeekStart(getMonday(new Date()));

  const formatRange = () => {
    const opts = { day: 'numeric', month: 'short' };
    return `${weekStart.toLocaleDateString('es-ES', opts)} – ${weekEnd.toLocaleDateString('es-ES', { ...opts, year: 'numeric' })}`;
  };

  return {
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(weekEnd),
    days,
    dayLabels,
    goNext,
    goPrev,
    goToday,
    formatRange,
    isToday: (date) => formatDate(new Date()) === formatDate(date)
  };
}
