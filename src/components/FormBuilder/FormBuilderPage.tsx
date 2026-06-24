'use client';

import { useState } from 'react';
import Link from 'next/link';

type QuestionType = 'short' | 'long' | 'multiple' | 'checkbox' | 'dropdown' | 'rating';

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormSettings {
  visibility: 'creator' | 'public' | 'anonymous';
  collect_identity: boolean;
  store_ip: boolean;
  submission_limit: 'unlimited' | 'one_per_person';
  retention_days: 7 | 30 | 90 | 365;
  allow_duplicate_submissions: boolean;
}

const QUESTION_TYPES: { type: QuestionType; icon: string; label: string }[] = [
  { type: 'short',    icon: '📝', label: 'Short' },
  { type: 'long',     icon: '📄', label: 'Long' },
  { type: 'multiple', icon: '⭕', label: 'Multiple' },
  { type: 'checkbox', icon: '☑️', label: 'Check' },
  { type: 'dropdown', icon: '▼',  label: 'Dropdown' },
  { type: 'rating',   icon: '⭐', label: 'Rating' },
];

const CHOICE_TYPES: QuestionType[] = ['multiple', 'checkbox', 'dropdown'];

export default function FormBuilderPage() {
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<FormSettings>({
    visibility: 'anonymous',
    collect_identity: false,
    store_ip: false,
    submission_limit: 'one_per_person',
    retention_days: 90,
    allow_duplicate_submissions: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selected = questions.find(q => q.id === selectedId) ?? null;

  function addQuestion(type: QuestionType) {
    const q: Question = {
      id: `q-${Date.now()}`,
      type,
      label: 'Untitled question',
      required: false,
      options: CHOICE_TYPES.includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    setQuestions(prev => [...prev, q]);
    setSelectedId(q.id);
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
  }

  function deleteQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function duplicateQuestion(id: string) {
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) return;
    const copy = { ...questions[idx], id: `q-${Date.now()}` };
    setQuestions(prev => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
  }

  function calculateTrustScore() {
    let score = 5;
    if (settings.collect_identity) score -= 1;
    if (settings.store_ip) score -= 0.5;
    if (settings.allow_duplicate_submissions) score -= 0.5;
    if (settings.visibility === 'public') score -= 1;
    if (settings.retention_days > 90) score -= 0.5;
    return Math.max(1, Math.round(score * 2) / 2);
  }

  function updateOption(optionIdx: number, value: string) {
    if (!selected) return;
    const newOptions = [...(selected.options ?? [])];
    newOptions[optionIdx] = value;
    updateQuestion(selected.id, { options: newOptions });
  }

  function removeOption(optionIdx: number) {
    if (!selected) return;
    updateQuestion(selected.id, {
      options: selected.options?.filter((_, i) => i !== optionIdx),
    });
  }

  function addOption() {
    if (!selected) return;
    updateQuestion(selected.id, {
      options: [...(selected.options ?? []), `Option ${(selected.options?.length ?? 0) + 1}`],
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Left panel ── */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col max-h-screen sticky top-0">

        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </Link>
          <input
            type="text"
            value={formTitle}
            onChange={e => setFormTitle(e.target.value)}
            className="w-full text-xl font-bold text-slate-900 bg-transparent border-none focus:outline-none p-0 mb-1"
            placeholder="Untitled Form"
          />
          <textarea
            value={formDescription}
            onChange={e => setFormDescription(e.target.value)}
            className="w-full text-xs text-slate-600 bg-transparent border-none focus:outline-none p-0 resize-none"
            placeholder="Add form description"
            rows={2}
          />
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 mb-2">No questions yet</p>
              <p className="text-xs text-slate-400">Add your first question below</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedId === q.id
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="text-xs text-slate-500 mb-1">
                  {i + 1}. {q.type}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="font-medium text-sm text-slate-900 truncate">{q.label}</p>
              </button>
            ))
          )}
        </div>

        {/* Add question + settings */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Add question
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {QUESTION_TYPES.map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => addQuestion(type)}
                className="py-2 px-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition flex flex-col items-center gap-1 text-xs"
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium text-slate-700">{label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSettings(s => !s)}
            className="w-full py-2.5 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* ── Center: editor or empty state ── */}
      {selected ? (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-2xl">

            {/* Label */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Question text</label>
              <input
                type="text"
                value={selected.label}
                onChange={e => updateQuestion(selected.id, { label: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 font-medium"
                placeholder="What's your question?"
              />
            </div>

            {/* Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Question type</label>
              <select
                value={selected.type}
                onChange={e => updateQuestion(selected.id, { type: e.target.value as QuestionType })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
              >
                <option value="short">Short text</option>
                <option value="long">Long text</option>
                <option value="multiple">Multiple choice</option>
                <option value="checkbox">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
                <option value="rating">Rating scale</option>
              </select>
            </div>

            {/* Placeholder */}
            {(selected.type === 'short' || selected.type === 'long') && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Placeholder text</label>
                <input
                  type="text"
                  value={selected.placeholder ?? ''}
                  onChange={e => updateQuestion(selected.id, { placeholder: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  placeholder="e.g., Type your answer here..."
                />
              </div>
            )}

            {/* Options */}
            {CHOICE_TYPES.includes(selected.type) && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Options</label>
                <div className="space-y-2">
                  {selected.options?.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                      />
                      <button
                        onClick={() => removeOption(i)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 py-2"
                  >
                    + Add option
                  </button>
                </div>
              </div>
            )}

            {/* Required */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.required}
                  onChange={e => updateQuestion(selected.id, { required: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600"
                />
                <span className="text-sm font-medium text-slate-700">Required answer</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => duplicateQuestion(selected.id)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Duplicate
              </button>
              <button
                onClick={() => deleteQuestion(selected.id)}
                className="flex-1 px-4 py-2.5 border border-red-300 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-600 mb-2">No question selected</p>
            <p className="text-sm text-slate-500">Add your first question or click one to edit</p>
          </div>
        </div>
      )}

      {/* ── Right panel ── */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col max-h-screen sticky top-0">

        {/* Tab toggle */}
        <div className="border-b border-slate-200 p-4 flex gap-2 shrink-0">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${
              !showPreview ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trust Score
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${
              showPreview ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Trust Score tab */}
          {!showPreview && (
            <div className="p-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <p className="text-xs font-bold text-emerald-700 uppercase">Trust Score</p>
                  </div>
                  <div className="bg-emerald-600 text-white font-bold text-lg px-3 py-1 rounded-full">
                    {calculateTrustScore()}/5
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    settings.visibility === 'anonymous' ? 'Anonymous responses' : 'Identified responses',
                    settings.collect_identity ? 'Collects identity' : 'No identity collection',
                    `IP ${settings.store_ip ? 'stored' : 'not stored'}`,
                    `${settings.retention_days} day retention`,
                  ].map(line => (
                    <div key={line} className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span className="text-emerald-700">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {showSettings && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Visibility</label>
                    <select
                      value={settings.visibility}
                      onChange={e => setSettings(s => ({ ...s, visibility: e.target.value as FormSettings['visibility'] }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value="anonymous">Anonymous</option>
                      <option value="public">Public</option>
                      <option value="creator">Creator only</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.collect_identity}
                      onChange={e => setSettings(s => ({ ...s, collect_identity: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Collect respondent identity</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.store_ip}
                      onChange={e => setSettings(s => ({ ...s, store_ip: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Store IP address</span>
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Submissions per person
                    </label>
                    <select
                      value={settings.submission_limit}
                      onChange={e => setSettings(s => ({ ...s, submission_limit: e.target.value as FormSettings['submission_limit'] }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value="one_per_person">1 per person</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Data retention (days)
                    </label>
                    <select
                      value={settings.retention_days}
                      onChange={e => setSettings(s => ({ ...s, retention_days: parseInt(e.target.value) as FormSettings['retention_days'] }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value={7}>7 days</option>
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={365}>1 year</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview tab */}
          {showPreview && (
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-slate-900">{formTitle || 'Your Form'}</h3>
                {formDescription && <p className="text-sm text-slate-600">{formDescription}</p>}
                {questions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No questions yet</p>
                ) : (
                  questions.map((q, i) => (
                    <div key={q.id} className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {i + 1}. {q.label}
                        {q.required && <span className="text-red-500 ml-0.5">*</span>}
                      </p>
                      {q.type === 'short' && (
                        <input
                          type="text"
                          placeholder={q.placeholder || 'Short answer'}
                          disabled
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-not-allowed"
                        />
                      )}
                      {q.type === 'long' && (
                        <textarea
                          placeholder={q.placeholder || 'Long answer'}
                          disabled
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-not-allowed resize-none"
                        />
                      )}
                      {(q.type === 'multiple' || q.type === 'checkbox') && (
                        <div className="space-y-1">
                          {q.options?.map((opt, j) => (
                            <label key={j} className="flex items-center gap-2 text-sm opacity-50 cursor-not-allowed">
                              <input type={q.type === 'multiple' ? 'radio' : 'checkbox'} disabled />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === 'dropdown' && (
                        <select disabled className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-not-allowed opacity-50">
                          <option>Select an option</option>
                          {q.options?.map((opt, j) => <option key={j}>{opt}</option>)}
                        </select>
                      )}
                      {q.type === 'rating' && (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} disabled className="text-xl cursor-not-allowed opacity-50">⭐</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Publish */}
        <div className="border-t border-slate-200 p-4 shrink-0">
          <button className="w-full py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition">
            Publish form →
          </button>
        </div>
      </div>
    </div>
  );
}
