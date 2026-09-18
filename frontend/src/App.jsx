import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, Scale, Lock, RefreshCw, Upload, Sparkles } from 'lucide-react';

export default function App() {
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleAudit = async () => {
    if (!contractText.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', contractText);
      const res = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sample');
      const data = await res.json();
      setContractText(data.sample_text);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Scale className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              LexiGuard AI
            </h1>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Gemini 3.6 Flash Engine
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input Panel */}
        <section className="flex flex-col space-y-4" aria-label="Document Input Section">
          <div className="flex items-center justify-between">
            <label htmlFor="contract-input" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Legal Contract Text
            </label>
            <button
              onClick={loadSample}
              aria-label="Load Sample Freelance Agreement"
              title="Load Sample Freelance Agreement"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" /> Load Sample Contract
            </button>
          </div>

          <textarea
            id="contract-input"
            aria-label="Legal Contract Text Input"
            rows="16"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste your contract, NDA, or terms of service here for instant risk heatmapping..."
            className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
          />

          <button
            onClick={handleAudit}
            disabled={loading || !contractText.trim()}
            aria-label="Run Full Legal Audit"
            title="Run Full Legal Audit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Auditing Contract Clauses...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Run Full Legal Audit</span>
              </>
            )}
          </button>
        </section>

        {/* Right Column: AI Analysis Report */}
        <section aria-label="Audit Analysis Report">
          {report ? (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-200">Overall Contract Risk</h2>
                  <p className="text-xs text-slate-400 mt-1">Evaluated against consumer protection benchmarks</p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-extrabold ${report.overall_risk_score > 70 ? 'text-red-400' : report.overall_risk_score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {report.overall_risk_score}/100
                  </span>
                </div>
              </div>

              {/* Clause Findings List */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Identified Clause Risks</h3>
                {report.clause_analyses?.map((clause, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-indigo-300">
                        {clause.clause_type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${clause.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {clause.severity} Risk
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                      "{clause.original_text}"
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-indigo-400">Risk Explanation:</strong> {clause.explanation}
                    </p>

                    {clause.suggested_counter_clause && (
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 space-y-1">
                        <span className="text-xs font-medium text-indigo-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Suggested Counter-Clause
                        </span>
                        <p className="text-xs text-indigo-200">{clause.suggested_counter_clause}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-slate-500">
              <ShieldAlert className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">No Document Audited Yet</p>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">
                Paste contract text or load the sample template to inspect clause-level risks and fair counter-proposals.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
