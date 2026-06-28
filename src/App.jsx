import React, { useState, useMemo } from "react";

import {
  FileText, UploadCloud, CheckCircle2, AlertTriangle, XCircle, ChevronRight,
  ChevronLeft, FolderPlus, Scale, Building2, Users, ShieldCheck, Pencil, Check,
  Info, BadgeCheck, Clock, FileDown, Eye, Sparkles, Settings, LayoutGrid,
  Lock, HelpCircle, StickyNote, LogIn, LogOut, FileSignature, Layers,
} from "lucide-react";

/* ── Marca P&A Legal ── */
const C = {
  navyDeep: "#1B2C3D", navy: "#23384C", navySoft: "#36506B",
  gold: "#E8C887", goldDeep: "#CDA85E", goldSoft: "#F2D299",
  paper: "#F6F4EF", card: "#FFFFFF", ink: "#22272E", sub: "#6B7280",
  line: "#E7E2D7", lineSoft: "#F0ECE2",
  ok: "#2E7D32", okBg: "#EAF3EB", warn: "#9A6B12", warnBg: "#FBF3D6",
  danger: "#B42318", dangerBg: "#FBEAE8", token: "#1F6FEB", tokenBg: "#EAF1FE",
};

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

/* ── utilizadores demo ── */
const USERS = {
  "claudio.alfaiate@pa-legal.pt": "Cláudio Alfaiate",
  "beatriz.morgado@pa-legal.pt": "Beatriz Morgado",
  "monica.pires@pa-legal.pt": "Mónica Pires",
};
const nameFromEmail = (e) =>
  USERS[e.toLowerCase()] ||
  (e.split("@")[0] || "Utilizador").split(/[._]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
const initials = (n) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

/* ── dados iniciais (editáveis) ── */
const INIT = {
  v1_nome: "Joana Margarida Sousa Pires", v1_nif: "219 884 552", v1_cc: "12345678 9 ZZ4", v1_val: "",
  v2_nome: "Rui Manuel Antunes Pires", v2_nif: "198 220 145",
  v_regime: "comunhão de adquiridos", v_morada: "Rua Dr. António José de Almeida, 14, 3000-045 Coimbra",
  c_nome: "André Filipe Carvalho Lemos", c_nif: "245 110 988", c_estado: "solteiro",
  c_cc: "34567890 1 ZY2", c_morada: "Av. Fernão de Magalhães, 201, 3000-176 Coimbra",
  im_tipo: "Fração autónoma", im_letra: "C", im_artigo: "9134",
  im_composicao: "T2, 99 m² úteis, com lugar de garagem", im_conservatoria: "Coimbra",
  im_descricao: "4821 / Santo António dos Olivais", im_freguesia: "Santo António dos Olivais", im_concelho: "Coimbra",
  im_licenca_num: "187/2019", im_licenca_data: "2019-06-21", im_cee: "",
  im_hip_banco: "Banco Santander Totta, S.A.", im_hip_apres: "2456 de 2021/03/09",
  pg_preco: "345 700,00", pg_sinal: "34 570,00", pg_remanescente: "311 130,00",
  pg_iban_comp: "PT50 0035 0651 0002 3145 6781 3", pg_banco_comp: "Caixa Geral de Depósitos",
  pg_iban_dest: "PT50 0033 0000 4528 9971 4450 5", pg_titular_dest: "Zome — Mediação Imobiliária",
  pg_prazo: "90 dias",
};
const CONF = {
  v1_nome: "alta", v1_nif: "alta", v1_cc: "baixa", v1_val: "baixa", v2_nome: "alta", v2_nif: "alta",
  v_regime: "alta", v_morada: "alta", c_nome: "alta", c_nif: "alta", c_estado: "alta", c_cc: "alta", c_morada: "alta",
  im_tipo: "alta", im_letra: "alta", im_artigo: "alta", im_composicao: "media", im_conservatoria: "alta",
  im_descricao: "alta", im_freguesia: "alta", im_concelho: "alta", im_licenca_num: "alta", im_licenca_data: "alta", im_cee: "baixa",
  pg_preco: "alta", pg_sinal: "alta", pg_remanescente: "alta", pg_iban_comp: "media", pg_banco_comp: "media",
  pg_iban_dest: "alta", pg_titular_dest: "alta", pg_prazo: "media",
};

const DOCS = [
  { nome: "certidao_predial.pdf", tipo: "Certidão predial", conf: "alta" },
  { nome: "caderneta_urbana.pdf", tipo: "Caderneta predial urbana", conf: "alta" },
  { nome: "licenca_utilizacao.pdf", tipo: "Licença de utilização", conf: "alta" },
  { nome: "documentos_diversos.pdf", tipo: "PDF combinado", conf: "media", combinado: ["CC dos vendedores", "CC do comprador", "Comprovativo de IBAN"] },
  { nome: "comunicacao_zome.pdf", tipo: "Comunicação da imobiliária", conf: "alta" },
];

const STEPS = [
  { id: 0, label: "Referência", icon: FolderPlus },
  { id: 1, label: "Documentos", icon: UploadCloud },
  { id: 2, label: "Revisão de dados", icon: ShieldCheck },
  { id: 3, label: "Negócio", icon: HelpCircle },
  { id: 4, label: "Contrato", icon: FileSignature },
];
/* ── gerar ficheiro Word (sem dependências) ── */
function gerarRascunho(v, variants, notas, ref) {
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const dep = variants.depositario === "mediadora_fiel_depositaria"
    ? ", que ficará na posse desta na qualidade de <b>fiel depositária</b> nomeada pela Parte Promitente-Vendedora"
    : variants.depositario === "vendedor_direto" ? " (pagamento efetuado <b>diretamente à Parte Promitente-Vendedora</b>)" : "";
  const fin = variants.financiamento !== "a_pronto"
    ? `<p>4. O negócio fica dependente de ${variants.financiamento === "credito_e_avaliacao" ? "obtenção de crédito à habitação e avaliação bancária" : "avaliação bancária"} favorável, nos termos fixados.</p>` : "";
  const hip = variants.hipoteca
    ? `<p>4. Sobre a fração incide uma hipoteca voluntária a favor do ${esc(v.im_hip_banco)}, pela apresentação ${esc(v.im_hip_apres)}.</p>` : "";
  const nt = notas.trim() ? `<p class='c'>CLÁUSULA ADICIONAL (Notas)</p><p>${esc(notas).replace(/\n/g, "<br>")}</p>` : "";
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${esc(ref)}</title>
<style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.5} h1{text-align:center;font-size:13pt} .c{text-align:center;font-weight:bold;margin:16px 0 2px} p{text-align:justify;margin:6px 0}</style></head>
<body>
<h1>CONTRATO PROMESSA DE COMPRA E VENDA</h1>
<p><b>ENTRE:</b></p>
<p>${esc(v.v1_nome)}, NIF ${esc(v.v1_nif)}, e ${esc(v.v2_nome)}, NIF ${esc(v.v2_nif)}, casados entre si no regime de ${esc(v.v_regime)}, residentes em ${esc(v.v_morada)}, adiante designados por <b>Parte Promitente-Vendedora</b>.</p>
<p><b>E</b></p>
<p>${esc(v.c_nome)}, NIF ${esc(v.c_nif)}, ${esc(v.c_estado)}, residente em ${esc(v.c_morada)}, adiante designado por <b>Parte Promitente-Compradora</b>.</p>
<p class='c'>CLÁUSULA PRIMEIRA (Imóvel)</p>
<p>1. A Parte Promitente-Vendedora é dona e legítima possuidora da fração autónoma designada pela letra «${esc(v.im_letra)}», composta por ${esc(v.im_composicao)}, descrita na Conservatória do Registo Predial de ${esc(v.im_conservatoria)} sob o n.º ${esc(v.im_descricao)}, inscrita na matriz predial urbana sob o artigo ${esc(v.im_artigo)}, freguesia de ${esc(v.im_freguesia)}, concelho de ${esc(v.im_concelho)}.</p>
<p>2. Licença de utilização n.º ${esc(v.im_licenca_num)}, de ${esc(v.im_licenca_data)}.</p>
<p>3. Certificado de desempenho energético n.º ${v.im_cee ? esc(v.im_cee) : "_____________ (a preencher)"}.</p>
${hip}
<p class='c'>CLÁUSULA SEGUNDA (Objeto)</p>
<p>1. Pelo presente contrato, a Parte Promitente-Vendedora promete vender e a Parte Promitente-Compradora promete comprar o imóvel identificado, livre de ónus e encargos e devoluto de pessoas e bens.</p>
<p class='c'>CLÁUSULA TERCEIRA (Preço)</p>
<p>1. O preço convencionado é de ${esc(v.pg_preco)} €, pago nos seguintes termos:</p>
<p>2. A título de sinal, a Parte Promitente-Compradora entrega ${esc(v.pg_sinal)} €, por transferência da conta com o IBAN ${esc(v.pg_iban_comp)}, para a conta com o IBAN ${esc(v.pg_iban_dest)}, titulada por ${esc(v.pg_titular_dest)}${dep}.</p>
<p>3. O remanescente de ${esc(v.pg_remanescente)} € será pago no ato da escritura.</p>
${fin}
<p class='c'>CLÁUSULA QUARTA (Prazo para a escritura)</p>
<p>A escritura pública de compra e venda será celebrada no prazo de ${esc(v.pg_prazo)} a contar da assinatura do presente contrato.</p>
${nt}
<p style='margin-top:18px;text-align:center;font-style:italic'>… restantes cláusulas seguem o texto fixo da minuta validada …</p>
<p style='margin-top:48px'>______________________________&nbsp;&nbsp;&nbsp;&nbsp;______________________________</p>
<p>Parte Promitente-Vendedora&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Parte Promitente-Compradora</p>
</body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${ref}.doc`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
/* ── átomos ── */
function ConfChip({ level }) {
  const m = { alta: ["Alta", C.ok, C.okBg], media: ["Média", C.warn, C.warnBg], baixa: ["Baixa", C.danger, C.dangerBg] }[level] || ["Alta", C.ok, C.okBg];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: m[1], background: m[2] }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m[1] }} /> {m[0]}
    </span>
  );
}

function EditField({ label, value, conf, onChange, mono }) {
  const empty = !value || !String(value).trim();
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: empty ? C.warnBg : C.paper, border: `1px solid ${empty ? C.goldDeep : C.lineSoft}` }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.sub }}>{label}</span>
        {conf && <ConfChip level={conf} />}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="por preencher…"
          className="w-full bg-transparent text-[13.5px] outline-none"
          style={{ color: empty ? C.warn : C.ink, ...(mono ? { fontFamily: "ui-monospace, monospace" } : {}) }} />
        <Pencil size={13} style={{ color: C.sub }} className="shrink-0" />
      </div>
    </div>
  );
}

function Tok({ children }) {
  const empty = !children || !String(children).trim();
  return <span className="rounded px-1 font-semibold" style={empty ? { color: C.warn, background: C.warnBg, textDecoration: "underline", textDecorationColor: C.goldDeep } : { color: C.token, background: C.tokenBg }}>{empty ? "por preencher" : children}</span>;
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

function PrimaryBtn({ children, onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold" style={{ background: C.navy, color: C.gold }}>{children}</button>;
}

function GhostBtn({ children, onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold" style={{ color: C.navy, border: `1px solid ${C.line}`, background: "#fff" }}>{children}</button>;
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
/* ── login ── */
function Login({ onLogin }) {
  const [email, setEmail] = useState("claudio.alfaiate@pa-legal.pt");
  const [pw, setPw] = useState("");
  return (
    <div className="grid min-h-screen place-items-center px-4" style={{ background: C.navy }}>
      <div className="w-full max-w-[380px] rounded-2xl p-7" style={{ background: C.card }}>
        <div className="mb-1 text-center text-[22px] font-bold tracking-tight" style={{ ...serif, color: C.navy }}>P&A<span style={{ color: C.goldDeep }}> · </span>Legal</div>
        <div className="mb-6 text-center text-[11px] uppercase tracking-[0.2em]" style={{ color: C.goldDeep }}>Contratos-Promessa</div>
        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 mt-1 w-full rounded-lg px-3 py-2.5 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Palavra-passe</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className="mb-5 mt-1 w-full rounded-lg px-3 py-2.5 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        <button onClick={() => email.includes("@") && onLogin({ email, name: nameFromEmail(email) })} className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13.5px] font-semibold" style={{ background: C.navy, color: C.gold }}>
          <LogIn size={16} /> Entrar
        </button>
        <p className="mt-4 text-center text-[11px]" style={{ color: C.sub }}>Ao entrar, ficas associado como <b>jurista responsável</b> dos processos que criares.</p>
      </div>
    </div>
  );
}
/* ── app ── */
export default function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [toast, setToast] = useState(null);
  const [vals, setVals] = useState(INIT);
  const [notas, setNotas] = useState("");
  const [respostas, setRespostas] = useState({});
  const [variants, setVariants] = useState({ depositario: "mediadora_fiel_depositaria", financiamento: "a_pronto", hipoteca: true });
  const [ref] = useState("CPCV-2026-0412");
  const set = (k) => (v) => setVals((s) => ({ ...s, [k]: v }));
  const alerts = useMemo(() => {
    const a = [];
    if (!vals.im_cee.trim()) a.push({ sev: "warn", t: "Certificado energético por preencher", d: "Não consta dos documentos. Podes avançar; fica a amarelo no contrato." });
    if (!vals.v1_val.trim()) a.push({ sev: "warn", t: "Validade do CC de um vendedor por confirmar", d: "Joana M. S. Pires — CC lido com baixa confiança." });
    a.push({ sev: "ok", t: "Proprietário confirmado", d: "Vendedores coincidem com os titulares na Conservatória e nas Finanças." });
    a.push({ sev: "ok", t: "Preço = sinal + remanescente", d: "345 700,00 € = 34 570,00 € + 311 130,00 €." });
    return a;
  }, [vals.im_cee, vals.v1_val]);
  if (!user) return <Login onLogin={setUser} />;
  const go = (n) => setStep(Math.max(0, Math.min(4, n)));
  const runExtraction = () => { setProcessing(true); setTimeout(() => { setProcessing(false); setExtracted(true); go(2); }, 1300); };
  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      <div className="mx-auto flex max-w-[1180px]">
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
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5" style={{ background: "rgba(246,244,239,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-3">
              <span className="rounded-md px-2 py-1 text-[11px] font-bold" style={{ background: C.navy, color: C.gold, fontFamily: "ui-monospace, monospace" }}>{ref}</span>
              <span className="hidden text-[14px] font-semibold sm:inline" style={serif}>Fração T2 · Quinta das Lágrimas, Coimbra</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold" style={{ color: extracted ? C.warn : C.sub, background: extracted ? C.warnBg : "#fff", border: `1px solid ${C.line}` }}>
              <Clock size={13} /> {extracted ? "Em revisão" : "Rascunho"}
            </span>
          </header>
          <div className="flex flex-wrap items-center gap-1 px-6 py-4">
            {STEPS.map((s, i) => {
              const active = step === s.id, done = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <button onClick={() => go(s.id)} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: active ? C.navy : done ? C.okBg : "#fff", color: active ? C.gold : done ? C.ok : C.sub, border: `1px solid ${active ? C.navy : C.line}` }}>
                    {done ? <Check size={14} /> : <s.icon size={14} />}<span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className="h-px w-2 sm:w-5" style={{ background: C.line }} />}
                </React.Fragment>
              );
            })}
          </div>
          <div className="px-6 pb-24">
            {step === 0 && <StepRef user={user} ref_={ref} onNext={() => go(1)} />}
            {step === 1 && <StepDocs processing={processing} onRun={runExtraction} onBack={() => go(0)} />}
            {step === 2 && <StepRevisao vals={vals} set={set} alerts={alerts} onBack={() => go(1)} onNext={() => go(3)} />}
            {step === 3 && <StepNegocio respostas={respostas} setRespostas={setRespostas} notas={notas} setNotas={setNotas} variants={variants} setVariants={setVariants} onBack={() => go(2)} onNext={() => go(4)} />}
            {step === 4 && <StepContrato vals={vals} variants={variants} notas={notas} alerts={alerts} onBack={() => go(3)} onGenerate={() => { gerarRascunho(vals, variants, notas, ref); setToast("Rascunho gerado e descarregado: " + ref + ".doc"); }} />}
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
/* ── passos ── */
function StepRef({ user, ref_, onNext }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <SectionTitle icon={FolderPlus} sub="Identificação interna do processo">Novo processo</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Referência</label>
              <input defaultValue={ref_} className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper, fontFamily: "ui-monospace,monospace" }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Título / imóvel</label>
              <input defaultValue="Fração T2 · Quinta das Lágrimas, Coimbra" className="mt-1 w-full rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.sub }}>Jurista responsável</label>
              <div className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px]" style={{ border: `1px solid ${C.line}`, background: "#EFEDE6" }}>
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
          </div>
          <div className="mt-4 flex justify-end"><PrimaryBtn onClick={onNext}>Continuar <ChevronRight size={16} /></PrimaryBtn></div>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Info}>Como funciona</SectionTitle>
        <ol className="space-y-2.5 text-[12.5px]" style={{ color: C.sub }}>
          {["Carregas a documentação — mesmo tudo num só PDF.", "A app separa, classifica e identifica o proprietário (Conservatória + Finanças).", "Reveis e editas os dados; o que falta fica a amarelo.", "Respondes às perguntas sobre o negócio.", "Geras o contrato em Word."].map((t, i) => (
            <li key={i} className="flex gap-2.5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.navy, color: C.gold }}>{i + 1}</span>{t}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
function StepDocs({ processing, onRun, onBack }) {
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
            <span className="text-[11.5px]" style={{ color: C.sub }}>{DOCS.length} ficheiros</span>
          </div>
          <div className="divide-y" style={{ borderColor: C.lineSoft }}>
            {DOCS.map((doc) => (
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
          <p className="text-[12.5px]" style={{ color: C.sub }}>A app lê os documentos, separa PDFs combinados e identifica o <b>proprietário</b> cruzando quem consta na Conservatória e nas Finanças.</p>
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
function StepRevisao({ vals, set, alerts, onBack, onNext }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={Users} sub="Bloco: casal · clica em qualquer campo para editar">Vendedores</SectionTitle>
            <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: C.okBg, color: C.ok }}><BadgeCheck size={13} /> Proprietário · Conservatória + Finanças</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <EditField label="Vendedor 1" value={vals.v1_nome} conf={CONF.v1_nome} onChange={set("v1_nome")} />
            <EditField label="NIF" value={vals.v1_nif} conf={CONF.v1_nif} onChange={set("v1_nif")} mono />
            <EditField label="CC (dígitos)" value={vals.v1_cc} conf={CONF.v1_cc} onChange={set("v1_cc")} mono />
            <EditField label="Validade CC" value={vals.v1_val} conf={CONF.v1_val} onChange={set("v1_val")} mono />
            <EditField label="Vendedor 2" value={vals.v2_nome} conf={CONF.v2_nome} onChange={set("v2_nome")} />
            <EditField label="NIF" value={vals.v2_nif} conf={CONF.v2_nif} onChange={set("v2_nif")} mono />
            <EditField label="Regime de bens" value={vals.v_regime} conf={CONF.v_regime} onChange={set("v_regime")} />
            <EditField label="Morada do casal" value={vals.v_morada} conf={CONF.v_morada} onChange={set("v_morada")} />
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Users} sub="Bloco: pessoa singular">Comprador</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <EditField label="Nome" value={vals.c_nome} conf={CONF.c_nome} onChange={set("c_nome")} />
            <EditField label="NIF" value={vals.c_nif} conf={CONF.c_nif} onChange={set("c_nif")} mono />
            <EditField label="Estado civil" value={vals.c_estado} conf={CONF.c_estado} onChange={set("c_estado")} />
            <EditField label="CC (dígitos)" value={vals.c_cc} conf={CONF.c_cc} onChange={set("c_cc")} mono />
            <div className="sm:col-span-2"><EditField label="Morada" value={vals.c_morada} conf={CONF.c_morada} onChange={set("c_morada")} /></div>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Building2} sub="Todos os campos editáveis">Imóvel</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <EditField label="Tipo" value={vals.im_tipo} conf={CONF.im_tipo} onChange={set("im_tipo")} />
            <EditField label="Fração" value={vals.im_letra} conf={CONF.im_letra} onChange={set("im_letra")} />
            <EditField label="Artigo matricial" value={vals.im_artigo} conf={CONF.im_artigo} onChange={set("im_artigo")} mono />
            <div className="sm:col-span-3"><EditField label="Composição" value={vals.im_composicao} conf={CONF.im_composicao} onChange={set("im_composicao")} /></div>
            <EditField label="Conservatória" value={vals.im_conservatoria} conf={CONF.im_conservatoria} onChange={set("im_conservatoria")} />
            <div className="sm:col-span-2"><EditField label="Descrição predial" value={vals.im_descricao} conf={CONF.im_descricao} onChange={set("im_descricao")} mono /></div>
            <EditField label="Freguesia" value={vals.im_freguesia} conf={CONF.im_freguesia} onChange={set("im_freguesia")} />
            <EditField label="Concelho" value={vals.im_concelho} conf={CONF.im_concelho} onChange={set("im_concelho")} />
            <EditField label="Licença util. (n.º)" value={vals.im_licenca_num} conf={CONF.im_licenca_num} onChange={set("im_licenca_num")} mono />
            <EditField label="Licença util. (data)" value={vals.im_licenca_data} conf={CONF.im_licenca_data} onChange={set("im_licenca_data")} mono />
            <EditField label="Certificado energético" value={vals.im_cee} conf={CONF.im_cee} onChange={set("im_cee")} />
          </div>
        </Card>
        <Card>
          <SectionTitle icon={FileText} sub="Inclui o prazo para a escritura (também extraído)">Pagamento</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <EditField label="Preço total (€)" value={vals.pg_preco} conf={CONF.pg_preco} onChange={set("pg_preco")} mono />
            <EditField label="Sinal (€)" value={vals.pg_sinal} conf={CONF.pg_sinal} onChange={set("pg_sinal")} mono />
            <EditField label="Remanescente (€)" value={vals.pg_remanescente} conf={CONF.pg_remanescente} onChange={set("pg_remanescente")} mono />
            <div className="sm:col-span-3"><EditField label="IBAN origem (comprador)" value={vals.pg_iban_comp} conf={CONF.pg_iban_comp} onChange={set("pg_iban_comp")} mono /></div>
            <div className="sm:col-span-2"><EditField label="IBAN destino" value={vals.pg_iban_dest} conf={CONF.pg_iban_dest} onChange={set("pg_iban_dest")} mono /></div>
            <EditField label="Titular destino" value={vals.pg_titular_dest} conf={CONF.pg_titular_dest} onChange={set("pg_titular_dest")} />
            <EditField label="Prazo para a escritura" value={vals.pg_prazo} conf={CONF.pg_prazo} onChange={set("pg_prazo")} />
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
        <PrimaryBtn onClick={onNext}>Perguntas sobre o negócio <ChevronRight size={16} /></PrimaryBtn>
      </div>
    </div>
  );
}
const PERGUNTAS = [
  { id: "q1", t: "Não detetei a validade do cartão de cidadão de Joana Margarida Sousa Pires. Qual é?", ph: "dd/mm/aaaa" },
  { id: "q2", t: "O certificado energético não consta dos documentos. Será entregue até à escritura, ou o CPCV deve referir a obrigação de o obter?", ph: "A tua resposta…", area: true },
  { id: "q3", t: "Estão previstos reforços de sinal entre esta data e a escritura? Em caso afirmativo, valores e datas.", ph: "A tua resposta…", area: true },
];

function StepNegocio({ respostas, setRespostas, notas, setNotas, variants, setVariants, onBack, onNext }) {
  const setR = (id) => (e) => setRespostas((s) => ({ ...s, [id]: e.target.value }));
  const setV = (k) => (val) => setVariants((s) => ({ ...s, [k]: val }));
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <Card>
          <SectionTitle icon={Settings} sub="Condições que definem a redação do contrato">Condições do negócio</SectionTitle>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Toggle label="Destino do sinal" value={variants.depositario} onChange={setV("depositario")}
              options={[{ v: "mediadora_fiel_depositaria", t: "Mediadora (fiel depositária)" }, { v: "vendedor_direto", t: "Vendedor direto" }, { v: "mediadora_sem_deposito", t: "Mediadora s/ depósito" }]} />
            <Toggle label="Financiamento" value={variants.financiamento} onChange={setV("financiamento")}
              options={[{ v: "a_pronto", t: "A pronto" }, { v: "credito_e_avaliacao", t: "Crédito + avaliação" }, { v: "so_avaliacao", t: "Só avaliação" }]} />
            <Toggle label="Hipoteca" value={variants.hipoteca} onChange={setV("hipoteca")} options={[{ v: true, t: "Com hipoteca" }, { v: false, t: "Sem" }]} />
          </div>
        </Card>
        <Card>
          <SectionTitle icon={HelpCircle} sub="Geradas a partir das dúvidas da extração">Perguntas da IA</SectionTitle>
          <div className="grid gap-3.5">
            {PERGUNTAS.map((q, i) => (
              <div key={q.id} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.lineSoft}` }}>
                <div className="mb-1.5 flex gap-2 text-[13px]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: C.navy, color: C.gold }}>{i + 1}</span>
                  <span style={{ color: C.ink }}>{q.t}</span>
                </div>
                {q.area
                  ? <textarea value={respostas[q.id] || ""} onChange={setR(q.id)} placeholder={q.ph} rows={2} className="w-full rounded-md px-2.5 py-1.5 text-[13px]" style={{ border: `1px solid ${C.line}`, background: "#fff" }} />
                  : <input value={respostas[q.id] || ""} onChange={setR(q.id)} placeholder={q.ph} className="w-full rounded-md px-2.5 py-1.5 text-[13px]" style={{ border: `1px solid ${C.line}`, background: "#fff" }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={StickyNote} sub="Texto livre que será incluído no contrato">Notas que devem constar do CPCV</SectionTitle>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={8} placeholder="Ex.: estacionamento n.º 14 incluído; entrega de chaves na escritura; obras de reparação a cargo do vendedor…" className="w-full rounded-lg px-3 py-2 text-[13px]" style={{ border: `1px solid ${C.line}`, background: C.paper }} />
        </Card>
        <Card>
          <div className="flex items-start gap-2 text-[12px]" style={{ color: C.sub }}>
            <Info size={15} style={{ color: C.navy }} className="mt-0.5 shrink-0" /> Podes sempre avançar e gerar o contrato, mesmo com perguntas por responder.
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
function StepContrato({ vals, variants, notas, alerts, onBack, onGenerate }) {
  const pend = alerts.filter((a) => a.sev !== "ok").length;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid content-start gap-4">
        <Card>
          <SectionTitle icon={Eye} sub="Lê os dados que editaste">Resumo</SectionTitle>
          <div className="grid gap-1.5 text-[12px]" style={{ color: C.sub }}>
            <div className="flex justify-between"><span>Destino do sinal</span><b style={{ color: C.ink }}>{variants.depositario === "mediadora_fiel_depositaria" ? "Mediadora" : variants.depositario === "vendedor_direto" ? "Vendedor" : "Mediadora s/ dep."}</b></div>
            <div className="flex justify-between"><span>Financiamento</span><b style={{ color: C.ink }}>{variants.financiamento === "a_pronto" ? "A pronto" : variants.financiamento === "credito_e_avaliacao" ? "Crédito+aval." : "Só avaliação"}</b></div>
            <div className="flex justify-between"><span>Hipoteca</span><b style={{ color: C.ink }}>{variants.hipoteca ? "Com" : "Sem"}</b></div>
            <div className="flex justify-between"><span>Prazo escritura</span><b style={{ color: C.ink }}>{vals.pg_prazo || "—"}</b></div>
          </div>
          <div className="mt-3 text-[11.5px]" style={{ color: C.sub }}>
            <span className="rounded px-1 font-semibold" style={{ color: C.token, background: C.tokenBg }}>azul</span> = preenchido · <span className="rounded px-1 font-semibold" style={{ color: C.warn, background: C.warnBg }}>amarelo</span> = por preencher.
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
            <p className="mb-2 text-justify"><Tok>{vals.v1_nome}</Tok>, NIF <Tok>{vals.v1_nif}</Tok>, e <Tok>{vals.v2_nome}</Tok>, NIF <Tok>{vals.v2_nif}</Tok>, casados entre si no regime de <Tok>{vals.v_regime}</Tok>, residentes em <Tok>{vals.v_morada}</Tok>, adiante designados por <b>Parte Promitente-Vendedora</b>.</p>
            <p className="mb-2"><b>E</b></p>
            <p className="mb-3 text-justify"><Tok>{vals.c_nome}</Tok>, NIF <Tok>{vals.c_nif}</Tok>, <Tok>{vals.c_estado}</Tok>, residente em <Tok>{vals.c_morada}</Tok>, adiante designado por <b>Parte Promitente-Compradora</b>.</p>
            <p className="my-3 text-center font-bold">CLÁUSULA PRIMEIRA <span className="font-normal italic">(Imóvel)</span></p>
            <p className="mb-2 text-justify">1. A Parte Promitente-Vendedora é dona e legítima possuidora da fração autónoma designada pela letra «<Tok>{vals.im_letra}</Tok>», composta por <Tok>{vals.im_composicao}</Tok>, descrita na Conservatória do Registo Predial de <Tok>{vals.im_conservatoria}</Tok> sob o n.º <Tok>{vals.im_descricao}</Tok>, inscrita na matriz predial urbana sob o artigo <Tok>{vals.im_artigo}</Tok>, freguesia de <Tok>{vals.im_freguesia}</Tok>, concelho de <Tok>{vals.im_concelho}</Tok>.</p>
            <p className="mb-2 text-justify">2. Licença de utilização n.º <Tok>{vals.im_licenca_num}</Tok>, de <Tok>{vals.im_licenca_data}</Tok>.</p>
            <p className="mb-2 text-justify">3. Certificado de desempenho energético n.º <Tok>{vals.im_cee}</Tok>.</p>
            {variants.hipoteca && <p className="mb-2 text-justify">4. Sobre a fração incide uma hipoteca voluntária a favor do <Tok>{vals.im_hip_banco}</Tok>, pela apresentação <Tok>{vals.im_hip_apres}</Tok>.</p>}
            <p className="my-3 text-center font-bold">CLÁUSULA TERCEIRA <span className="font-normal italic">(Preço)</span></p>
            <p className="mb-2 text-justify">1. O preço convencionado é de <Tok>{vals.pg_preco} €</Tok>, pago nos seguintes termos:</p>
            <p className="mb-2 text-justify">2. A título de sinal, a Parte Promitente-Compradora entrega <Tok>{vals.pg_sinal} €</Tok>, por transferência da conta com o IBAN <Tok>{vals.pg_iban_comp}</Tok>, para a conta com o IBAN <Tok>{vals.pg_iban_dest}</Tok>, titulada por <Tok>{vals.pg_titular_dest}</Tok>
              {variants.depositario === "mediadora_fiel_depositaria" && <>, que ficará na posse desta na qualidade de <b>fiel depositária</b> nomeada pela Parte Promitente-Vendedora</>}
              {variants.depositario === "vendedor_direto" && <> (pagamento efetuado <b>diretamente à Parte Promitente-Vendedora</b>)</>}.</p>
            <p className="mb-2 text-justify">3. O remanescente de <Tok>{vals.pg_remanescente} €</Tok> será pago no ato da escritura.</p>
            {variants.financiamento !== "a_pronto" && <p className="mb-2 rounded text-justify" style={{ background: C.tokenBg, padding: "6px 8px" }}>4. O negócio fica dependente de {variants.financiamento === "credito_e_avaliacao" ? "obtenção de crédito à habitação e avaliação bancária" : "avaliação bancária"} favorável, nos termos fixados.</p>}
            <p className="my-3 text-center font-bold">CLÁUSULA QUARTA <span className="font-normal italic">(Prazo para a escritura)</span></p>
            <p className="mb-2 text-justify">A escritura pública de compra e venda será celebrada no prazo de <Tok>{vals.pg_prazo}</Tok> a contar da assinatura do presente contrato.</p>
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
              <PrimaryBtn onClick={onGenerate}><FileDown size={15} /> Gerar rascunho (Word)</PrimaryBtn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
