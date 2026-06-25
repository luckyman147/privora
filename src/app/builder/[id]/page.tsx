'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { saveForm, publishForm } from '../actions';
import { calcTrustScore } from '@/lib/types';
import { TRUST_LABELS, newQuestionId } from '@/lib/utils';
import { toast } from 'sonner';
import type { Form, Question, QuestionType, TrustConfig } from '@/lib/types';

// ── icon map ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  short_text:      { label: 'Short Text',      icon: <span className="font-bold text-sm">T</span>,   color: 'bg-violet-100 text-violet-600' },
  long_text:       { label: 'Long Text',        icon: <span className="font-bold text-sm">¶</span>,   color: 'bg-violet-100 text-violet-600' },
  multiple_choice: { label: 'Multiple Choice',  icon: <span className="text-sm">●</span>,             color: 'bg-sky-100 text-sky-600' },
  checkboxes:      { label: 'Checkboxes',       icon: <span className="text-sm">☑</span>,            color: 'bg-sky-100 text-sky-600' },
  dropdown:        { label: 'Dropdown',          icon: <span className="text-sm">▾</span>,             color: 'bg-sky-100 text-sky-600' },
  rating:          { label: 'Rating',            icon: <span className="text-sm">★</span>,             color: 'bg-amber-100 text-amber-500' },
  matrix:          { label: 'Matrix',            icon: <span className="text-sm">⊞</span>,             color: 'bg-slate-100 text-slate-500' },
};

const SIDEBAR_TYPES: QuestionType[] = [
  'short_text', 'long_text', 'multiple_choice', 'checkboxes', 'dropdown', 'rating', 'matrix',
];

const CHOICE_TYPES: QuestionType[] = ['multiple_choice', 'checkboxes', 'dropdown'];

// ── icon badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' }) {
  const meta = TYPE_META[type] ?? TYPE_META.short_text;
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9';
  return (
    <span className={`${sz} ${meta.color} rounded-lg flex items-center justify-center shrink-0`}>
      {meta.icon}
    </span>
  );
}

// ── toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-sky-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const params = useParams();
  const formId = params?.id as string;

  const [form, setForm]         = useState<Form | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!formId) return;
    (createClient() as any)
      .from('forms').select('*').eq('id', formId).single()
      .then(({ data }: any) => {
        setForm(data as Form);
        if (data?.questions?.length) setSelectedId(data.questions[0].id);
      });
  }, [formId]);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selected    = form.questions.find(q => q.id === selectedId) ?? null;
  const trustScore  = calcTrustScore(form.trust_config);
  const trustColor  = trustScore === 5 ? 'text-emerald-600 border-emerald-300 bg-emerald-50'
                    : trustScore >= 3   ? 'text-amber-600 border-amber-300 bg-amber-50'
                    :                    'text-red-600 border-red-300 bg-red-50';
  const trustDot    = trustScore === 5 ? 'bg-emerald-500' : trustScore >= 3 ? 'bg-amber-400' : 'bg-red-500';

  // ── helpers ────────────────────────────────────────────────────────────────

  function addQuestion(type: QuestionType) {
    const q: Question = {
      id: newQuestionId(),
      type,
      label: `New ${(TYPE_META[type]?.label ?? type)} question`,
      required: false,
      options: CHOICE_TYPES.includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    setForm(f => ({ ...f!, questions: [...f!.questions, q] }));
    setSelectedId(q.id);
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setForm(f => ({
      ...f!,
      questions: f!.questions.map(q => q.id === id ? { ...q, ...patch } : q),
    }));
  }

  function deleteQuestion(id: string) {
    if (!form) return;
    const idx = form.questions.findIndex(q => q.id === id);
    setForm(f => ({ ...f!, questions: f!.questions.filter(q => q.id !== id) }));
    const remaining = form.questions.filter(q => q.id !== id);
    setSelectedId(remaining[Math.max(0, idx - 1)]?.id ?? null);
  }

  function updateTrust(patch: Partial<TrustConfig>) {
    setForm(f => ({ ...f!, trust_config: { ...f!.trust_config, ...patch } }));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try { await saveForm(form); toast.success('Draft saved'); }
    catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  }

  async function handlePublish() {
    if (!form) return;
    setSaving(true);
    try { await publishForm(form.id); toast.success('Form published!'); }
    catch { toast.error('Publish failed'); }
    finally { setSaving(false); }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">

      {/* ── Top bar ── */}
      <header className="h-14 border-b border-slate-200 flex items-center px-5 gap-4 shrink-0 bg-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 transition hover:bg-slate-50"
        >
          ← Back
        </Link>

        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f!, title: e.target.value }))}
          className="flex-1 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none min-w-0"
        />

        {/* Mode toggle */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm font-medium">
          <button
            onClick={() => setForm(f => ({ ...f!, mode: 'survey' }))}
            className={`px-4 py-1.5 transition ${form.mode === 'survey' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Survey
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={() => setForm(f => ({ ...f!, mode: 'election' }))}
            className={`px-4 py-1.5 transition ${form.mode === 'election' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Election
          </button>
        </div>

        {/* Trust score badge */}
        <div className={`flex items-center gap-1.5 text-sm font-semibold border rounded-full px-3 py-1 ${trustColor}`}>
          <span className={`w-2 h-2 rounded-full ${trustDot}`} />
          Trust {trustScore}/5
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-1.5 hover:bg-slate-50 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          onClick={handlePublish}
          disabled={saving}
          className="text-sm font-semibold text-white bg-sky-500 rounded-lg px-4 py-1.5 hover:bg-sky-600 transition disabled:opacity-50"
        >
          Publish
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar: question types + trust config ── */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0">
          <div className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Question Types
            </p>
            <div className="space-y-1">
              {SIDEBAR_TYPES.map(type => {
                const meta = TYPE_META[type];
                return (
                  <button
                    key={type}
                    onClick={() => addQuestion(type)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition group"
                  >
                    <TypeBadge type={type} />
                    <span className="font-medium">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust config summary */}
          <div className="mt-auto p-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Trust Score Config
            </p>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Visibility',   value: TRUST_LABELS.visibility[form.trust_config.visibility],       color: 'text-slate-800' },
                { label: 'Identity',     value: TRUST_LABELS.identity[form.trust_config.identity],           color: form.trust_config.identity === 'anonymous' ? 'text-emerald-600' : 'text-amber-600' },
                { label: 'IP Address',   value: TRUST_LABELS.ip_storage[form.trust_config.ip_storage],      color: form.trust_config.ip_storage === 'none' ? 'text-red-500' : 'text-amber-600' },
                { label: 'Submissions',  value: TRUST_LABELS.submission_limit[form.trust_config.submission_limit], color: 'text-slate-800' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className={`font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Center canvas ── */}
        <main className="flex-1 bg-slate-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto py-10 px-6 space-y-3">

            {/* Form header card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
                {form.mode === 'survey' ? 'Survey Form' : 'Election Form'}
              </p>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f!, title: e.target.value }))}
                className="w-full text-2xl font-bold text-slate-900 bg-transparent focus:outline-none mb-1"
                placeholder="Form title"
              />
              <input
                type="text"
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f!, description: e.target.value }))}
                className="w-full text-sm text-slate-400 bg-transparent focus:outline-none"
                placeholder="Add a description…"
              />
            </div>

            {/* Question cards */}
            {form.questions.map((q, i) => {
              const isSelected = selectedId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedId(q.id)}
                  className={`w-full text-left bg-white rounded-xl border-2 p-5 shadow-sm transition flex items-start gap-4 ${
                    isSelected ? 'border-sky-400' : 'border-transparent border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <TypeBadge type={q.type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      Q{i + 1}. {q.label}
                      {q.required && <span className="text-red-500 ml-0.5">*</span>}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">{TYPE_META[q.type]?.label ?? q.type}</p>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Add question */}
            <button
              onClick={() => addQuestion('short_text')}
              className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 transition flex items-center justify-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Add question
            </button>
          </div>
        </main>

        {/* ── Right panel: question settings ── */}
        <aside className="w-72 border-l border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0">
          {selected ? (
            <div className="p-5 space-y-6">
              <h2 className="text-base font-bold text-slate-900">Question settings</h2>

              {/* Label */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Question Label
                </label>
                <textarea
                  rows={3}
                  value={selected.label}
                  onChange={e => updateQuestion(selected.id, { label: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Question Type
                </label>
                <select
                  value={selected.type}
                  onChange={e => updateQuestion(selected.id, { type: e.target.value as QuestionType })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-sky-400 bg-white"
                >
                  {SIDEBAR_TYPES.map(t => (
                    <option key={t} value={t}>{TYPE_META[t].label}</option>
                  ))}
                </select>
              </div>

              {/* Options (for choice types) */}
              {CHOICE_TYPES.includes(selected.type) && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {selected.options?.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const opts = [...(selected.options ?? [])];
                            opts[i] = e.target.value;
                            updateQuestion(selected.id, { options: opts });
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400"
                        />
                        <button
                          onClick={() => updateQuestion(selected.id, {
                            options: selected.options?.filter((_, idx) => idx !== i),
                          })}
                          className="text-slate-400 hover:text-red-500 transition px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateQuestion(selected.id, {
                        options: [...(selected.options ?? []), `Option ${(selected.options?.length ?? 0) + 1}`],
                      })}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700 py-1"
                    >
                      + Add option
                    </button>
                  </div>
                </div>
              )}

              {/* Required toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Required</p>
                  <p className="text-xs text-slate-400 mt-0.5">Must be answered</p>
                </div>
                <Toggle
                  checked={selected.required}
                  onChange={v => updateQuestion(selected.id, { required: v })}
                />
              </div>

              {/* Conditional logic (plan gate) */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Conditional Logic
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                  <span>ⓘ</span>
                  <span>Available on Club plan</span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteQuestion(selected.id)}
                className="w-full text-sm font-semibold text-red-500 hover:text-red-600 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Delete question
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-sm text-slate-400 text-center">
                Select a question to edit its settings
              </p>
            </div>
          )}

          {/* Trust config editor (always visible at bottom) */}
          <div className="mt-auto border-t border-slate-200 p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Trust Config
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Visibility</label>
              <select
                value={form.trust_config.visibility}
                onChange={e => updateTrust({ visibility: e.target.value as TrustConfig['visibility'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 bg-white"
              >
                <option value="creator_only">Creator only</option>
                <option value="org">Organisation</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Identity</label>
              <select
                value={form.trust_config.identity}
                onChange={e => updateTrust({ identity: e.target.value as TrustConfig['identity'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 bg-white"
              >
                <option value="anonymous">Anonymous</option>
                <option value="optional">Optional</option>
                <option value="required">Required</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">IP Address</label>
              <select
                value={form.trust_config.ip_storage}
                onChange={e => updateTrust({ ip_storage: e.target.value as TrustConfig['ip_storage'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 bg-white"
              >
                <option value="none">Not stored</option>
                <option value="hashed">Hashed</option>
                <option value="stored">Stored</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Submissions</label>
              <select
                value={form.trust_config.submission_limit}
                onChange={e => updateTrust({ submission_limit: e.target.value as TrustConfig['submission_limit'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 bg-white"
              >
                <option value="one">1 per person</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
