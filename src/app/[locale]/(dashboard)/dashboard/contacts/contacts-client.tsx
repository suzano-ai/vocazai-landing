"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ContactRound, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";
import {
  createContactAction,
  updateContactAction,
  deleteContactAction,
  type ContactInput,
} from "./actions";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  notes: string | null;
};

const EMPTY: ContactInput = { name: "", phone: "", email: "", company: "", notes: "" };

export function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // contact id, or "new", or null
  const [form, setForm] = useState<ContactInput>(EMPTY);

  const openNew = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const openEdit = (c: Contact) => {
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email ?? "",
      company: c.company ?? "",
      notes: c.notes ?? "",
    });
    setEditing(c.id);
    setError(null);
  };
  const close = () => { setEditing(null); setForm(EMPTY); setError(null); };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = editing === "new"
      ? await createContactAction(form)
      : await updateContactAction(editing!, form);
    if (!r.ok) { setError(r.error ?? "Erreur"); return; }
    close();
    startTransition(() => router.refresh());
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const r = await deleteContactAction(id);
      if (!r.ok) setError(r.error ?? "Erreur");
      router.refresh();
    });
  }

  const field = (k: keyof ContactInput) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value }),
  });
  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20";

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
        >
          <Plus className="h-4 w-4" /> Nouveau contact
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border border-border bg-elevated p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">
              {editing === "new" ? "Nouveau contact" : "Modifier le contact"}
            </h2>
            <button type="button" onClick={close} aria-label="Fermer" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input {...field("name")} placeholder="Nom *" required className={inputCls} />
            <input {...field("phone")} placeholder="Téléphone *" required className={inputCls} />
            <input {...field("email")} placeholder="Email" type="email" className={inputCls} />
            <input {...field("company")} placeholder="Société" className={inputCls} />
            <textarea {...field("notes")} placeholder="Notes" rows={2} className={`${inputCls} resize-none sm:col-span-2`} />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-3 rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-saffron-50 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900"
          >
            {editing === "new" ? "Créer" : "Enregistrer"}
          </button>
        </form>
      )}

      {error && !editing && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-elevated">
        {contacts.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600">
              <ContactRound className="h-6 w-6" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Aucun contact pour le moment. Ajoutez des contacts pour lancer des campagnes d&apos;appels sortants.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Nom</th>
                <th className="px-5 py-3.5">Téléphone</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Société</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/40">
                  <td className="px-5 py-4 font-medium">{c.name}</td>
                  <td className="px-5 py-4 font-mono text-xs">{c.phone}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.company ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(c)}
                        aria-label="Modifier"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={pending}
                        aria-label="Supprimer"
                        className="text-muted-foreground transition-colors hover:text-red-600 disabled:opacity-60"
                      >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
