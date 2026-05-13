# Setup VocazAI

## Prérequis

- Node.js ≥ 20
- Un compte **Supabase** (gratuit) — https://supabase.com
- Un compte **Vapi** (https://vapi.ai) **et/ou** **Retell** (https://retellai.com)
- Un compte **Render** (https://render.com) pour le déploiement

## 1. Supabase

### Créer le projet

1. https://supabase.com/dashboard/projects → New project
2. Région : `eu-west-3` (Paris) recommandé pour latence MA/Afrique francophone
3. Note le mot de passe DB

### Récupérer les clés

`Project Settings → API` :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (jamais côté client)

### Appliquer le schéma

Dans Supabase `SQL Editor`, colle le contenu de [`src/db/migrations/0001_initial.sql`](../src/db/migrations/0001_initial.sql) et exécute.

### Auth

`Authentication → Providers` :
- Email (magic link activé par défaut)

`Authentication → URL Configuration` :
- Site URL : `https://vocazai.com` (et `http://localhost:3000` en dev)
- Redirect URLs : `https://vocazai.com/auth/callback`, `http://localhost:3000/auth/callback`

## 2. Vapi

1. https://dashboard.vapi.ai → API Keys → `VAPI_API_KEY`
2. Server URL (webhooks) : `https://vocazai.com/api/webhooks/vapi`
3. Server URL Secret → `VAPI_WEBHOOK_SECRET`

Voix recommandées FR : ElevenLabs `pNInz6obpgDQGcFmaJgB` (Adam) ou Cartesia.

## 3. Retell (optionnel)

1. https://dashboard.retellai.com → API Keys → `RETELL_API_KEY`
2. Webhook URL : `https://vocazai.com/api/webhooks/retell`
3. Webhook Secret → `RETELL_WEBHOOK_SECRET`

## 4. Dev local

```bash
cp .env.example .env.local
# remplir les clés
npm install
npm run dev
```

→ http://localhost:3000

Pour tester les webhooks en local : `ngrok http 3000` et mets l'URL ngrok dans Vapi/Retell.

## 5. Déploiement Render

Le fichier `render.yaml` à la racine configure le service Web Service Node automatiquement.

1. Render Dashboard → Blueprints → New Blueprint Instance
2. Connecte ton repo `suzano-ai/vocazai-landing` (branche `main`)
3. Render lit `render.yaml`, prévisualise le service `vocazai`
4. Apply
5. **Crucial** : Dans `Settings → Environment`, ajoute toutes les variables (Supabase, Vapi, Retell)
6. Manual Deploy → Clear build cache & deploy

À chaque push sur `main`, Render redéploie automatiquement.

### Custom domain `vocazai.com`

Si le DNS pointait précédemment sur GitHub Pages :
1. Render Dashboard → ton service → `Settings → Custom Domains` → add `vocazai.com` + `www.vocazai.com`
2. Render te donne les enregistrements DNS (`A` ou `CNAME`)
3. Configure-les chez ton registrar
4. Render attend la propagation puis émet le certif SSL

## 6. Premier test

1. `https://vocazai.com/login` → magic link
2. Crée une organisation (via SQL pour l'instant) :

```sql
select create_organization('Ma Société', 'ma-societe');
```

3. Va sur `/dashboard/agents` → New agent
4. Achète un numéro Vapi/Retell, attache-le à l'agent
5. Appelle le numéro

## Troubleshooting

- **Build Render échoue avec "Module not found"** → vérifier `npm ci` passe en local, pousser `package-lock.json`
- **Site répond 500 en prod** → variables d'env manquantes sur Render
- **Invalid signature dans webhook_events** → vérifier que `*_WEBHOOK_SECRET` correspond à ce qui est configuré côté provider
- **Magic link ne marche pas** → vérifier la Site URL et les Redirect URLs dans Supabase
