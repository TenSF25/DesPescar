const colorSettings = {
  blue: {
    available: 'border-blue-400 text-blue-400 hover:bg-blue-400/40',
    select: 'bg-blue-400 text-white',
    occupied: 'bg-gray-400',
  },
} as const;

interface ColorStyle {
  available: string;
  select: string;
  occupied: string;
}

export const getColorSettings = (color: string | null | undefined): ColorStyle => {
  console.log(color, 'NOMBRE COLOR');

  const fallback: ColorStyle = {
    available: '',
    select: '',
    occupied: 'bg-gray-400',
  };

  if (!color || !(color in colorSettings)) return fallback;

  return colorSettings[color as keyof typeof colorSettings];
};
