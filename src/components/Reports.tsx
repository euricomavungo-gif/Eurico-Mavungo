
import React, { useState } from 'react';
import { Transaction, ShoppingItem, TransactionType } from '@/types';
import { FileText, Download, PieChart, ShoppingBag, CalendarRange, Calendar } from 'lucide-react';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  transactions: Transaction[];
  shoppingItems: ShoppingItem[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, shoppingItems }) => {
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));

  const exportPDF = (type: 'monthly' | 'shopping' | 'future') => {
    const doc = new jsPDF();
    const now = new Date();
    
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129);
    doc.text('MeuboLSO', 14, 20);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Relatório Gerado em: ${now.toLocaleString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    if (type === 'monthly') {
      const monthLabel = new Date(reportMonth + '-02').toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(`Extrato Financeiro: ${monthLabel}`, 14, 42);

      const monthTx = transactions.filter(t => t.date.startsWith(reportMonth));
      const incomes = monthTx.filter(t => t.type === TransactionType.INCOME);
      const expenses = monthTx.filter(t => t.type === TransactionType.EXPENSE);

      const totalIn = incomes.reduce((s, c) => s + c.amount, 0);
      const totalOut = expenses.reduce((s, c) => s + c.amount, 0);

      doc.setFontSize(11);
      doc.text(`Total de Entradas: Kz ${totalIn.toLocaleString('pt-PT')}`, 14, 52);
      doc.text(`Total de Saídas: Kz ${totalOut.toLocaleString('pt-PT')}`, 14, 58);
      doc.text(`Balanço: Kz ${(totalIn - totalOut).toLocaleString('pt-PT')}`, 14, 64);

      // Income Table
      doc.setFontSize(14);
      doc.text('Detalhamento de Entradas', 14, 78);
      autoTable(doc, {
        startY: 82,
        head: [['Data', 'Categoria', 'Nota', 'Valor']],
        body: incomes.map(t => [new Date(t.date).toLocaleDateString('pt-PT'), t.category, t.note || '-', `Kz ${t.amount.toLocaleString('pt-PT')}`]),
        headStyles: { fillColor: [16, 185, 129] }
      });

      // Expense Table
      // @ts-ignore
      const nextY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Detalhamento de Saídas', 14, nextY);
      autoTable(doc, {
        startY: nextY + 4,
        head: [['Data', 'Categoria', 'Nota', 'Valor']],
        body: expenses.map(t => [new Date(t.date).toLocaleDateString('pt-PT'), t.category, t.note || '-', `Kz ${t.amount.toLocaleString('pt-PT')}`]),
        headStyles: { fillColor: [239, 68, 68] }
      });

    } else if (type === 'shopping' || type === 'future') {
      const isFuture = type === 'future';
      const items = shoppingItems.filter(i => i.isFuture === isFuture && (isFuture || i.date.startsWith(reportMonth)));
      
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(isFuture ? 'Planejamento de Compras Futuras' : 'Lista de Compras Mensais', 14, 42);

      const pItems = items.filter(i => i.isPriority);
      const npItems = items.filter(i => !i.isPriority);
      const totalP = pItems.reduce((s, c) => s + c.price, 0);
      const totalNP = npItems.reduce((s, c) => s + c.price, 0);
      const totalGlobal = totalP + totalNP;

      doc.setFontSize(11);
      doc.text(`Total Prioritárias: Kz ${totalP.toLocaleString('pt-PT')}`, 14, 52);
      doc.text(`Total Não Prioritárias: Kz ${totalNP.toLocaleString('pt-PT')}`, 14, 58);
      doc.setTextColor(16, 185, 129);
      doc.text(`Valor Total Geral: Kz ${totalGlobal.toLocaleString('pt-PT')}`, 14, 64);
      doc.setTextColor(30, 41, 59);

      // Priorities Table
      doc.setFontSize(13);
      doc.text('Artigos Prioritários', 14, 78);
      autoTable(doc, {
        startY: 82,
        head: [['Artigo', 'Categoria', 'Preço Est.']],
        body: pItems.map(i => [i.name, i.category, `Kz ${i.price.toLocaleString('pt-PT')}`]),
        headStyles: { fillColor: [16, 185, 129] },
        bodyStyles: { fontStyle: 'bold' }
      });

      // Non-Priorities Table
      // @ts-ignore
      const nextY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(13);
      doc.text('Artigos Não Prioritários', 14, nextY);
      autoTable(doc, {
        startY: nextY + 4,
        head: [['Artigo', 'Categoria', 'Preço Est.']],
        body: npItems.map(i => [i.name, i.category, `Kz ${i.price.toLocaleString('pt-PT')}`]),
        headStyles: { fillColor: [100, 116, 139] }
      });
    }

    doc.save(`meubolso_${type}_${reportMonth}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Relatórios</h2>
          <p className="text-slate-500 font-medium">Baixe seus dados organizados em formato profissional.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mês do Relatório</span>
            <input 
              type="month" 
              value={reportMonth} 
              onChange={e => setReportMonth(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 font-black text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          title="Extrato Mensal" 
          description="Resumo de entradas e saídas separado por categorias e totais." 
          icon={PieChart} 
          onClick={() => exportPDF('monthly')} 
        />
        <ReportCard 
          title="Compras Mensais" 
          description="Lista de artigos planejados para este mês, divididos por prioridade." 
          icon={ShoppingBag} 
          onClick={() => exportPDF('shopping')} 
        />
        <ReportCard 
          title="Plano Futuro" 
          description="Tudo o que você planeja comprar a longo prazo com estimativa de custos." 
          icon={CalendarRange} 
          onClick={() => exportPDF('future')} 
        />
      </div>
    </div>
  );
};

const ReportCard = ({ title, description, icon: Icon, onClick }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group">
    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8" />
    </div>
    <h4 className="text-lg font-black text-slate-800 mb-2">{title}</h4>
    <p className="text-slate-500 font-medium text-xs mb-8 leading-relaxed px-4">{description}</p>
    <button onClick={onClick} className="mt-auto w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-100">
      <Download className="w-4 h-4" /> Baixar PDF
    </button>
  </div>
);

export default Reports;
