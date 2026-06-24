# P&A Legal · Automação de Contratos-Promessa (protótipo)

Protótipo clicável da aplicação de geração de CPCV. Tecnologia: **Vite + React** (Tailwind via CDN, sem passo de build de CSS).

---

## Ver localmente (opcional)

Precisas de ter o [Node.js](https://nodejs.org) instalado.

```bash
npm install
npm run dev
```

Abre o endereço que aparece (normalmente `http://localhost:5173`).

> **Login:** qualquer e-mail com `@` e qualquer palavra-passe entram. O nome do jurista responsável fica automaticamente associado à conta que usares.

---

## Pôr no GitHub

1. Cria um repositório novo em https://github.com/new (ex.: `cpcv-pa-legal`), **sem** README.
2. Na pasta do projeto, corre:

```bash
git init
git add .
git commit -m "Protótipo CPCV P&A Legal"
git branch -M main
git remote add origin https://github.com/O_TEU_UTILIZADOR/cpcv-pa-legal.git
git push -u origin main
```

---

## Publicar no Netlify

1. Entra em https://app.netlify.com → **Add new site** → **Import an existing project**.
2. Liga o **GitHub** e escolhe o repositório `cpcv-pa-legal`.
3. O Netlify lê o ficheiro `netlify.toml` e preenche tudo sozinho:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Carrega em **Deploy**. Em cerca de um minuto tens o link público.

A partir daí, cada `git push` para `main` volta a publicar automaticamente.

---

## Estrutura

```
cpcv-pa-legal/
├── index.html          → carrega Tailwind (CDN) e a app
├── netlify.toml        → configuração de deploy
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx         → toda a aplicação
```

## Notas

- É um **protótipo de interface** com dados de exemplo (uma Fração T2 em Coimbra). A extração, o login e a geração do DOCX estão simulados — servem para validar o fluxo e o desenho antes de ligar o backend real (Supabase + extração em região UE + `docxtpl` sobre as minutas tokenizadas).
- O processo de exemplo já traz, de propósito, o certificado energético e a validade de um CC por preencher, para veres os campos a amarelo e as perguntas da IA.
