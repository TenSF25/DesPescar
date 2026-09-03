import { Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { LineChartDatum } from '../admin.types';

interface LineChartProps {
  data: LineChartDatum[];
  height?: number;
  color?: string;
}

export const LineChart = ({ data, height = 220, color = '#c85300' }: LineChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#44474E' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#44474E' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};
