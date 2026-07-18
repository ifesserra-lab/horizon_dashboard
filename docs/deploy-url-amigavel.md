# URL amigável (Vercel / Render / Netlify / Cloudflare)

O site roda no **GitHub Pages** num subcaminho
(`https://ifesserra-lab.github.io/horizon_dashboard/`). Para uma URL amigável
**na raiz**, publique o mesmo repositório numa dessas plataformas — é um deploy
de verdade (build do Astro), não um redirect.

O repo já está preparado: `astro.config.mjs` lê `SITE_BASE` (padrão
`/horizon_dashboard/` para o Pages) e `SITE_URL`. Para a raiz, use `SITE_BASE=/`.
O GitHub Pages continua funcionando sem mudança.

## Vercel — `nome.vercel.app`
1. vercel.com → **Add New… → Project** → importe `ifesserra-lab/horizon_dashboard`.
2. Framework: **Astro** (detecta sozinho; `vercel.json` já define build/saída).
3. **Settings → Environment Variables**: adicione `SITE_BASE = /`
   (e opcional `SITE_URL = https://SEU-PROJETO.vercel.app`).
4. **Deploy**. URL: `https://SEU-PROJETO.vercel.app` (renomeável em Settings → Domains).

## Render — `nome.onrender.com`
1. render.com → **New → Blueprint** e aponte para o repo (usa o `render.yaml`,
   que já define build, saída `dist` e `SITE_BASE=/`). Ou **New → Static Site**:
   build `npm ci && npm run build`, publish `dist`, env `SITE_BASE=/`.
2. **Create**. URL: `https://horizon-dashboard.onrender.com`.

## Netlify / Cloudflare Pages (equivalente)
- Build: `npm run build` · Publish: `dist` · Env: `SITE_BASE=/`.
- URLs: `nome.netlify.app` / `nome.pages.dev`.

## Domínio próprio (melhor a longo prazo)
- Em qualquer uma acima: **Add Custom Domain** e aponte o DNS (CNAME).
- Ou no **próprio GitHub Pages**: Settings → Pages → Custom domain (cria `CNAME`);
  aí o site passa a servir na raiz do domínio — defina `SITE_BASE=/` no build.

## Observações
- Deixe **um** ambiente como canônico para SEO (defina `SITE_URL` só nele; nos
  outros, evite indexar ou use `rel=canonical`).
- O deploy automático semanal de dados (`sync-etl-data.yml`) roda no GitHub; ao
  fazer push na `main`, Vercel/Render/Netlify reconstroem sozinhos.
