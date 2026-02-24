
import React, { useMemo, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  TrendingUp, 
  Wallet, 
  PieChart as PieChartIcon,
  ChevronRight,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Transaction, TransactionType } from '@/types';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (tx: any) => void;
  monthName: string;
  categories: { income: string[], expense: string[] };
  onAddCategory: (type: 'income' | 'expense', cat: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddTransaction, monthName, categories, onAddCategory }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.INCOME);
  const [newCatName, setNewCatName] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const highExpenses = useMemo(() => {
    // Flag expenses that are > 50.000 Kz OR > 50% of current income
    const threshold = 50000;
    return transactions.filter(t => 
      t.type === TransactionType.EXPENSE && 
      (t.amount >= threshold || (stats.income > 0 && t.amount >= stats.income * 0.5))
    );
  }, [transactions, stats.income]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const recentTx = transactions.slice(0, 10);

  const CHART_COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'];

  const renderCustomLabel = ({ name, value, percent }: any) => {
    return `${name}: Kz ${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{monthName}</h2>
          <p className="text-slate-500 font-medium text-sm">Resumo financeiro do mês em curso.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setModalType(TransactionType.INCOME); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md font-bold text-sm"
          >
            <Plus className="w-4 h-4" /> Receita
          </button>
          <button 
            onClick={() => { setModalType(TransactionType.EXPENSE); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-md font-bold text-sm"
          >
            <Plus className="w-4 h-4" /> Despesa
          </button>
        </div>
      </div>

      {/* Alerta de Despesa Alta */}
      {highExpenses.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-2xl flex items-start gap-3 animate-pulse shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-black text-amber-900 text-sm">Atenção: Despesas Elevadas!</h4>
            <p className="text-amber-800 text-xs font-medium mb-2">
              Você tem {highExpenses.length} despesa(s) que comprometem significativamente seu orçamento este mês:
            </p>
            <div className="flex flex-wrap gap-2">
              {highExpenses.map(exp => (
                <span key={exp.id} className="px-2 py-1 bg-amber-100 border border-amber-200 rounded-lg text-[10px] font-bold text-amber-700 uppercase">
                  {exp.category}: Kz {exp.amount.toLocaleString('pt-PT')}
                </span>
              ))}
            </div>
            <p className="text-amber-600 text-[10px] mt-2 font-bold uppercase tracking-tight italic">Recomendamos revisar seus gastos fixos e prioridades.</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receitas</p>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Kz {stats.income.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Despesas</p>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Kz {stats.expense.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-emerald-600 p-5 rounded-3xl shadow-lg shadow-emerald-100 text-white">
          <div className="flex items-center gap-3 mb-3 text-white/70">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Saldo</p>
          </div>
          <h3 className="text-2xl font-black">Kz {stats.balance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-emerald-500" />
            Despesas por Categoria
          </h4>
          <div className="h-64 md:h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Kz ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic">
                Sem despesas neste mês.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base font-black text-slate-800">Atividade Recente</h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top 10</span>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {recentTx.length > 0 ? (
              recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                    }`}>
                      {tx.type === TransactionType.INCOME ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-none mb-1">{tx.category}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{new Date(tx.date).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tx.type === TransactionType.INCOME ? '+' : '-'} Kz {tx.amount.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">Nenhuma atividade.</div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              {modalType === TransactionType.INCOME ? <ArrowUpRight className="text-emerald-600" /> : <ArrowDownLeft className="text-red-500" />}
              {modalType === TransactionType.INCOME ? 'Nova Receita' : 'Nova Despesa'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAddTransaction({
                type: modalType,
                amount: parseFloat(formData.get('amount') as string),
                category: formData.get('category') as string,
                date: formData.get('date') as string,
                note: formData.get('note') as string,
              });
              setShowAddModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Valor (Kz)</label>
                <input name="amount" type="number" step="0.01" required autoFocus className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-black text-xl" placeholder="0,00" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
                   <button type="button" onClick={() => setShowCatInput(!showCatInput)} className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                     <PlusCircle className="w-3 h-3" /> Nova
                   </button>
                </div>
                {showCatInput && (
                  <div className="flex gap-2 mb-2">
                    <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nova categoria..." className="flex-1 px-3 py-2 bg-emerald-50 text-sm border-none rounded-xl focus:ring-1 focus:ring-emerald-500 font-bold" />
                    <button type="button" onClick={() => { if(newCatName) { onAddCategory(modalType === TransactionType.INCOME ? 'income' : 'expense', newCatName); setNewCatName(''); setShowCatInput(false); }}} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Add</button>
                  </div>
                )}
                <select name="category" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold">
                  {(modalType === TransactionType.INCOME ? categories.income : categories.expense).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Data</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nota</label>
                  <input name="note" type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm" placeholder="Opcional" />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
