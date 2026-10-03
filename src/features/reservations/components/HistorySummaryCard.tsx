interface HistorySummaryCardProps {
  icon: string;
  value: string | number;
  label: string;
}

export const HistorySummaryCard = ({ icon, value, label }: HistorySummaryCardProps) => {
  return (
    <div className="flex min-w-35 flex-1 flex-col gap-1 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:flex-none">
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-secondary text-[26px] leading-none font-extrabold">{value}</span>
      <span className="text-xs font-semibold text-gray-400">{label}</span>
    </div>
  );
};
