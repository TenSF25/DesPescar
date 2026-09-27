import { useRef, useMemo, useEffect } from 'react';

interface CarouselDate {
  rawDate: Date;
  formatted: string;
  isToday: boolean;
  isSelected: boolean;
  id: string;
}

export const useDateCarousel = (selectedDate: string) => {
  const containerDates = useRef<HTMLDivElement | null>(null);
  const dateActive = useRef<HTMLButtonElement | null>(null);

  const isBaseDateToday = useMemo(() => {
    if (!selectedDate) return false;
    const baseDate = new Date(selectedDate + 'T00:00:00');
    const today = new Date();

    return (
      baseDate.getDate() === today.getDate() &&
      baseDate.getMonth() === today.getMonth() &&
      baseDate.getFullYear() === today.getFullYear()
    );
  }, [selectedDate]);

  const datesList = useMemo((): CarouselDate[] => {
    if (!selectedDate) return [];

    const baseDate = new Date(selectedDate + 'T00:00:00');
    const today = new Date();
    const baseDateReset = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const todayReset = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = baseDateReset.getTime() - todayReset.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const daysToGoBack = Math.max(0, Math.min(15, diffDays));
    const startOffset = -daysToGoBack;
    const endOffset = 29 - daysToGoBack;

    const list: CarouselDate[] = [];
    const formatterWeekday = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });
    const formatterMonth = new Intl.DateTimeFormat('es-AR', { month: 'short' });

    for (let i = startOffset; i <= endOffset; i++) {
      const d = new Date(baseDateReset);
      d.setDate(baseDateReset.getDate() + i);

      const dTime = d.getTime();
      const isCurrentDay = dTime === todayReset.getTime();
      const isSelectedDay = dTime === baseDateReset.getTime();

      let dayName = formatterWeekday.format(d).replace('.', '');
      let monthName = formatterMonth.format(d).replace('.', '');

      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      const localId = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      list.push({
        rawDate: d,
        formatted: `${dayName} ${d.getDate()} ${monthName}`,
        isToday: isCurrentDay,
        isSelected: isSelectedDay,
        id: localId,
      });
    }
    return list;
  }, [selectedDate]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerDates.current) {
      const scrollAmount = 128 * 7;
      containerDates.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (dateActive.current) {
      dateActive.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedDate]);

  return {
    dates: datesList,
    isBaseDateToday,
    scroll,
    containerDates,
    dateActive,
  };
};
