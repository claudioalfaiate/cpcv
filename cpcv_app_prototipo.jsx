import React, { useState, useMemo } from "react";
import {
  FileText, UploadCloud, CheckCircle2, AlertTriangle, XCircle, ChevronRight,
  ChevronLeft, FolderPlus, Scale, Building2, Users, CreditCard, ShieldCheck,
  FileSignature, Sparkles, Search, Settings, LayoutGrid, Pencil, Check, Info,
  Landmark, BadgeCheck, Clock, FileDown, Eye
} from "lucide-react";

/* ── Marca P&A (cores por inline style — runtime sem compilador Tailwind) ── */
const C = {
  navy: "#1F3864", navyDeep: "#16243F", navySoft: "#33507F",
  gold: "#B7892B", goldSoft: "#C9A14A",
  paper: "#F6F4EF", card: "#FFFFFF", ink: "#22272E", sub: "#6B7280",
  line: "#E7E2D7", lineSoft: "#F0ECE2",
  ok: "#2E7D32", okBg: "#EAF3EB", warn: "#B7791F", warnBg: "#FBF3E0",
  danger: "#B42318", dangerBg: "#FBEAE8", token: "#1F6FEB", tokenBg: "#EAF1FE",
};
const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };
const sans = { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' };

/* ───────────────────────── dados de exemplo ───────────────────────── */
const SEED = {
  ref: "CPCV-2026-0412",
  titulo: "Fração T2 · Quinta das Lágrimas, Coimbra",
  docs: [
    { nome: "certidao_predial.pdf", tipo: "Certidão predial", conf: "alta" },
    { nome: "caderneta_urbana.pdf", tipo: "Caderneta predial urbana", conf: "alta" },
    { nome: "licenca_utilizacao.pdf", tipo: "Licença de utilização", conf: "alta" },
    { nome: "CC_vendedores.pdf", tipo: "Documento de identificação", conf: "media" },
    { nome: "CC_comprador.jpg", tipo: "Documento de identificação", conf: "media" },
    { nome: "comunicacao_remax.pdf", tipo: "Comunicação da imobiliária", conf: "alta" },
    { nome: "comprovativo_iban.pdf", tipo: "Informação bancária / IBAN", conf: "media" },
  ],
  vendedores: [{
    tipo: "casal", regime: "comunhão de adquiridos",
    a: { nome: "Joana Margarida Sousa Pires", nif: "219 884 552", cc: "12345678 9 ZZ4", val: "—", conf_nome: "alta", conf_nif: "alta", conf_cc: "baixa" },
    b: { nome: "Rui Manuel Antunes Pires", nif: "198 220 145", cc: "23456789 0 ZX1", val: "2029-04-12", conf_nome: "alta", conf_nif: "alta", conf_cc: "alta" },
    morada: "Rua Dr. António José de Almeida, 14, 3000-045 Coimbra",
    titularRegisto: true,
  }],
  compradores: [{
    tipo: "singular", nome: "André Filipe Carvalho Lemos", nif: "245 110 988",
    estadoCivil: "solteiro", cc: "34567890 1 ZY2", val: "2031-08-03",
    morada: "Av. Fernão de Magalhães, 201, 3000-176 Coimbra",
    conf_nome: "alta", conf_nif: "alta", conf_cc: "alta",
  }],
  imovel: {
    tipo: "Fração autónoma", letra: "C", composicao: "T2, 99 m² úteis, com lugar de garagem",
    conservatoria: "Coimbra", descricao: "4821", descFreg: "Santo António dos Olivais",
    freguesia: "Santo António dos Olivais", concelho: "Coimbra", artigo: "9134",
    licenca: "187/2019", licencaData: "2019-06-21",
    cee: "", ceeValidade: "",            // ← em falta de propósito (gera alerta)
    hipoteca: { tem: true, banco: "Banco Santander Totta, S.A.", apres: "2456 de 2021/03/09" },
  },
  pagamento: {
    preco: "345 700,00", sinal: "34 570,00", remanescente: "311 130,00",
    ibanComprador: "PT50 0035 0651 0002 3145 6781 3", bancoComprador: "Caixa Geral de Depósitos",
    ibanDestino: "PT50 0033 0000 4528 9971 4450 5", titularDestino: "RE/MAX Coimbra Premium",
    prazoDias: "90", foro: "Coimbra",
  },
  mediadora: { nome: "RE/MAX Coimbra Premium", ami: "AMI 12894", nif: "514 220 887" },
};

const STEPS = [
  { id: 0, label: "Referência", icon: FolderPlus },
  { id: 1, label: "Documentos", icon: UploadCloud },
  { id: 2, label: "Revisão de dados", icon: ShieldCheck },
  { id: 3, label: "Contrato", icon: FileSignature },
];

/* ───────────────────────── átomos de UI ───────────────────────── */
function ConfChip({ level }) {
  const map = {
    alta: { t: "Alta", c: C.ok, b: C.okBg },
    media: { t: "Média", c: C.warn, b: C.warnBg },
    baixa: { t: "Baixa", c: C.danger, b: C.dangerBg },
  };
  const m = map[level] || map.alta;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: m.c, background: m.b }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.c }} /> {m.t}
    </span>
  );
}

function Field({ label, value, conf, mono }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: C.paper, border: `1px solid ${C.lineSoft}` }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.sub }}>{label}</span>
        {conf && <ConfChip level={conf} />}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-[13.5px]" style={{ color: value ? C.ink : C.danger, ...(mono ? { fontFamily: "ui-monospace, monospace" } : {}) }}>
          {value || "— em falta —"}
        </span>
        <Pencil size={13} style={{ color: C.sub }} className="shrink-0 cursor-pointer" />
      </div>
    </div>
  );
}

function Tok({ children }) {
  return <span className="rounded px-1 font-semibold" style={{ color: C.token, background: C.tokenBg }}>{children}</span>;
}

/* ───────────────────────── app ───────────────────────── */
export default function App() {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [toast, setToast] = useState(null);
  const d = SEED;

  const [variants, setVariants] = useState({
    depositario: "mediadora_fiel_depositaria",
    financiamento: "a_pronto",
    lei56: "nao_arrendado",
    hipoteca: true,
  });

  /* alertas derivados dos dados + variantes */
  const alerts = useMemo(() => {
    const a = [];
    if (!d.imovel.cee) a.push({ sev: "danger", t: "Certificado energético ausente", d: "Não foi encontrado certificado energético nos documentos carregados. Obrigatório para fração habitacional." });
    if (d.vendedores[0].a.conf_cc === "baixa" || !d.vendedores[0].a.val || d.vendedores[0].a.val === "—")
      a.push({ sev: "warn", t: "Validade do CC de um vendedor por confirmar", d: "Joana Margarida Sousa Pires — dígitos do CC lidos com baixa confiança e validade não detetada." });
    if (variants.depositario === "mediadora_fiel_depositaria" && !d.pagamento.ibanDestino)
      a.push({ sev: "danger", t: "IBAN de destino não associado", d: "Pagamento à mediadora sem IBAN de destino confirmado." });
    if (d.vendedores[0].titularRegisto)
      a.push({ sev: "ok", t: "Vendedores coincidem com titulares inscritos", d: "Conferido contra a certidão predial." });
    a.push({ sev: "ok", t: "Preço = sinal + remanescente", d: "345 700,00 € = 34 570,00 € + 311 130,00 €." });
    return a;
  }, [variants]);

  const blocking = alerts.filter((x) => x.sev === "danger").length;

  function runExtraction() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setExtracted(true); setStep(2); }, 1300);
  }
  function go(n) { setStep(Math.max(0, Math.min(3, n))); }

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, ...sans, color: C.ink }}>
      <div className="mx-auto flex max-w-[1180px]">
        {/* ── sidebar ── */}
        <aside className="hidden w-[208px] shrink-0 flex-col md:flex" style={{ background: C.navyDeep, minHeight: "100vh" }}>
          <div className="px-5 pt-6 pb-5">
            <div className="text-[19px] font-bold tracking-tight" style={{ ...serif, color: "#fff" }}>P&A<span style={{ color: C.goldSoft }}>·</span>Legal</div>
            <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.18em]" style={{ color: C.goldSoft }}>Contratos-Promessa</div>
          </div>
          <nav className="flex flex-col gap-0.5 px-3">
            {[["Processos", LayoutGrid, true], ["Mediadoras", Building2, false], ["Minutas", Scale, false], ["Definições", Settings, false]].map(([t, Icon, active]) => (
              <button key={t} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium"
                style={{ color: active ? "#fff" : "#A9B4C9", background: active ? C.navySoft : "transparent" }}>
                <Icon size={16} /> {t}
              </button>
            ))}
          </nav>
          <div className="mt-auto px-5 py-5 text-[11px]" style={{ color: "#7E8AA3", borderTop: `1px solid ${C.navySoft}` }}>
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.gold, color: "#fff" }}>CA</div>
              <div><div style={{ color: "#fff" }}>Cláudio Alfaiate</div><div>Solicitador · CP 8143</div></div>
            </div>
          </div>
        </aside>

        {/* ── main ── */}
        <main className="min-w-0 flex-1">
          {/* topbar */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5"
            style={{ background: "rgba(246,244,239,0.9)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-3">
              <span className="rounded-md px-2 py-1 text-[11px] font-bold" style={{ background: C.navy, color: "#fff", fontFamily: "ui-monospace, monospace" }}>{d.ref}</span>
              <span className="text-[14px] font-semibold" style={serif}>{d.titulo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                style={{ color: extracted ? C.warn : C.sub, background: extracted ? C.warnBg : "#fff", border: `1px solid ${C.line}` }}>
                <Clock size={13} /> {extracted ? "Em revisão" : "Rascunho"}
              </span>
              <div className="hidden h-7 w-7 place-items-center rounded-full sm:grid" style={{ border: `1px solid ${C.line}` }}><Search size={14} style={{ color: C.sub }} /></div>
            </div>
          </header>

          {/* stepper */}
          <div className="flex items-center gap-1 px-6 py-4">
            {STEPS.map((s, i) => {
              const active = step === s.id, done = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <button onClick={() => go(s.id)} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition"
                    style={{ background: active ? C.navy : done ? C.okBg : "#fff", color: active ? "#fff" : done ? C.ok : C.sub, border: `1px solid ${active ? C.navy : C.line}` }}>
                    {done ? <Check size={14} /> : <s.icon size={14} />}<span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className="h-px w-3 sm:w-6" style={{ background: C.line }} />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="px-6 pb-24">
            {step === 0 && <StepReferencia d={d} onNext={() => go(1)} />}
            {step === 1 && <StepDocumentos d={d} processing={processing} onRun={runExtraction} onBack={() => go(0)} />}
            {step === 2 && <StepRevisao d={d} alerts={alerts} onBack={() => go(1)} onNext={() => go(3)} />}
            {step === 3 && <StepContrato d={d} variants={variants} setVariants={setVariants} alerts={alerts} blocking={blocking}
              onBack={() => go(2)} onGenerate={() => setToast("Rascunho gerado — CPCV-2026-0412.docx pronto para revisão final.")} />}
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-xl px-4 py-3 text-[13px] font-medium shadow-lg"
          style={{ background: C.navyDeep, color: "#fff" }}>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: C.goldSoft }} /> {toast}
            <button onClick={() => setToast(null)} className="ml-2 opacity-60">✕</button></div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── passos ───────────────────────── */
function Card({ children, className = "" }) {
  return <div className={`rounded-xl p-5 ${className}`} style={{ background: C.card, border: `1px solid ${C.line}` }}>{children}</div>;
}
function SectionTitle({ icon: Icon, children, sub }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: C.navy }}><Icon size={15} color="#fff" /></div>
      <div><div className="text-[14px] font-bold" style={serif}>{children}</div>{sub && <div className="text-[11.5px]" style={{ color: C.sub }}>{sub}</div>}</div>
    </div>
  );
}
function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition"
      style={{ background: disabled ? "#B9C0CC" : C.navy, color: "#fff", cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}
function GhostBtn({ children, onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold"
    style={{ color: C.navy, border: `1px solid ${C.line}`, background: "#fff" }}>{children}</button>;
}

function StepReferencia({ d, onNext }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <SectionTitle icon={FolderPlus} sub="Identificação interna do processo">Novo processo</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Referência</label>
              <input defaultValue={d.ref} className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper, fontFamily: "ui-monospace,monospace" }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Título / imóvel</label>
              <input defaultValue={d.titulo} className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Jurista responsável</label>
              <input defaultValue="Cláudio Alfaiate" className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Escritório</label>
              <select className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }}>
                <option>Leiria</option><option>Lisboa</option><option>Porto</option><option>Figueira da Foz</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end"><PrimaryBtn onClick={onNext}>Continuar <ChevronRight size={16} /></PrimaryBtn></div>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Info}>Como funciona</SectionTitle>
        <ol className="space-y-2.5 text-[12.5px]" style={{ color: C.sub }}>
          {["Carregas a documentação das partes e do imóvel.", "A app classifica cada documento e extrai os dados.", "Reveis e corriges — campos de baixa confiança ficam assinalados.", "A minuta certa é escolhida e preenchida automaticamente.", "Tu, jurista, aprovas e geras o DOCX final."].map((t, i) => (
            <li key={i} className="flex gap-2.5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.navy, color: "#fff" }}>{i + 1}</span>{t}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function StepDocumentos({ d, processing, onRun, onBack }) {
  const zonas = [["Vendedor", Users], ["Comprador", Users], ["Imóvel", Building2], ["Pagamento / Mediadora", CreditCard]];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-4">
        <Card>
          <SectionTitle icon={UploadCloud} sub="Arrasta para a área certa ou para a zona geral — a app reclassifica se necessário">Documentos</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {zonas.map(([t, Icon]) => (
              <div key={t} className="grid place-items-center rounded-xl px-3 py-6 text-center"
                style={{ border: `1.5px dashed ${C.line}`, background: C.paper }}>
                <Icon size={18} style={{ color: C.gold }} />
                <div className="mt-1 text-[12.5px] font-semibold">{t}</div>
                <div className="text-[11px]" style={{ color: C.sub }}>arrastar ficheiros</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-bold" style={serif}>Documentos classificados</span>
            <span className="text-[11.5px]" style={{ color: C.sub }}>{d.docs.length} ficheiros</span>
          </div>
          <div className="divide-y" style={{ borderColor: C.lineSoft }}>
            {d.docs.map((doc) => (
              <div key={doc.nome} className="flex items-center gap-3 py-2.5">
                <FileText size={16} style={{ color: C.navy }} />
                <span className="min-w-0 flex-1 truncate text-[13px]" style={{ fontFamily: "ui-monospace,monospace" }}>{doc.nome}</span>
                <span className="rounded-md px-2 py-0.5 text-[11.5px] font-medium" style={{ background: C.tokenBg, color: C.token }}>{doc.tipo}</span>
                <ConfChip level={doc.conf} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Sparkles}>Extração</SectionTitle>
          <p className="text-[12.5px]" style={{ color: C.sub }}>A app vai ler os documentos, extrair os dados estruturados e prepará-los para a tua revisão. Nenhum contrato é emitido sem a tua aprovação.</p>
          <div className="mt-4">
            {processing
              ? <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: C.navy }}>
                  <span className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: C.line, borderTopColor: C.navy }} /> A extrair dados…
                </div>
              : <PrimaryBtn onClick={onRun}><Sparkles size={15} /> Extrair dados</PrimaryBtn>}
          </div>
        </Card>
        <Card>
          <div className="flex items-start gap-2 text-[12px]" style={{ color: C.sub }}>
            <ShieldCheck size={15} style={{ color: C.ok }} className="mt-0.5 shrink-0" />
            Processamento em região UE, sob contrato de subcontratação (art. 28.º RGPD) e sem treino sobre os teus dados.
          </div>
        </Card>
      </div>
      <div className="lg:col-span-3"><GhostBtn onClick={onBack}><ChevronLeft size={15} /> Voltar</GhostBtn></div>
    </div>
  );
}

function StepRevisao({ d, alerts, onBack, onNext }) {
  const v = d.vendedores[0], c = d.compradores[0], im = d.imovel, pg = d.pagamento;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-4">
        {/* vendedores */}
        <Card>
          <SectionTitle icon={Users} sub={`Bloco: casal · regime de ${v.regime}`}>Vendedores</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Vendedor 1" value={v.a.nome} conf={v.a.conf_nome} />
            <Field label="NIF" value={v.a.nif} conf={v.a.conf_nif} mono />
            <Field label="CC (dígitos)" value={v.a.cc} conf={v.a.conf_cc} mono />
            <Field label="Validade CC" value={v.a.val === "—" ? "" : v.a.val} conf="baixa" />
            <Field label="Vendedor 2" value={v.b.nome} conf={v.b.conf_nome} />
            <Field label="NIF" value={v.b.nif} conf={v.b.conf_nif} mono />
            <div className="sm:col-span-2"><Field label="Morada do casal" value={v.morada} conf="alta" /></div>
          </div>
        </Card>
        {/* comprador */}
        <Card>
          <SectionTitle icon={Users} sub="Bloco: pessoa singular">Comprador</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Nome" value={c.nome} conf={c.conf_nome} />
            <Field label="NIF" value={c.nif} conf={c.conf_nif} mono />
            <Field label="Estado civil" value={c.estadoCivil} conf="alta" />
            <Field label="CC (dígitos)" value={c.cc} conf={c.conf_cc} mono />
            <div className="sm:col-span-2"><Field label="Morada" value={c.morada} conf="alta" /></div>
          </div>
        </Card>
        {/* imovel */}
        <Card>
          <SectionTitle icon={Building2} sub="Coerência certidão × caderneta verificada">Imóvel</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Field label="Tipo" value={im.tipo} conf="alta" />
            <Field label="Fração" value={im.letra} conf="alta" />
            <Field label="Artigo matricial" value={im.artigo} conf="alta" mono />
            <div className="sm:col-span-2"><Field label="Composição" value={im.composicao} conf="media" /></div>
            <Field label="Conservatória" value={im.conservatoria} conf="alta" />
            <Field label="Descrição predial" value={`${im.descricao} / ${im.descFreg}`} conf="alta" mono />
            <Field label="Licença de utilização" value={`${im.licenca} · ${im.licencaData}`} conf="alta" mono />
            <Field label="Certificado energético" value={im.cee} conf="baixa" />
          </div>
        </Card>
        {/* pagamento */}
        <Card>
          <SectionTitle icon={CreditCard} sub="Origem ≠ destino · validado automaticamente">Pagamento</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Field label="Preço total (€)" value={pg.preco} conf="alta" mono />
            <Field label="Sinal (€)" value={pg.sinal} conf="alta" mono />
            <Field label="Remanescente (€)" value={pg.remanescente} conf="alta" mono />
            <div className="sm:col-span-3"><Field label="IBAN origem (comprador)" value={pg.ibanComprador} conf="media" mono /></div>
            <div className="sm:col-span-2"><Field label="IBAN destino (mediadora)" value={pg.ibanDestino} conf="alta" mono /></div>
            <Field label="Titular destino" value={pg.titularDestino} conf="alta" />
          </div>
        </Card>
      </div>

      {/* rail: minuta + alertas */}
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Scale}>Minuta selecionada</SectionTitle>
          <div className="rounded-lg px-3 py-2.5" style={{ background: C.okBg, border: `1px solid ${C.ok}33` }}>
            <div className="flex items-center gap-2 text-[13.5px] font-bold" style={{ color: C.ok }}><BadgeCheck size={16} /> Fração autónoma</div>
            <ul className="mt-1.5 space-y-1 text-[11.5px]" style={{ color: C.sub }}>
              <li>• Caderneta urbana com fração «C»</li>
              <li>• Licença de utilização presente</li>
              <li>• Propriedade horizontal constituída</li>
            </ul>
          </div>
          <div className="mt-2 text-[11.5px]" style={{ color: C.sub }}>Trocar manualmente:
            <select className="ml-1 rounded-md px-1.5 py-1 text-[11.5px]" style={{ border: `1px solid ${C.line}` }}>
              <option>Fração</option><option>Prédio</option><option>Rústico</option><option>Terreno construção</option><option>Bem futuro</option>
            </select>
          </div>
        </Card>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-bold" style={serif}>Alertas</span>
            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: C.dangerBg, color: C.danger }}>{alerts.filter(a => a.sev !== "ok").length} a tratar</span>
          </div>
          <div className="grid gap-2">
            {alerts.map((a, i) => {
              const cfg = a.sev === "danger" ? { I: XCircle, c: C.danger, b: C.dangerBg } : a.sev === "warn" ? { I: AlertTriangle, c: C.warn, b: C.warnBg } : { I: CheckCircle2, c: C.ok, b: C.okBg };
              return (
                <div key={i} className="rounded-lg px-2.5 py-2" style={{ background: cfg.b }}>
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: cfg.c }}><cfg.I size={14} /> {a.t}</div>
                  <div className="mt-0.5 pl-5 text-[11px]" style={{ color: C.sub }}>{a.d}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3 flex items-center justify-between">
        <GhostBtn onClick={onBack}><ChevronLeft size={15} /> Voltar</GhostBtn>
        <PrimaryBtn onClick={onNext}>Rever contrato <ChevronRight size={16} /></PrimaryBtn>
      </div>
    </div>
  );
}

function Toggle({ label, options, value, onChange }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={o.v} onClick={() => onChange(o.v)} className="rounded-md px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ background: value === o.v ? C.navy : "#fff", color: value === o.v ? "#fff" : C.sub, border: `1px solid ${value === o.v ? C.navy : C.line}` }}>{o.t}</button>
        ))}
      </div>
    </div>
  );
}

function StepContrato({ d, variants, setVariants, alerts, blocking, onBack, onGenerate }) {
  const v = d.vendedores[0], c = d.compradores[0], im = d.imovel, pg = d.pagamento;
  const set = (k) => (val) => setVariants((s) => ({ ...s, [k]: val }));
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* controlos de variante */}
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Settings} sub="As escolhas da norma de tokenização">Variantes</SectionTitle>
          <div className="grid gap-3">
            <Toggle label="Destino do sinal" value={variants.depositario} onChange={set("depositario")}
              options={[{ v: "mediadora_fiel_depositaria", t: "Mediadora (fiel depositária)" }, { v: "vendedor_direto", t: "Vendedor direto" }, { v: "mediadora_sem_deposito", t: "Mediadora s/ depósito" }]} />
            <Toggle label="Financiamento" value={variants.financiamento} onChange={set("financiamento")}
              options={[{ v: "a_pronto", t: "A pronto" }, { v: "credito_e_avaliacao", t: "Crédito + avaliação" }, { v: "so_avaliacao", t: "Só avaliação" }]} />
            <Toggle label="Declaração Lei 56/2023" value={variants.lei56} onChange={set("lei56")}
              options={[{ v: "nao_arrendado", t: "Não arrendado" }, { v: "arrendado", t: "Arrendado" }, { v: "omitir", t: "Omitir" }]} />
            <Toggle label="Hipoteca" value={variants.hipoteca} onChange={(val) => set("hipoteca")(val === "true" ? true : val === "false" ? false : val)}
              options={[{ v: true, t: "Com hipoteca" }, { v: false, t: "Sem" }]} />
          </div>
        </Card>
        <Card>
          <div className="text-[12px]" style={{ color: C.sub }}>
            <div className="mb-1 flex items-center gap-1.5 font-semibold" style={{ color: C.ink }}><Eye size={14} /> Texto a azul = campos preenchidos</div>
            Altera uma variante à esquerda e o contrato à direita atualiza-se — sem reescrever o texto fixo da minuta.
          </div>
        </Card>
      </div>

      {/* pré-visualização */}
      <div className="lg:col-span-2 grid gap-4">
        <Card className="!p-0">
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="text-[12.5px] font-bold" style={serif}>Pré-visualização do contrato</span>
            <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ background: C.tokenBg, color: C.token }}>Minuta · Fração</span>
          </div>
          <div className="max-h-[460px] overflow-auto px-7 py-6 text-[12.5px] leading-relaxed" style={{ ...serif, color: C.ink }}>
            <p className="mb-3 text-center text-[14px] font-bold">CONTRATO PROMESSA DE COMPRA E VENDA</p>
            <p className="mb-2"><b>ENTRE:</b></p>
            <p className="mb-2 text-justify">
              <Tok>{v.a.nome}</Tok>, NIF <Tok>{v.a.nif}</Tok>, e <Tok>{v.b.nome}</Tok>, NIF <Tok>{v.b.nif}</Tok>, casados entre si no regime de <Tok>{v.regime}</Tok>, residentes em <Tok>{v.morada}</Tok>, titulares dos cartões de cidadão, emitidos pela República Portuguesa, adiante designados por <b>Parte Promitente-Vendedora</b>.
            </p>
            <p className="mb-2"><b>E</b></p>
            <p className="mb-3 text-justify">
              <Tok>{c.nome}</Tok>, NIF <Tok>{c.nif}</Tok>, <Tok>{c.estadoCivil}</Tok>, residente em <Tok>{c.morada}</Tok>, titular do cartão de cidadão emitido pela República Portuguesa, adiante designado por <b>Parte Promitente-Compradora</b>.
            </p>
            <p className="my-3 text-center font-bold">CLÁUSULA PRIMEIRA <span className="font-normal italic">(Imóvel)</span></p>
            <p className="mb-2 text-justify">
              1. A Parte Promitente-Vendedora é dona e legítima possuidora da fração autónoma designada pela letra «<Tok>{im.letra}</Tok>», composta por <Tok>{im.composicao}</Tok>, descrita na Conservatória do Registo Predial de <Tok>{im.conservatoria}</Tok> sob o n.º <Tok>{im.descricao}/{im.descFreg}</Tok>, inscrita na matriz predial urbana sob o artigo <Tok>{im.artigo}</Tok>, freguesia de <Tok>{im.freguesia}</Tok>, concelho de <Tok>{im.concelho}</Tok>.
            </p>
            <p className="mb-2 text-justify">2. Licença de utilização n.º <Tok>{im.licenca}</Tok>, de <Tok>{im.licencaData}</Tok>.</p>
            <p className="mb-2 text-justify">3. Certificado de desempenho energético n.º {im.cee
              ? <Tok>{im.cee}</Tok>
              : <span className="rounded px-1 font-semibold" style={{ background: C.dangerBg, color: C.danger }}>⚠ em falta</span>}.</p>
            {variants.hipoteca && (
              <p className="mb-2 text-justify">4. Sobre a fração incide uma hipoteca voluntária a favor do <Tok>{im.hipoteca.banco}</Tok>, pela apresentação <Tok>{im.hipoteca.apres}</Tok>.</p>
            )}
            <p className="my-3 text-center font-bold">CLÁUSULA TERCEIRA <span className="font-normal italic">(Preço)</span></p>
            <p className="mb-2 text-justify">1. O preço convencionado é de <Tok>{pg.preco} €</Tok>, pago nos seguintes termos:</p>
            <p className="mb-2 text-justify">
              2. A título de sinal, o Promitente-Comprador entrega <Tok>{pg.sinal} €</Tok>, por transferência da conta com o IBAN <Tok>{pg.ibanComprador}</Tok>, pertencente à Parte Promitente-Compradora, para a conta com o IBAN <Tok>{pg.ibanDestino}</Tok>, titulada por <Tok>{pg.titularDestino}</Tok>
              {variants.depositario === "mediadora_fiel_depositaria" && <>, que ficará na posse desta na qualidade de <b>fiel depositária</b> nomeada pela Parte Promitente-Vendedora</>}
              {variants.depositario === "vendedor_direto" && <> (pagamento efetuado <b>diretamente à Parte Promitente-Vendedora</b>)</>}
              .
            </p>
            <p className="mb-2 text-justify">3. O remanescente de <Tok>{pg.remanescente} €</Tok> será pago no ato da escritura.</p>
            {variants.financiamento !== "a_pronto" && (
              <p className="mb-2 text-justify" style={{ background: C.tokenBg, borderRadius: 6, padding: "6px 8px" }}>
                4. O negócio fica dependente de {variants.financiamento === "credito_e_avaliacao" ? "obtenção de crédito à habitação e avaliação bancária" : "avaliação bancária"} favorável, nos termos fixados.
              </p>
            )}
            {variants.lei56 !== "omitir" && (
              <p className="mb-2 text-justify">
                5. A Parte Promitente-Vendedora declara que, para o imóvel, {variants.lei56 === "nao_arrendado"
                  ? "não foi celebrado contrato de arrendamento entre 08/10/2018 e 07/10/2023"
                  : "foi celebrado contrato de arrendamento sujeito a limitação de renda"}, nos termos da Lei n.º 56/2023, de 6 de outubro.
              </p>
            )}
            <p className="mt-3 text-center text-[11.5px] italic" style={{ color: C.sub }}>… cláusulas 4.ª a 14.ª seguem o texto fixo da minuta validada …</p>
          </div>
        </Card>

        {/* barra de geração */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12.5px]">
              {blocking > 0
                ? <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: C.danger }}><XCircle size={15} /> {blocking} alerta(s) bloqueante(s) — resolve antes de aprovar</span>
                : <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: C.ok }}><CheckCircle2 size={15} /> Pronto para revisão final do jurista</span>}
            </div>
            <div className="flex items-center gap-2">
              <GhostBtn onClick={onBack}><ChevronLeft size={15} /> Voltar</GhostBtn>
              <PrimaryBtn onClick={onGenerate} disabled={blocking > 0}><FileDown size={15} /> Gerar rascunho DOCX</PrimaryBtn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
