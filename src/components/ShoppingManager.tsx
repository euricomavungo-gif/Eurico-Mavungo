
import React, { useState, useMemo } from 'react';
import { ShoppingItem } from '@/types';
import { Plus, Trash2, ShoppingCart, AlertCircle, CheckCircle2, PlusCircle } from 'lucide-react';

interface ShoppingManagerProps {
  items: ShoppingItem[];
  onAdd: (item: any) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  title: string;
  categories: string[];
  onAddCategory: (cat: string) => void;
}

const ShoppingManager: React.FC<ShoppingManagerProps> = ({ items, onAdd, onDelete, onToggle, title, categories, onAddCategory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCatInput, setShowCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const stats = useMemo(() => {
    const priority = items.filter(i => i.isPriority).reduce((acc, curr) => acc + curr.price, 0);
    const nonPriority = items.filter(i => !i.isPriority).reduce((acc, curr) => acc + curr.price, 0);
    return { priority, nonPriority, total: priority + nonPriority };
  }, [items]);

  const priorityItems = items.filter(i => i.isPriority);
  const nonPriorityItems = items.filter(i => !i.isPriority);

  const ShoppingList = ({ list, isPriority }: { list: ShoppingItem[], isPriority: boolean }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2">
        {isPriority ? <CheckCircle2 className="text-emerald-600 w-4 h-4" /> : <AlertCircle className="text-amber-500 w-4 h-4" />}
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          {isPriority ? 'Prioritárias' : 'Não Prioritárias'}
        </h4>
      </div>
      <div className="space-y-2">
        {list.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-3 bg-white rounded-2xl border ${item.checked ? 'border-emerald-100 opacity-60' : 'border-slate-100'} hover:border-emerald-200 transition-all shadow-sm group`}>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onToggle(item.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
              <div>
                <p className={`font-bold text-slate-800 text-sm leading-none mb-1 ${item.checked ? 'line-through text-slate-400' : ''}`}>{item.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-black text-sm ${item.checked ? 'text-slate-300' : 'text-emerald-600'}`}>
                Kz {item.price.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}
              </span>
              <button 
                onClick={() => onDelete(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="py-4 px-6 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400 text-xs italic">
            Nenhum item.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-xs font-medium">Controle de itens e orçamento.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Novo Artigo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Prioritárias</p>
          <h3 className="text-xl font-black text-emerald-600">Kz {stats.priority.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Não Prioritárias</p>
          <h3 className="text-xl font-black text-amber-500">Kz {stats.nonPriority.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}</h3>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Total</p>
          <h3 className="text-xl font-black text-white">Kz {stats.total.toLocaleString('pt-PT', { minimumFractionDigits: 1 })}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShoppingList list={priorityItems} isPriority={true} />
        <ShoppingList list={nonPriorityItems} isPriority={false} />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
          <div className="relative bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <ShoppingCart className="text-emerald-600" /> Adicionar Artigo
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAdd({
                name: formData.get('name') as string,
                price: parseFloat(formData.get('price') as string),
                category: formData.get('category') as string,
                isPriority: formData.get('isPriority') === 'true',
                date: new Date().toISOString()
              });
              setShowAddForm(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nome</label>
                <input name="name" type="text" required autoFocus className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Preço Est. (Kz)</label>
                  <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Prioridade</label>
                  <select name="isPriority" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold">
                    <option value="true">✅ Prioritária</option>
                    <option value="false">⚠️ Não Prioritária</option>
                  </select>
                </div>
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
                    <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Categoria..." className="flex-1 px-3 py-2 bg-emerald-50 text-sm border-none rounded-xl focus:ring-1 focus:ring-emerald-500 font-bold" />
                    <button type="button" onClick={() => { if(newCatName) { onAddCategory(newCatName); setNewCatName(''); setShowCatInput(false); }}} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Add</button>
                  </div>
                )}
                <select name="category" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingManager;
