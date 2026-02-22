
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { Trash2, Search, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

interface TransactionManagerProps {
  transactions: Transaction[];
  selectedMonth: string;
  onMonthChange: (val: string) => void;
  onAdd: (tx: any) => void;
  onDelete: (id: string) => void;
  categories: { income: string[], expense: string[] };
  onAddCategory: (type: 'income' | 'expense', cat: string) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ 
  transactions, 
  selectedMonth, 
  onMonthChange, 
  onAdd, 
  onDelete,
  categories,
  onAddCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const inMonth = t.date.startsWith(selectedMonth);
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (t.note?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'ALL' || t.type === filterType;
      return inMonth && matchesSearch && matchesFilter;
    });
  }, [transactions, selectedMonth, searchTerm, filterType]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Movimentações</h2>
          <p className="text-slate-500 font-medium text-sm">Controle detalhado por período mensal.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <Calendar className="w-5 h-5 text-emerald-600 ml-2" />
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => onMonthChange(e.target.value)} 
            className="bg-transparent border-none focus:ring-0 font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', TransactionType.INCOME, TransactionType.EXPENSE] as const).map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  filterType === type 
                    ? (type === TransactionType.INCOME ? 'bg-emerald-600 text-white shadow-lg' : type === TransactionType.EXPENSE ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg') 
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {type === 'ALL' ? 'Todos' : type === TransactionType.INCOME ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Nota</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 rounded-l-2xl font-bold text-xs text-slate-500">
                    {new Date(tx.date).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-4 py-3 font-black text-sm text-slate-800">
                    <div className="flex items-center gap-2">
                      {tx.type === TransactionType.INCOME ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      {tx.category}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 italic max-w-xs truncate">{tx.note || '-'}</td>
                  <td className={`px-4 py-3 font-black text-sm ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                    Kz {tx.amount.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="px-4 py-3 rounded-r-2xl text-right">
                    <button onClick={() => onDelete(tx.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium text-sm italic">
                    Nenhuma movimentação em {selectedMonth}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManager;
