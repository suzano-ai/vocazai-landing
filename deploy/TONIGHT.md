# VocazAI — Ce soir à faire (5 min)

## 1. Déployer le code (depuis votre machine ou VPS)

```bash
cd /var/www/vocazai-landing   # sur le VPS
vocazai update
```

Ou depuis votre Mac (dossier vocazai-landing) :
```bash
git add -A
git commit -m "feat: Supabase setup + agent wizard + calls transcript viewer + TTS fix"
git push origin main
```
→ Le GitHub Action déploie automatiquement sur le VPS.

---

## 2. Appliquer le schéma Supabase (une seule fois)

1. Aller sur : https://supabase.com/dashboard/project/tvqnprxjmxvacmgzjhdd/sql/new
2. Copier-coller le contenu de `deploy/supabase-schema.sql`
3. Cliquer **Run**

Résultat attendu : 4 tables créées — `profiles`, `agents`, `phone_numbers`, `calls`

---

## 3. Configurer l'auth Supabase (une seule fois)

Aller sur : https://supabase.com/dashboard/project/tvqnprxjmxvacmgzjhdd/auth/url-configuration

- **Site URL** : `https://vocazai.com`
- **Redirect URLs** : ajouter `https://vocazai.com/auth/callback`

---

## 4. Mettre à jour les variables d'env sur le VPS

Sur le VPS, éditer `/var/www/vocazai-landing/.env.local` :

```env
NEXT_PUBLIC_APP_URL=https://vocazai.com
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=re_...   ← votre clé Resend
TTS_SERVICE_URL=http://tts:8000
STT_SERVICE_URL=http://stt:9000
```

Puis : `vocazai restart`

---

## Ce qui a été construit cette nuit ✅

| Fichier | Description |
|---------|-------------|
| `deploy/supabase-schema.sql` | Schéma SQL complet prêt à exécuter |
| `agents/new/page.tsx` | Wizard de création d'agent (formulaire complet) |
| `agents/[id]/page.tsx` | Page edit/delete d'agent |
| `dashboard/page.tsx` | Stats réelles (agents, appels 7j, durée, coût) |
| `calls/page.tsx` | Liste des appels avec viewer de transcription |
| `calls/call-row.tsx` | Ligne expandable — transcription inline au clic |
| `webhooks/handler.ts` | Handler corrigé — owner_id, upsert propre |
| `demo-call-card.tsx` | TTS fixé — match exact BCP47, plus de voix croisées |
| `header.tsx` | Navbar floating pill + active states |
