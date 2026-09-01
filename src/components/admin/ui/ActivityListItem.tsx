interface ActivityListItemProps {
  icon: string;
  iconClassName?: string;
  title: string;
  subtitle: string;
  time: string;
}

export const ActivityListItem = ({
  icon,
  iconClassName = 'bg-primary/10 text-primary',
  title,
  subtitle,
  time,
}: ActivityListItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-secondary text-sm font-semibold">{title}</span>
        <span className="text-xs text-[#44474E]">{subtitle}</span>
      </div>
      <span className="shrink-0 text-xs text-[#44474E]">{time}</span>
    </div>
  );
};
