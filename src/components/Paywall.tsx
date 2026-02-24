
import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PaywallProps {
  onUpgrade: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onUpgrade }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3" />
            Acesso Premium
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            DOMINE SEU <span className="text-emerald-500">DESTINO</span> FINANCEIRO.
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Sua licença expirou. Desbloqueie ferramentas avançadas de análise, relatórios PDF e sincronização em nuvem ilimitada.
          </p>
          
          <div className="space-y-4 pt-4">
            {[
              "Análises Gráficas Avançadas",
              "Relatórios Mensais em PDF",
              "Sincronização Multi-dispositivo",
              "Suporte Prioritário 24/7"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 border border-slate-200"
        >
          <div className="mb-8">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">Plano Anual</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">R$ 19,90</span>
              <span className="text-slate-500 font-medium">/mês</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">Cobrado anualmente (R$ 238,80)</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onUpgrade}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              Ativar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Pagamento processado de forma segura. Cancele a qualquer momento.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <CreditCard className="w-6 h-6 text-slate-300" />
                <div className="w-8 h-5 bg-slate-200 rounded" />
                <div className="w-8 h-5 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Paywall;
