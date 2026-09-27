type ColorStyle = {
  available: string;
  select: string;
  occupied: string;
  text: string;
};

const colorSettings: Record<string, ColorStyle> = {
  blue: {
    available: 'border-blue-400 text-blue-400 hover:bg-blue-400/20',
    select: 'bg-blue-400 text-white border-blue-400',
    occupied: 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed',
    text: 'text-blue-400',
  },
  gold: {
    available: 'border-amber-500 text-amber-500 hover:bg-amber-500/20',
    select: 'bg-amber-500 text-white border-amber-500',
    occupied: 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed',
    text: 'text-amber-500',
  },
  slate: {
    available: 'border-slate-500 text-slate-500 hover:bg-slate-500/20',
    select: 'bg-slate-500 text-white border-slate-500',
    occupied: 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed',
    text: 'text-slate-500',
  },
  emerald: {
    available: 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/20',
    select: 'bg-emerald-500 text-white border-emerald-500',
    occupied: 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed',
    text: 'text-emerald-500',
  },
};

export const getColorSettings = (colorKey?: string | null): ColorStyle => {
  const fallback: ColorStyle = {
    available: 'border-gray-400 text-gray-400',
    select: 'bg-gray-400 text-white border-gray-400',
    occupied: 'bg-gray-200 border-gray-200 text-gray-400',
    text: 'text-gray-200',
  };
  if (!colorKey || !colorSettings[colorKey]) return fallback;
  return colorSettings[colorKey];
};
