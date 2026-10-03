import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { DonutChartDatum } from '../admin.types';

interface DonutChartProps {
  data: DonutChartDatum[];
  size?: number;
}

export const DonutChart = ({ data, size = 170 }: DonutChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex min-w-0 items-center gap-6">
      <div style={{ width: size, height: size }} className="shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="65%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
        {data.map((entry) => (
          <li key={entry.label} className="flex items-center justify-between gap-2">
            <span
              title={entry.label}
              className="flex min-w-0 items-center gap-2 truncate text-[#44474E]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate">{entry.label}</span>
            </span>
            <span className="text-secondary shrink-0 font-semibold">
              {total ? Math.round((entry.value / total) * 100) : 0}% ({entry.value})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
