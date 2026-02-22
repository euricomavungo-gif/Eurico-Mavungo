
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingCart, 
  CalendarClock, 
  BarChart3, 
  FileText, 
  LogOut,
  Wallet,
  Menu,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Copyright,
  CloudCheck
} from 'lucide-react';

import { Transaction, TransactionType, ShoppingItem, ViewType, User, SubscriptionStatus } from './types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, SHOPPING_CATEGORIES } from './constants';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import ShoppingManager from './components/ShoppingManager';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import Auth from './components/Auth';
import Paywall from './components/Paywall';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isSyncing, setIsSyncing] = useState(false);

  const [categories, setCategories] = useState({
    income: INCOME_CATEGORIES,
    expense: EXPENSE_CATEGORIES,
    shopping: SHOPPING_CATEGORIES
  });

  // Simulated Database Sync
  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Load data from Supabase
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          createdAt: new Date(session.user.created_at).getTime(),
          subscriptionStatus: SubscriptionStatus.ACTIVE
        };
        setCurrentUser(user);
        fetchUserData(user.id);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          createdAt: new Date(session.user.created_at).getTime(),
          subscriptionStatus: SubscriptionStatus.ACTIVE
        };
        setCurrentUser(user);
        fetchUserData(user.id);
      } else {
        setCurrentUser(null);
        setTransactions([]);
        setShoppingItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    setIsSyncing(true);
    try {
      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', userId)
        .order('date', { ascending: false });
      
      if (txError) throw txError;
      if (txData) setTransactions(txData);

      // Fetch shopping items
      const { data: shopData, error: shopError } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('userId', userId);
      
      if (shopError) throw shopError;
      if (shopData) setShoppingItems(shopData);

      // Fetch categories/profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('categories')
        .eq('id', userId)
        .single();
      
      if (!profileError && profileData?.categories) {
        setCategories(profileData.categories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const addCategory = async (type: 'income' | 'expense' | 'shopping', newCat: string) => {
    const updated = { ...categories, [type]: [...categories[type], newCat] };
    setCategories(updated);
    if (currentUser) {
      triggerSync();
      await supabase.from('profiles').upsert({ id: currentUser.id, categories: updated });
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id
    };
    setTransactions(prev => [newTx, ...prev]);
    triggerSync();
    await supabase.from('transactions').insert(newTx);
  };

  const addShoppingItem = async (item: Omit<ShoppingItem, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newItem: ShoppingItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      checked: false
    };
    setShoppingItems(prev => [newItem, ...prev]);
    triggerSync();
    await supabase.from('shopping_items').insert(newItem);
  };

  const toggleShoppingItem = async (id: string) => {
    const item = shoppingItems.find(i => i.id === id);
    if (!item) return;
    
    const newChecked = !item.checked;
    setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, checked: newChecked } : i));
    triggerSync();
    await supabase.from('shopping_items').update({ checked: newChecked }).eq('id', id);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    triggerSync();
    await supabase.from('transactions').delete().eq('id', id);
  };

  const deleteShoppingItem = async (id: string) => {
    setShoppingItems(prev => prev.filter(i => i.id !== id));
    triggerSync();
    await supabase.from('shopping_items').delete().eq('id', id);
  };

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  const changeMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const currentMonthTransactions = useMemo(() => 
    transactions.filter(t => t.date.startsWith(selectedMonth)), [transactions, selectedMonth]
  );

  const currentMonthShopping = useMemo(() => 
    shoppingItems.filter(i => !i.isFuture && i.date.startsWith(selectedMonth)), [shoppingItems, selectedMonth]
  );

  if (!currentUser) {
    return <Auth onLogin={(user) => setCurrentUser(user)} />;
  }

  if (currentUser.subscriptionStatus === SubscriptionStatus.EXPIRED) {
    return <Paywall onUpgrade={() => {
      const updatedUser = { ...currentUser, subscriptionStatus: SubscriptionStatus.ACTIVE };
      setCurrentUser(updatedUser);
      localStorage.setItem('meubolso_user', JSON.stringify(updatedUser));
    }} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
          transactions={currentMonthTransactions} 
          onAddTransaction={addTransaction}
          monthName={monthLabel}
          categories={categories}
          onAddCategory={addCategory}
        />;
      case 'transactions':
        return <TransactionManager 
          transactions={transactions} 
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onAdd={addTransaction} 
          onDelete={deleteTransaction} 
          categories={categories}
          onAddCategory={addCategory}
        />;
      case 'shopping':
        return <ShoppingManager 
          items={currentMonthShopping} 
          onAdd={(item) => addShoppingItem({ ...item, isFuture: false })} 
          onDelete={deleteShoppingItem}
          onToggle={toggleShoppingItem}
          title="Lista de Compras Mensais"
          categories={categories.shopping}
          onAddCategory={(cat) => addCategory('shopping', cat)}
        />;
      case 'future':
        return <ShoppingManager 
          items={shoppingItems.filter(i => i.isFuture)} 
          onAdd={(item) => addShoppingItem({ ...item, isFuture: true })} 
          onDelete={deleteShoppingItem}
          onToggle={toggleShoppingItem}
          title="Planejamento de Compras Futuras"
          categories={categories.shopping}
          onAddCategory={(cat) => addCategory('shopping', cat)}
        />;
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'reports':
        return <Reports transactions={transactions} shoppingItems={shoppingItems} />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1), icon: LayoutDashboard },
    { id: 'transactions', label: 'Movimentações', icon: Wallet },
    { id: 'shopping', label: 'Compras', icon: ShoppingCart },
    { id: 'future', label: 'Compras Futuras', icon: CalendarClock },
    { id: 'analytics', label: 'Consultas', icon: BarChart3 },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Mobile toggle */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="fixed top-0 bottom-0 left-0 w-64 bg-white shadow-xl">
          <div className="p-6 flex items-center justify-between border-b">
            <h1 className="text-xl font-bold text-emerald-600">MeuboLSO</h1>
            <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id as ViewType); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-10"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r">
        <div className="p-8 border-b">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">MeuboLSO</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Base de Dados</p>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${isSyncing ? 'text-blue-500 animate-pulse' : 'text-emerald-500'}`}>
               <CloudCheck className="w-3 h-3" />
               {isSyncing ? 'Sincronizando...' : 'Conectado'}
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-emerald-500'}`} />
              <span className="font-semibold text-left line-clamp-1">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Global Month Control */}
        <div className="px-6 py-4 border-t border-b bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Navegação Temporal</p>
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-slate-800 capitalize leading-none">{monthLabel.split(' ')[0]}</span>
              <span className="text-[10px] font-bold text-slate-400">{monthLabel.split(' ')[1]}</span>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 w-fit">
              <CreditCard className="w-3 h-3" />
              {currentUser.subscriptionStatus === SubscriptionStatus.TRIAL ? 'TRIAL 7 DIAS' : 'PREMIUM'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white border-b lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 line-clamp-1">{monthLabel}</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
