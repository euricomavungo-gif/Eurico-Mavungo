
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { Calendar, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [compareMonth, setCompareMonth] = useState('');

  // Added explicit type to useMemo to resolve inference issues causing 'unknown' types on property access
  const monthlyStats = useMemo<Record<string, { income: number; expense: number }>>(() => {
    const stats: Record<string, { income: number, expense: number }> = {};
    transactions.forEach(tx => {
      const month = tx.date.slice(0, 7);
      if (!stats[month]) stats[month] = { income: 0, expense: 0 };
      if (tx.type === TransactionType.INCOME) stats[month].income += tx.amount;
      else stats[month].expense += tx.amount;
    });
    return stats;
  }, [transactions]);

  const current = monthlyStats[selectedMonth] || { income: 0, expense: 0 };
  const comparison = compareMonth ? monthlyStats[compareMonth] : null;

  // Fix: Only show the selected month and comparison month (or previous month) in the chart
  const chartData = useMemo(() => {
    const monthsToShow = [selectedMonth];
    
    if (compareMonth && compareMonth !== selectedMonth) {
      monthsToShow.push(compareMonth);
    } else {
      // If no comparison month is selected, automatically show the previous month
      const [year, month] = selectedMonth.split('-').map(Number);
      const prevDate = new Date(year, month - 2, 15);
      const prevYear = prevDate.getFullYear();
      const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
      monthsToShow.push(`${prevYear}-${prevMonth}`);
    }
    
    return monthsToShow
      .map(month => {
        const data = monthlyStats[month] || { income: 0, expense: 0 };
        // Format month name for the chart
        const date = new Date(month + '-15');
        const formattedName = date.toLocaleString('pt-PT', { month: 'short', year: 'numeric' });
        
        return {
          name: formattedName,
          rawMonth: month,
          Receita: data.income,
          Despesa: data.expense
        };
      })
      .sort((a, b) => a.rawMonth.localeCompare(b.rawMonth));
  }, [monthlyStats, selectedMonth, compareMonth]);

  const StatBox = ({ label, currentVal, compareVal, type }: { label: string, currentVal: number, compareVal?: number, type: 'positive' | 'negative' }) => {
    const diff = compareVal !== undefined ? currentVal - compareVal : 0;
    const percent = compareVal ? (diff / compareVal) * 100 : 0;

    return (
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-[10px] md:text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline flex-wrap gap-2">
          <h3 className="text-xl md:text-3xl font-black text-slate-900">Kz {currentVal.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</h3>
          {compareVal !== undefined && (
            <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${
              diff > 0 ? (type === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600') : 
              diff < 0 ? (type === 'positive' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600') : 
              'bg-slate-50 text-slate-400'
            }`}>
              {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(percent).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Consultas & Comparativos</h2>
          <p className="text-slate-500 font-medium">Analise a evolução das suas finanças mês a mês.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">Mês de Referência</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
            />
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">Mês para Comparação (Opcional)</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="month" 
              value={compareMonth}
              onChange={(e) => setCompareMonth(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatBox label="Receitas" currentVal={current.income} compareVal={comparison?.income} type="positive" />
        <StatBox label="Despesas" currentVal={current.expense} compareVal={comparison?.expense} type="negative" />
        <StatBox label="Saldo Mensal" currentVal={current.income - current.expense} compareVal={comparison ? comparison.income - comparison.expense : undefined} type="positive" />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-8">Evolução Financeira Mensal</h4>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '16px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Receita" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Despesa" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic">
              Aguardando dados suficientes para gerar o gráfico...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
