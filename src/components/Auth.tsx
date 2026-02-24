
import React, { useState } from 'react';
import { User, SubscriptionStatus } from '@/types';
import { Wallet, ShieldCheck, Zap, ArrowRight, LogIn, Eye, EyeOff, Copyright, Database, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!isSupabaseConfigured) {
        // Handle demo mode if not configured
        const demoUser: User = {
          id: 'demo-user',
          name: name || 'Usuário Demo',
          email: email || 'demo@example.com',
          createdAt: Date.now(),
          subscriptionStatus: SubscriptionStatus.ACTIVE
        };
        onLogin(demoUser);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'Usuário',
            email: data.user.email || '',
            createdAt: new Date(data.user.created_at).getTime(),
            subscriptionStatus: SubscriptionStatus.ACTIVE // Default to active for Supabase users for now
          };
          onLogin(user);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          const user: User = {
            id: data.user.id,
            name: name,
            email: email,
            createdAt: Date.now(),
            subscriptionStatus: SubscriptionStatus.TRIAL
          };
          // Supabase might require email confirmation, but for this demo we proceed
          alert('Conta criada! Verifique seu email ou tente entrar.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.message === 'Failed to fetch') {
        if (!isSupabaseConfigured) {
          alert('Modo Demo: O Supabase não está configurado. Suas alterações serão salvas apenas localmente nesta sessão.');
          const demoUser: User = {
            id: 'demo-user',
            name: name || 'Usuário Demo',
            email: email || 'demo@example.com',
            createdAt: Date.now(),
            subscriptionStatus: SubscriptionStatus.ACTIVE
          };
          onLogin(demoUser);
        } else {
          alert('Erro de conexão: Não foi possível conectar ao Supabase. Verifique sua internet ou as chaves configuradas.');
        }
      } else {
        alert(error.message || 'Erro na autenticação');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="hidden lg:flex flex-col justify-between p-16 bg-emerald-600 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-black text-xl">M</div>
              <span className="text-2xl font-black">MeuboLSO</span>
            </div>
            <h1 className="text-5xl font-black mb-6 leading-tight">Gestão simples, resultados reais.</h1>
            <p className="text-emerald-50 text-xl font-medium max-w-sm opacity-80">Controle suas finanças mensais com clareza total e segurança em nuvem.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
              <p className="font-bold">Privacidade em primeiro lugar</p>
            </div>
            <div className="flex items-center gap-4">
              <Database className="w-6 h-6 text-emerald-300" />
              <p className="font-bold">Base de dados segura</p>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-emerald-300" />
              <p className="font-bold">Acesso Premium Vitalício</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-16 flex flex-col justify-center relative">
          <div className="mb-8 lg:hidden flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">M</div>
            <h2 className="text-2xl font-black text-slate-800">MeuboLSO</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{isLogin ? 'Bem-vindo' : 'Criar Conta'}</h2>
            <p className="text-slate-500 font-medium">Acesse sua carteira inteligente conectada.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {!isLogin && (
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all" placeholder="Seu nome" />
            )}
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all" placeholder="Email" />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all" 
                placeholder="Senha" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 md:py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-100 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? <><LogIn className="w-5 h-5" /> Entrar</> : <><ArrowRight className="w-5 h-5" /> Cadastrar</>
              )}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 md:mt-8 text-slate-500 font-bold text-sm hover:text-emerald-600 transition-colors w-full">
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
