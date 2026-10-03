interface ProgressListItemProps {
  label: string;
  value: number;
  maxValue: number;
}

export const ProgressListItem = ({ label, value, maxValue }: ProgressListItemProps) => {
  const percentage = maxValue ? Math.min(100, (value / maxValue) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#44474E]">{label}</span>
        <span className="text-secondary font-semibold">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
        <div className="bg-secondary h-full rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
