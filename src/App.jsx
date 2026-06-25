import React, { useState, useMemo } from "react";

import {
  FileText, UploadCloud, CheckCircle2, AlertTriangle, XCircle, ChevronRight,
  ChevronLeft, FolderPlus, Scale, Building2, Users, ShieldCheck, Pencil, Check,
  Info, BadgeCheck, Clock, FileDown, Eye, Sparkles, Settings, LayoutGrid, Search,
  Lock, HelpCircle, StickyNote, LogIn, LogOut, FileSignature, Layers,
} from "lucide-react";

/* ── Marca P&A Legal (cores do logótipo) ── */
const C = {
  navyDeep: "#1B2C3D", navy: "#23384C", navySoft: "#36506B",
  gold: "#E8C887", goldDeep: "#CDA85E", goldSoft: "#F2D299",
  paper: "#F6F4EF", card: "#FFFFFF", ink: "#22272E", sub: "#6B7280",
  line: "#E7E2D7", lineSoft: "#F0ECE2",
  ok: "#2E7D32", okBg: "#EAF3EB", warn: "#9A6B12", warnBg: "#FBF3D6",
  danger: "#B42318", dangerBg: "#FBEAE8", token: "#1F6FEB", tokenBg: "#EAF1FE",
};

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };
const miss = { color: C.warn, background: C.warnBg, borderRadius: 4, padding: "0 4px", textDecoration: "underline", textDecorationColor: C.goldDeep, textUnderlineOffset: 2 };

/* ── utilizadores demo (login simulado) ── */
const USERS = {
  "claudio.alfaiate@pa-legal.pt": "Cláudio Alfaiate",
  "beatriz.morgado@pa-legal.pt": "Beatriz Morgado",
  "monica.pires@pa-legal.pt": "Mónica Pires",
};

const nameFromEmail = (e) =>
  USERS[e.toLowerCase()] ||
  (e.split("@")[0] || "Utilizador").split(/[._]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

const initials = (n) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

/* ── processo de exemplo ── */
const SEED = {
  ref: "CPCV-2026-0412",
  titulo: "Fração T2 · Quinta das Lágrimas, Coimbra",
  docs: [
    { nome: "certidao_predial.pdf", tipo: "Certidão predial", conf: "alta" },
    { nome: "caderneta_urbana.pdf", tipo: "Caderneta predial urbana", conf: "alta" },
    { nome: "licenca_utilizacao.pdf", tipo: "Licença de utilização", conf: "alta" },
    { nome: "documentos_diversos.pdf", tipo: "PDF combinado", conf: "media", combinado: ["CC dos vendedores", "CC do comprador", "Comprovativo de IBAN"] },
    { nome: "comunicacao_zome.pdf", tipo: "Comunicação da imobiliária", conf: "alta" },
  ],
  vendedores: [{
    regime: "comunhão de adquiridos",
    a: { nome: "Joana Margarida Sousa Pires", nif: "219 884 552", cc: "12345678 9 ZZ4", val: "", conf_nome: "alta", conf_nif: "alta", conf_cc: "baixa" },
    b: { nome: "Rui Manuel Antunes Pires", nif: "198 220 145", cc: "23456789 0 ZX1", val: "2029-04-12", conf_nome: "alta", conf_nif: "alta", conf_cc: "alta" },
    morada: "Rua Dr. António José de Almeida, 14, 3000-045 Coimbra",
  }],
  compradores: [{
    nome: "André Filipe Carvalho Lemos", nif: "245 110 988", estadoCivil: "solteiro",
    cc: "34567890 1 ZY2", val: "2031-08-03", morada: "Av. Fernão de Magalhães, 201, 3000-176 Coimbra",
    conf_nome: "alta", conf_nif: "alta", conf_cc: "alta",
  }],
  imovel: {
    tipo: "Fração autónoma", letra: "C", composicao: "T2, 99 m² úteis, com lugar de garagem",
    conservatoria: "Coimbra", descricao: "4821", descFreg: "Santo António dos Olivais",
    freguesia: "Santo António dos Olivais", concelho: "Coimbra", artigo: "9134",
    licenca: "187/2019", licencaData: "2019-06-21", cee: "", ceeValidade: "",
    hipoteca: { tem: true, banco: "Banco Santander Totta, S.A.", apres: "2456 de 2021/03/09" },
  },
  pagamento: {
    preco: "345 700,00", sinal: "34 570,00", remanescente: "311 130,00",
    ibanComprador: "PT50 0035 0651 0002 3145 6781 3", bancoComprador: "Caixa Geral de Depósitos",
    ibanDestino: "PT50 0033 0000 4528 9971 4450 5", titularDestino: "Zome — Mediação Imobiliária",
  },
};

const STEPS = [
  { id: 0, label: "Referência", icon: FolderPlus },
  { id: 1, label: "Documentos", icon: UploadCloud },
  { id: 2, label: "Revisão de dados", icon: ShieldCheck },
  { id: 3, label: "Perguntas da IA", icon: HelpCircle },
  { id: 4, label: "Contrato", icon: FileSignature },
];

/* ───────────── átomos ───────────── */
function ConfChip({ level }) {
  const m = { alta: ["Alta", C.ok, C.okBg], media: ["Média", C.warn, C.warnBg], baixa: ["Baixa", C.danger, C.dangerBg] }[level] || ["Alta", C.ok, C.okBg];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: m[1], background: m[2] }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m[1] }} /> {m[0]}
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
        {value
          ? <span className="text-[13.5px]" style={{ color: C.ink, ...(mono ? { fontFamily: "ui-monospace, monospace" } : {}) }}>{value}</span>
          : <span className="text-[13px] font-medium" style={miss}>por preencher</span>}
        <Pencil size={13} style={{ color: C.sub }} className="shrink-0 cursor-pointer" />
      </div>
    </div>
  );
}

function Tok({ children }) {
  return <span className="rounded px-1 font-semibold" style={{ color: C.token, background: C.tokenBg }}>{children}</span>;
}

function Card({ children, className = "", pad = true }) {
  return <div className={`rounded-xl ${pad ? "p-5" : ""} ${className}`} style={{ background: C.card, border: `1px solid ${C.line}` }}>{children}</div>;
}

function SectionTitle({ icon: Icon, children, sub }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: C.navy }}><Icon size={15} color={C.gold} /></div>
      <div><div className="text-[14px] font-bold" style={serif}>{children}</div>{sub && <div className="text-[11.5px]" style={{ color: C.sub }}>{sub}</div>}</div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition"
      style={{ background: disabled ? "#B9C0CC" : C.navy, color: disabled ? "#fff" : C.gold, cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold" style={{ color: C.navy, border: `1px solid ${C.line}`, background: "#fff" }}>{children}</button>;
}

/* ───────────── login ───────────── */
function Login({ onLogin }) {
  const [email, setEmail] = useState("claudio.alfaiate@pa-legal.pt");
  const [pw, setPw] = useState("");
  return (
    <div className="grid min-h-screen place-items-center px-4" style={{ background: C.navy }}>
      <div className="w-full max-w-[380px] rounded-2xl p-7" style={{ background: C.card }}>
        <div className="mb-1 text-center text-[22px] font-bold tracking-tight" style={{ ...serif, color: C.navy }}>
          P&A<span style={{ color: C.goldDeep }}> · </span>Legal
        </div>
        <div className="mb-6 text-center text-[11px] uppercase tracking-[0.2em]" style={{ color: C.goldDeep }}>Contratos-Promessa</div>
        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 mt-1 w-full rounded-lg px-3 py-2.5 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Palavra-passe</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className="mb-5 mt-1 w-full rounded-lg px-3 py-2.5 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        <button onClick={() => email.includes("@") && onLogin({ email, name: nameFromEmail(email) })}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13.5px] font-semibold" style={{ background: C.navy, color: C.gold }}>
          <LogIn size={16} /> Entrar
        </button>
        <p className="mt-4 text-center text-[11px]" style={{ color: C.sub }}>
          Ao entrar, ficas associado como <b>jurista responsável</b> dos processos que criares.
        </p>
      </div>
    </div>
  );
}

/* ───────────── app ───────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [toast, setToast] = useState(null);
  const [notas, setNotas] = useState("");
  const [respostas, setRespostas] = useState({});
  const [variants, setVariants] = useState({ depositario: "mediadora_fiel_depositaria", financiamento: "a_pronto", hipoteca: true });
  const [prazoEscritura, setPrazoEscritura] = useState("90");
  const d = SEED;
  const alerts = useMemo(() => {
    const a = [];
    if (!d.imovel.cee) a.push({ sev: "warn", t: "Certificado energético por preencher", d: "Não consta dos documentos. Pode avançar; fica assinalado a amarelo no contrato." });
    if (!d.vendedores[0].a.val) a.push({ sev: "warn", t: "Validade do CC de um vendedor por confirmar", d: "Joana M. S. Pires — CC lido com baixa confiança, validade não detetada." });
    a.push({ sev: "ok", t: "Proprietário confirmado", d: "Vendedores coincidem com os titulares na Conservatória e nas Finanças." });
    a.push({ sev: "ok", t: "Preço = sinal + remanescente", d: "345 700,00 € = 34 570,00 € + 311 130,00 €." });
    return a;
  }, []);
  if (!user) return <Login onLogin={(u) => setUser(u)} />;
  const go = (n) => setStep(Math.max(0, Math.min(4, n)));
  const runExtraction = () => { setProcessing(true); setTimeout(() => { setProcessing(false); setExtracted(true); go(2); }, 1300); };
  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      <div className="mx-auto flex max-w-[1180px]">
        {/* sidebar */}
        <aside className="hidden w-[208px] shrink-0 flex-col md:flex" style={{ background: C.navyDeep, minHeight: "100vh" }}>
          <div className="px-5 pt-6 pb-5">
            <div className="text-[19px] font-bold tracking-tight" style={{ ...serif, color: "#fff" }}>P&A<span style={{ color: C.gold }}> · </span>Legal</div>
            <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.18em]" style={{ color: C.gold }}>Contratos-Promessa</div>
          </div>
          <nav className="flex flex-col gap-0.5 px-3">
            {[["Processos", LayoutGrid, true], ["Mediadoras", Building2, false], ["Minutas", Scale, false], ["Definições", Settings, false]].map(([t, Icon, active]) => (
              <button key={t} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium" style={{ color: active ? "#fff" : "#A9B4C9", background: active ? C.navySoft : "transparent" }}>
                <Icon size={16} color={active ? C.gold : "#A9B4C9"} /> {t}
              </button>
            ))}
          </nav>
          <div className="mt-auto px-4 py-5" style={{ borderTop: `1px solid ${C.navySoft}` }}>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: "#7E8AA3" }}>
              <div className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.gold, color: C.navy }}>{initials(user.name)}</div>
              <div className="min-w-0"><div className="truncate" style={{ color: "#fff" }}>{user.name}</div><div className="truncate">{user.email}</div></div>
            </div>
            <button onClick={() => { setUser(null); setStep(0); setExtracted(false); }} className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium" style={{ color: "#A9B4C9", background: C.navy }}>
              <LogOut size={14} /> Terminar sessão
            </button>
          </div>
        </aside>
        {/* main */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5" style={{ background: "rgba(246,244,239,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-3">
              <span className="rounded-md px-2 py-1 text-[11px] font-bold" style={{ background: C.navy, color: C.gold, fontFamily: "ui-monospace, monospace" }}>{d.ref}</span>
              <span className="hidden text-[14px] font-semibold sm:inline" style={serif}>{d.titulo}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold" style={{ color: extracted ? C.warn : C.sub, background: extracted ? C.warnBg : "#fff", border: `1px solid ${C.line}` }}>
              <Clock size={13} /> {extracted ? "Em revisão" : "Rascunho"}
            </span>
          </header>
          {/* stepper */}
          <div className="flex flex-wrap items-center gap-1 px-6 py-4">
            {STEPS.map((s, i) => {
              const active = step === s.id, done = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <button onClick={() => go(s.id)} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition" style={{ background: active ? C.navy : done ? C.okBg : "#fff", color: active ? C.gold : done ? C.ok : C.sub, border: `1px solid ${active ? C.navy : C.line}` }}>
                    {done ? <Check size={14} /> : <s.icon size={14} />}<span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className="h-px w-2 sm:w-5" style={{ background: C.line }} />}
                </React.Fragment>
              );
            })}
          </div>
          <div className="px-6 pb-24">
            {step === 0 && <StepRef d={d} user={user} prazo={prazoEscritura} setPrazo={setPrazoEscritura} onNext={() => go(1)} />}
            {step === 1 && <StepDocs d={d} processing={processing} onRun={runExtraction} onBack={() => go(0)} />}
            {step === 2 && <StepRevisao d={d} alerts={alerts} onBack={() => go(1)} onNext={() => go(3)} />}
            {step === 3 && <StepPerguntas respostas={respostas} setRespostas={setRespostas} notas={notas} setNotas={setNotas} onBack={() => go(2)} onNext={() => go(4)} />}
            {step === 4 && <StepContrato d={d} variants={variants} setVariants={setVariants} prazo={prazoEscritura} notas={notas} alerts={alerts} onBack={() => go(3)} onGenerate={() => setToast("Rascunho gerado — CPCV-2026-0412.docx pronto para revisão final.")} />}
          </div>
        </main>
      </div>
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-xl px-4 py-3 text-[13px] font-medium shadow-lg" style={{ background: C.navyDeep, color: "#fff" }}>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: C.gold }} /> {toast}<button onClick={() => setToast(null)} className="ml-2 opacity-60">✕</button></div>
        </div>
      )}
    </div>
  );
}

/* ───────────── passos ───────────── */
function StepRef({ d, user, prazo, setPrazo, onNext }) {
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
              <div className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: "#EFEDE6", color: C.ink }}>
                <span>{user.name}</span><Lock size={13} style={{ color: C.sub }} />
              </div>
              <span className="mt-1 block text-[10.5px]" style={{ color: C.sub }}>Associado à tua conta — não editável.</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Escritório</label>
              <select defaultValue="Zome" className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }}>
                <option>Zome</option><option>Leiria</option><option>Lisboa</option><option>Porto</option><option>Figueira da Foz</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Prazo para a escritura (dias)</label>
              <input value={prazo} onChange={(e) => setPrazo(e.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper, fontFamily: "ui-monospace,monospace" }} />
            </div>
          </div>
          <div className="mt-4 flex justify-end"><PrimaryBtn onClick={onNext}>Continuar <ChevronRight size={16} /></PrimaryBtn></div>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Info}>Como funciona</SectionTitle>
        <ol className="space-y-2.5 text-[12.5px]" style={{ color: C.sub }}>
          {["Carregas a documentação — mesmo tudo num só PDF.", "A app separa, classifica e identifica o proprietário (Conservatória + Finanças).", "Reveis os dados; o que falta fica a amarelo.", "Respondes às dúvidas que a IA levanta.", "Aprovas e geras o DOCX — podes sempre avançar."].map((t, i) => (
            <li key={i} className="flex gap-2.5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.navy, color: C.gold }}>{i + 1}</span>{t}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function StepDocs({ d, processing, onRun, onBack }) {
  const zonas = [["Vendedor", Users], ["Comprador", Users], ["Imóvel", Building2], ["Restantes documentos", Layers]];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <Card>
          <SectionTitle icon={UploadCloud} sub="Arrasta os ficheiros — se vierem juntos num PDF, a app separa-os">Documentos</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {zonas.map(([t, Icon]) => (
              <div key={t} className="grid place-items-center rounded-xl px-3 py-6 text-center" style={{ border: `1.5px dashed ${C.line}`, background: C.paper }}>
                <Icon size={18} style={{ color: C.goldDeep }} />
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
              <div key={doc.nome} className="py-2.5">
                <div className="flex items-center gap-3">
                  <FileText size={16} style={{ color: C.navy }} />
                  <span className="min-w-0 flex-1 truncate text-[13px]" style={{ fontFamily: "ui-monospace,monospace" }}>{doc.nome}</span>
                  <span className="rounded-md px-2 py-0.5 text-[11.5px] font-medium" style={{ background: C.tokenBg, color: C.token }}>{doc.tipo}</span>
                  <ConfChip level={doc.conf} />
                </div>
                {doc.combinado && (
                  <div className="ml-7 mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]" style={{ color: C.sub }}>
                    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold" style={{ background: C.warnBg, color: C.warn }}><Layers size={11} /> PDF combinado — separado em:</span>
                    {doc.combinado.map((x) => <span key={x} className="rounded px-1.5 py-0.5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>{x}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Sparkles}>Extração</SectionTitle>
          <p className="text-[12.5px]" style={{ color: C.sub }}>A app lê os documentos, separa PDFs combinados e identifica o <b>proprietário</b> cruzando quem consta na Conservatória e nas Finanças. Nenhum contrato é emitido sem a tua aprovação.</p>
          <div className="mt-4">
            {processing
              ? <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: C.navy }}><span className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: C.line, borderTopColor: C.navy }} /> A extrair dados…</div>
              : <PrimaryBtn onClick={onRun}><Sparkles size={15} /> Extrair dados</PrimaryBtn>}
          </div>
        </Card>
        <Card>
          <div className="flex items-start gap-2 text-[12px]" style={{ color: C.sub }}>
            <ShieldCheck size={15} style={{ color: C.ok }} className="mt-0.5 shrink-0" />
            Processamento em região UE, sob subcontratação (art. 28.º RGPD) e sem treino sobre os teus dados.
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
      <div className="grid gap-4 lg:col-span-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle icon={Users} sub={`Bloco: casal · regime de ${v.regime}`}>Vendedores</SectionTitle>
            <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: C.okBg, color: C.ok }}><BadgeCheck size={13} /> Proprietário · Conservatória + Finanças</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Vendedor 1" value={v.a.nome} conf={v.a.conf_nome} />
            <Field label="NIF" value={v.a.nif} conf={v.a.conf_nif} mono />
            <Field label="CC (dígitos)" value={v.a.cc} conf={v.a.conf_cc} mono />
            <Field label="Validade CC" value={v.a.val} conf="baixa" />
            <Field label="Vendedor 2" value={v.b.nome} conf={v.b.conf_nome} />
            <Field label="NIF" value={v.b.nif} conf={v.b.conf_nif} mono />
            <div className="sm:col-span-2"><Field label="Morada do casal" value={v.morada} conf="alta" /></div>
          </div>
        </Card>
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
        <Card>
          <SectionTitle icon={FileText} sub="Origem ≠ destino · validado automaticamente">Pagamento</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Field label="Preço total (€)" value={pg.preco} conf="alta" mono />
            <Field label="Sinal (€)" value={pg.sinal} conf="alta" mono />
            <Field label="Remanescente (€)" value={pg.remanescente} conf="alta" mono />
            <div className="sm:col-span-3"><Field label="IBAN origem (comprador)" value={pg.ibanComprador} conf="media" mono /></div>
            <div className="sm:col-span-2"><Field label="IBAN destino" value={pg.ibanDestino} conf="alta" mono /></div>
            <Field label="Titular destino" value={pg.titularDestino} conf="alta" />
          </div>
        </Card>
      </div>
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Scale}>Minuta selecionada</SectionTitle>
          <div className="rounded-lg px-3 py-2.5" style={{ background: C.okBg, border: `1px solid ${C.ok}33` }}>
            <div className="flex items-center gap-2 text-[13.5px] font-bold" style={{ color: C.ok }}><BadgeCheck size={16} /> Fração autónoma</div>
            <ul className="mt-1.5 space-y-1 text-[11.5px]" style={{ color: C.sub }}>
              <li>• Caderneta urbana com fração «C»</li><li>• Licença de utilização presente</li><li>• Propriedade horizontal constituída</li>
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
            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: C.warnBg, color: C.warn }}>{alerts.filter((a) => a.sev !== "ok").length} a tratar</span>
          </div>
          <div className="grid gap-2">
            {alerts.map((a, i) => {
              const cfg = a.sev === "danger" ? [XCircle, C.danger, C.dangerBg] : a.sev === "warn" ? [AlertTriangle, C.warn, C.warnBg] : [CheckCircle2, C.ok, C.okBg];
              const I = cfg[0];
              return (
                <div key={i} className="rounded-lg px-2.5 py-2" style={{ background: cfg[2] }}>
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: cfg[1] }}><I size={14} /> {a.t}</div>
                  <div className="mt-0.5 pl-5 text-[11px]" style={{ color: C.sub }}>{a.d}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-between lg:col-span-3">
        <GhostBtn onClick={onBack}><ChevronLeft size={15} /> Voltar</GhostBtn>
        <PrimaryBtn onClick={onNext}>Perguntas da IA <ChevronRight size={16} /></PrimaryBtn>
      </div>
    </div>
  );
}

const PERGUNTAS = [
  { id: "q1", t: "Não detetei a validade do cartão de cidadão de Joana Margarida Sousa Pires. Qual é?", ph: "dd/mm/aaaa" },
  { id: "q2", t: "O certificado energético não consta dos documentos. Será entregue até à escritura, ou o CPCV deve referir a obrigação de o obter?", ph: "A tua resposta…", area: true },
  { id: "q3", t: "Confirmas que o sinal é entregue à mediadora (Zome) na qualidade de fiel depositária?", ph: "Sim / Não — observações" },
  { id: "q4", t: "Estão previstos reforços de sinal entre esta data e a escritura? Em caso afirmativo, valores e datas.", ph: "A tua resposta…", area: true },
];

function StepPerguntas({ respostas, setRespostas, notas, setNotas, onBack, onNext }) {
  const set = (id) => (e) => setRespostas((s) => ({ ...s, [id]: e.target.value }));
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <Card>
          <SectionTitle icon={HelpCircle} sub="Geradas a partir das dúvidas da extração — responde ao que puderes">Perguntas da IA</SectionTitle>
          <div className="grid gap-3.5">
            {PERGUNTAS.map((q, i) => (
              <div key={q.id} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.lineSoft}` }}>
                <div className="mb-1.5 flex gap-2 text-[13px]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.navy, color: C.gold }}>{i + 1}</span>
                  <span style={{ color: C.ink }}>{q.t}</span>
                </div>
                {q.area
                  ? <textarea value={respostas[q.id] || ""} onChange={set(q.id)} placeholder={q.ph} rows={2} className="w-full rounded-md px-2.5 py-1.5 text-[13px]" style={{ border: `1px solid ${C.line}`, background: "#fff" }} />
                  : <input value={respostas[q.id] || ""} onChange={set(q.id)} placeholder={q.ph} className="w-full rounded-md px-2.5 py-1.5 text-[13px]" style={{ border: `1px solid ${C.line}`, background: "#fff" }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={StickyNote} sub="Texto livre que será incluído no contrato">Notas que devem constar do CPCV</SectionTitle>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={8} placeholder="Ex.: estacionamento nº 14 incluído; entrega de chaves na escritura; obras de reparação a cargo do vendedor…"
            className="w-full rounded-lg px-3 py-2 text-[13px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        </Card>
        <Card>
          <div className="flex items-start gap-2 text-[12px]" style={{ color: C.sub }}>
            <Info size={15} style={{ color: C.navy }} className="mt-0.5 shrink-0" />
            Podes sempre avançar e gerar o contrato, mesmo com perguntas por responder. O que ficar em falta aparece assinalado a amarelo.
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-between lg:col-span-3">
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
          <button key={String(o.v)} onClick={() => onChange(o.v)} className="rounded-md px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ background: value === o.v ? C.navy : "#fff", color: value === o.v ? C.gold : C.sub, border: `1px solid ${value === o.v ? C.navy : C.line}` }}>{o.t}</button>
        ))}
      </div>
    </div>
  );
}

function StepContrato({ d, variants, setVariants, prazo, notas, alerts, onBack, onGenerate }) {
  const v = d.vendedores[0], c = d.compradores[0], im = d.imovel, pg = d.pagamento;
  const set = (k) => (val) => setVariants((s) => ({ ...s, [k]: val }));
  const pend = alerts.filter((a) => a.sev !== "ok").length;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Settings} sub="As escolhas da norma de tokenização">Variantes</SectionTitle>
          <div className="grid gap-3">
            <Toggle label="Destino do sinal" value={variants.depositario} onChange={set("depositario")}
              options={[{ v: "mediadora_fiel_depositaria", t: "Mediadora (fiel depositária)" }, { v: "vendedor_direto", t: "Vendedor direto" }, { v: "mediadora_sem_deposito", t: "Mediadora s/ depósito" }]} />
            <Toggle label="Financiamento" value={variants.financiamento} onChange={set("financiamento")}
              options={[{ v: "a_pronto", t: "A pronto" }, { v: "credito_e_avaliacao", t: "Crédito + avaliação" }, { v: "so_avaliacao", t: "Só avaliação" }]} />
            <Toggle label="Hipoteca" value={variants.hipoteca} onChange={set("hipoteca")} options={[{ v: true, t: "Com hipoteca" }, { v: false, t: "Sem" }]} />
          </div>
        </Card>
        <Card>
          <div className="text-[12px]" style={{ color: C.sub }}>
            <div className="mb-1 flex items-center gap-1.5 font-semibold" style={{ color: C.ink }}><Eye size={14} /> Legenda</div>
            <span className="rounded px-1 font-semibold" style={{ color: C.token, background: C.tokenBg }}>azul</span> = campo preenchido · <span className="rounded px-1 font-semibold" style={miss}>amarelo</span> = por preencher. O texto a preto é fixo.
          </div>
        </Card>
      </div>
      <div className="grid gap-4 lg:col-span-2">
        <Card pad={false}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="text-[12.5px] font-bold" style={serif}>Pré-visualização do contrato</span>
            <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ background: C.tokenBg, color: C.token }}>Minuta · Fração</span>
          </div>
          <div className="max-h-[440px] overflow-auto px-7 py-6 text-[12.5px] leading-relaxed" style={{ ...serif, color: C.ink }}>
            <p className="mb-3 text-center text-[14px] font-bold">CONTRATO PROMESSA DE COMPRA E VENDA</p>
            <p className="mb-2"><b>ENTRE:</b></p>
            <p className="mb-2 text-justify"><Tok>{v.a.nome}</Tok>, NIF <Tok>{v.a.nif}</Tok>, e <Tok>{v.b.nome}</Tok>, NIF <Tok>{v.b.nif}</Tok>, casados entre si no regime de <Tok>{v.regime}</Tok>, residentes em <Tok>{v.morada}</Tok>, adiante designados por <b>Parte Promitente-Vendedora</b>.</p>
            <p className="mb-2"><b>E</b></p>
            <p className="mb-3 text-justify"><Tok>{c.nome}</Tok>, NIF <Tok>{c.nif}</Tok>, <Tok>{c.estadoCivil}</Tok>, residente em <Tok>{c.morada}</Tok>, adiante designado por <b>Parte Promitente-Compradora</b>.</p>
            <p className="my-3 text-center font-bold">CLÁUSULA PRIMEIRA <span className="font-normal italic">(Imóvel)</span></p>
            <p className="mb-2 text-justify">1. A Parte Promitente-Vendedora é dona e legítima possuidora da fração autónoma designada pela letra «<Tok>{im.letra}</Tok>», composta por <Tok>{im.composicao}</Tok>, descrita na Conservatória do Registo Predial de <Tok>{im.conservatoria}</Tok> sob o n.º <Tok>{im.descricao}/{im.descFreg}</Tok>, inscrita na matriz predial urbana sob o artigo <Tok>{im.artigo}</Tok>, freguesia de <Tok>{im.freguesia}</Tok>, concelho de <Tok>{im.concelho}</Tok>.</p>
            <p className="mb-2 text-justify">2. Licença de utilização n.º <Tok>{im.licenca}</Tok>, de <Tok>{im.licencaData}</Tok>.</p>
            <p className="mb-2 text-justify">3. Certificado de desempenho energético n.º {im.cee ? <Tok>{im.cee}</Tok> : <span style={miss}>por preencher</span>}.</p>
            {variants.hipoteca && <p className="mb-2 text-justify">4. Sobre a fração incide uma hipoteca voluntária a favor do <Tok>{im.hipoteca.banco}</Tok>, pela apresentação <Tok>{im.hipoteca.apres}</Tok>.</p>}
            <p className="my-3 text-center font-bold">CLÁUSULA TERCEIRA <span className="font-normal italic">(Preço)</span></p>
            <p className="mb-2 text-justify">1. O preço convencionado é de <Tok>{pg.preco} €</Tok>, pago nos seguintes termos:</p>
            <p className="mb-2 text-justify">2. A título de sinal, o Promitente-Comprador entrega <Tok>{pg.sinal} €</Tok>, por transferência da conta com o IBAN <Tok>{pg.ibanComprador}</Tok>, para a conta com o IBAN <Tok>{pg.ibanDestino}</Tok>, titulada por <Tok>{pg.titularDestino}</Tok>
              {variants.depositario === "mediadora_fiel_depositaria" && <>, que ficará na posse desta na qualidade de <b>fiel depositária</b> nomeada pela Parte Promitente-Vendedora</>}
              {variants.depositario === "vendedor_direto" && <> (pagamento efetuado <b>diretamente à Parte Promitente-Vendedora</b>)</>}.</p>
            <p className="mb-2 text-justify">3. O remanescente de <Tok>{pg.remanescente} €</Tok> será pago no ato da escritura.</p>
            {variants.financiamento !== "a_pronto" && <p className="mb-2 rounded text-justify" style={{ background: C.tokenBg, padding: "6px 8px" }}>4. O negócio fica dependente de {variants.financiamento === "credito_e_avaliacao" ? "obtenção de crédito à habitação e avaliação bancária" : "avaliação bancária"} favorável, nos termos fixados.</p>}
            <p className="my-3 text-center font-bold">CLÁUSULA QUARTA <span className="font-normal italic">(Prazo)</span></p>
            <p className="mb-2 text-justify">A escritura será celebrada no prazo de <Tok>{prazo} dias</Tok> a contar da assinatura do presente contrato.</p>
            {notas.trim() && (<>
              <p className="my-3 text-center font-bold">CLÁUSULA ADICIONAL <span className="font-normal italic">(Notas)</span></p>
              <p className="mb-2 whitespace-pre-line text-justify"><Tok>{notas}</Tok></p>
            </>)}
            <p className="mt-3 text-center text-[11.5px] italic" style={{ color: C.sub }}>… restantes cláusulas seguem o texto fixo da minuta validada …</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: pend ? C.warn : C.ok }}>
              {pend ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
              {pend ? `${pend} item(s) por preencher — podes avançar à mesma` : "Tudo preenchido — pronto para revisão final"}
            </span>
            <div className="flex items-center gap-2">
              <GhostBtn onClick={onBack}><ChevronLeft size={15} /> Voltar</GhostBtn>
              <PrimaryBtn onClick={onGenerate}><FileDown size={15} /> Gerar rascunho DOCX</PrimaryBtn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
