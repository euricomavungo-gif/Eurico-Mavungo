
import React from 'react';
import { Info, Copyright, Zap, ShieldCheck, Database, Github, Globe, Phone, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sobre o Aplicativo</h2>
          <p className="text-slate-500 font-medium">Informações técnicas e de autoria do MeuboLSO.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">MeuboLSO</h3>
                <p className="text-emerald-600 font-bold text-sm">Versão 1.2.0 (Stable)</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed text-lg">
                O <strong>MeuboLSO</strong> é uma plataforma de gestão financeira inteligente desenhada para oferecer clareza total sobre o fluxo de caixa pessoal. Com foco em simplicidade e eficiência, o aplicativo permite o controle rigoroso de receitas, despesas e planejamento de compras, tudo sincronizado em tempo real.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Privacidade</h4>
                    <p className="text-xs text-slate-500">Dados criptografados e acesso restrito ao proprietário da conta.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Sincronização</h4>
                    <p className="text-xs text-slate-500">Backup automático em nuvem via Supabase para nunca perder seus dados.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl">
            <h4 className="text-xl font-black mb-6 flex items-center gap-2">
              <Copyright className="w-6 h-6 text-emerald-400" />
              Direitos Autorais & Propriedade
            </h4>
            <div className="space-y-4 text-slate-300">
              <p className="text-lg">
                Este software é de propriedade intelectual de <strong>Eurico Mavungo</strong>.
              </p>
              <p className="text-sm opacity-70">
                Todos os direitos reservados © 2026. A reprodução, distribuição ou modificação não autorizada deste código ou design é estritamente proibida.
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Angola / Portugal
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                  <Github className="w-3 h-3" /> @euricomavungo
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                  <Phone className="w-3 h-3" /> (+244) 935 787 153
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                  <Mail className="w-3 h-3" /> euricomavungo@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Tecnologias</h4>
            <div className="space-y-4">
              <TechItem name="React 18" version="Frontend Library" />
              <TechItem name="TypeScript" version="Type Safety" />
              <TechItem name="Tailwind CSS" version="Styling Engine" />
              <TechItem name="Supabase" version="Backend as a Service" />
              <TechItem name="Lucide Icons" version="Icon System" />
              <TechItem name="Recharts" version="Data Visualization" />
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
            <h4 className="font-black text-emerald-800 mb-2 uppercase text-xs tracking-widest">Ano de Criação</h4>
            <p className="text-3xl font-black text-emerald-600">2026</p>
            <p className="text-xs text-emerald-700 mt-2 font-medium">Desenvolvido com foco em performance e UX moderna.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechItem = ({ name, version }: { name: string, version: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="font-bold text-slate-700 text-sm">{name}</span>
    <span className="text-[10px] font-bold text-slate-400 uppercase">{version}</span>
  </div>
);

export default About;
