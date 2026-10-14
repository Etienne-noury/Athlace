import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const TYPES = ["text", "number", "boolean", "select", "multiselect"] as const;
type QType = (typeof TYPES)[number];
const TYPE_LABELS: Record<QType, string> = {
  text: "Texte",
  number: "Nombre",
  boolean: "Oui / Non",
  select: "Choix unique",
  multiselect: "Choix multiples",
};

interface Question {
  id: string;
  federation_code: string | null;
  key: string;
  label: string;
  help: string | null;
  type: QType;
  options: string[] | null;
  sort: number;
  active: boolean;
}

interface Draft {
  id?: string;
  federation_code: string;
  key: string;
  label: string;
  help: string;
  type: QType;
  options: string;
  sort: string;
}

const EMPTY: Draft = { federation_code: "", key: "", label: "", help: "", type: "text", options: "", sort: "0" };

const toDraft = (q: Question): Draft => ({
  id: q.id,
  federation_code: q.federation_code ?? "",
  key: q.key,
  label: q.label,
  help: q.help ?? "",
  type: q.type,
  options: (q.options ?? []).join(", "),
  sort: String(q.sort),
});

const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

export function SportQuestionsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["sport-questions-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sport_questions")
        .select("*")
        .order("federation_code", { ascending: true, nullsFirst: true })
        .order("sort")
        .order("key");
      if (error) throw error;
      return (data ?? []) as Question[];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["sport-questions-admin"] });

  const save = async () => {
    if (!draft) return;
    if (!draft.key.trim() || !draft.label.trim()) {
      toast({ title: "Clé et libellé obligatoires", variant: "destructive" });
      return;
    }
    const needsOptions = draft.type === "select" || draft.type === "multiselect";
    const options = draft.options.split(",").map((s) => s.trim()).filter(Boolean);
    const row = {
      federation_code: draft.federation_code.trim().toUpperCase() || null,
      key: draft.key.trim(),
      label: draft.label.trim(),
      help: draft.help.trim() || null,
      type: draft.type,
      options: needsOptions ? options : null,
      sort: Number.parseInt(draft.sort, 10) || 0,
    };
    setSaving(true);
    const { error } = draft.id
      ? await supabase.from("sport_questions").update(row).eq("id", draft.id)
      : await supabase.from("sport_questions").insert(row);
    setSaving(false);
    if (error) {
      toast({ title: "Enregistrement impossible", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: draft.id ? "Question modifiée" : "Question ajoutée" });
    setDraft(null);
    refresh();
  };

  const toggleActive = async (q: Question) => {
    const { error } = await supabase.from("sport_questions").update({ active: !q.active }).eq("id", q.id);
    if (error) toast({ title: "Modification impossible", description: error.message, variant: "destructive" });
    refresh();
  };

  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const k = q.federation_code ?? "";
    groups.set(k, [...(groups.get(k) ?? []), q]);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-ink">Questions par sport</h2>
          <p className="text-small text-slate-600">
            Questions posées aux clubs dans le questionnaire. Sans fédération = commune à tous les sports.
          </p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...EMPTY })}>Ajouter</Button>}
      </div>

      {draft && (
        <Card className="space-y-4 p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            {draft.id ? "Modifier la question" : "Nouvelle question"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>Fédération (sigle, vide = commune)</span>
              <Input value={draft.federation_code} onChange={(e) => setDraft({ ...draft, federation_code: e.target.value })} placeholder="FFESSM" />
            </label>
            <label className="space-y-1 text-sm">
              <span>Clé *</span>
              <Input value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} placeholder="materiel_prete" />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span>Libellé *</span>
              <Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span>Aide</span>
              <Input value={draft.help} onChange={(e) => setDraft({ ...draft, help: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">
              <span>Type</span>
              <select className={selectCls} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as QType })}>
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Ordre</span>
              <Input type="number" value={draft.sort} onChange={(e) => setDraft({ ...draft, sort: e.target.value })} />
            </label>
            {(draft.type === "select" || draft.type === "multiselect") && (
              <label className="space-y-1 text-sm sm:col-span-2">
                <span>Options (séparées par des virgules)</span>
                <Input value={draft.options} onChange={(e) => setDraft({ ...draft, options: e.target.value })} placeholder="Aucun, Partiel, Tout" />
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>Enregistrer</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>Annuler</Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <p className="text-small text-slate-600">Chargement…</p>
      ) : (
        [...groups.entries()].map(([fed, list]) => (
          <div key={fed || "common"} className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-ink">{fed || "Questions communes"}</h3>
            <div className="divide-y rounded-2xl border bg-surface">
              {list.map((q) => (
                <div key={q.id} className={`flex items-center gap-4 p-4 ${q.active ? "" : "opacity-50"}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{q.label}</p>
                    <p className="text-small text-slate-600">
                      {q.key} · {TYPE_LABELS[q.type]}
                      {q.options?.length ? ` · ${q.options.join(", ")}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-small">
                    <Switch checked={q.active} onCheckedChange={() => toggleActive(q)} aria-label={q.active ? "Désactiver" : "Activer"} />
                    <span className="w-14">{q.active ? "Active" : "Inactive"}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDraft(toDraft(q))}>Modifier</Button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
