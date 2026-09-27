import { useState, useRef, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { es } from 'date-fns/locale';

interface DateRangePickerProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
}

export const useDateRangePicker = ({ range, onRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ida' | 'vuelta'>('ida');
  const containerRef = useRef<HTMLDivElement>(null);

  const [tempRange, setTempRange] = useState<DateRange | undefined>(range);
  const displayRange = isOpen ? tempRange : range;

  const handleOpen = (tab: 'ida' | 'vuelta') => {
    if (!isOpen) setTempRange(range);
    setIsOpen(true);
    setActiveTab(tab);
  };

  const handleApply = useCallback(() => {
    onRangeChange(tempRange);
    setIsOpen(false);
  }, [onRangeChange, tempRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleApply();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleApply]);

  const handleClear = () => {
    setTempRange(undefined);
    onRangeChange(undefined);
    setActiveTab('ida');
  };

  const handleSelect = (_: DateRange | undefined, selectedDay: Date) => {
    let newRange: DateRange | undefined;

    if (activeTab === 'ida') {
      const isAfterVuelta = tempRange?.to && selectedDay > tempRange.to;
      newRange = {
        from: selectedDay,
        to: isAfterVuelta ? undefined : tempRange?.to,
      };

      setTempRange(newRange);
      setActiveTab('vuelta');
    } else {
      const isBeforeIda = tempRange?.from && selectedDay < tempRange.from;
      newRange =
        isBeforeIda || !tempRange?.from ? undefined : { from: tempRange.from, to: selectedDay };

      setTempRange(newRange);

      if (isBeforeIda || !newRange?.from) {
        setActiveTab('ida');
      }
    }
  };

  const formatItem = (date: Date | undefined, fallback: string) => {
    if (!date) return fallback;
    return format(date, "d 'de' MMM", { locale: es });
  };

  return {
    containerRef,
    handleOpen,
    isOpen,
    activeTab,
    displayRange,
    formatItem,
    handleClear,
    handleApply,
    tempRange,
    handleSelect,
    es,
  };
};
