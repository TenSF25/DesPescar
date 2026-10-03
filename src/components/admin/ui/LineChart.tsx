import {
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LineChartDatum } from '../admin.types';

interface LineChartProps {
  data: LineChartDatum[];
  height?: number;
  color?: string;
  /** Cómo se escribe un valor en el tooltip (ej: `$1.200` o `236 pasajes`). */
  valueFormatter?: (value: number) => string;
  /** Nombre de la serie en el tooltip (ej: "Ventas"). */
  valueLabel?: string;
}

const compactNumber = new Intl.NumberFormat('es-AR', { notation: 'compact' });

export const LineChart = ({
  data,
  height = 220,
  color = '#c85300',
  valueFormatter = (value) => value.toLocaleString('es-AR'),
  valueLabel = 'Valor',
}: LineChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#44474E' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#44474E' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => compactNumber.format(value)}
          />
          <Tooltip formatter={(value) => [valueFormatter(Number(value)), valueLabel]} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};
