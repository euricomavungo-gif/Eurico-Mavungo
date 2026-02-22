
import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, XCircle } from 'lucide-react';

interface PaywallProps {
  onUpgrade: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onUpgrade }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 lg:p-10">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-12 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black mb-6">
            <XCircle className="w-3 h-3" /> PERÍODO DE TESTE EXPIRADO
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
            Continue sua jornada financeira.
          </h2>
          <p className="text-slate-500 font-medium text-lg mb-8">
            Seus 7 dias de teste terminaram. Assine o plano Premium para manter o acesso aos seus dados e relatórios.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              'Registro ilimitado de receitas e despesas',
              'Gestão de listas de compras prioritárias',
              'Planejamento de compras futuras',
              'Comparativos mensais detalhados',
              'Relatórios profissionais em PDF'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-600 p-12 md:p-16 flex flex-col justify-center text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Zap className="w-40 h-40 rotate-12" />
          </div>
          
          <div className="mb-10">
            <p className="text-emerald-100 font-black uppercase tracking-widest text-sm mb-2">PLANO ANUAL</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white">Kz 5.000</span>
              <span className="text-emerald-200 font-bold">/mês</span>
            </div>
            <p className="text-emerald-100/70 mt-2 font-medium">Cobrado anualmente (Kz 60.000)</p>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full flex items-center justify-center gap-3 py-6 bg-white text-emerald-600 rounded-3xl font-black text-xl hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-700/20"
          >
            Assinar Agora <CreditCard className="w-6 h-6" />
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-3 text-emerald-100/50">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold">Pagamento 100% Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
