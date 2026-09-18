import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, Scale, RefreshCw, Sparkles, FileCode } from 'lucide-react';

const SAMPLE_CONTRACT = `FREELANCE SERVICES AGREEMENT

1. INTELLECTUAL PROPERTY: All work product created by Contractor shall belong exclusively to Client in perpetuity. Contractor waives all moral rights.

2. NON-COMPETE: During the term and for 24 months following termination, Contractor shall not provide services to any company operating in the software industry globally.

3. INDEMNIFICATION: Contractor agrees to indemnify and hold harmless Client against any claims, losses, or legal fees without limitation.

4. TERMINATION: Client may terminate this agreement at any time without notice or cause. Contractor must provide 60 days written notice.`;

export default function App() {
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    setError(null);
    if (!contractText.trim()) {
      setError('Error: Contract text input cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const formData = new FormData();
      formData.append('text', contractText);
      const res = await fetch(`${backendUrl}/api/audit`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(`Validation Edge Case Triggered: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setError(null);
    setContractText(SAMPLE_CONTRACT);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
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
          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Powered by Gemini 3.6 Flash
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col space-y-4" aria-label="Live Contract Input Section">
          <div className="flex items-center justify-between">
            <label htmlFor="contract-input" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Live Contract Input
            </label>
            <button
              onClick={loadSample}
              aria-label="Load Sample Contract"
              title="Load Sample Contract"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-800/40"
            >
              <Sparkles className="w-3 h-3" /> Load Sample Freelance Agreement
            </button>
          </div>

          <textarea
            id="contract-input"
            aria-label="Legal Contract Text Input"
            rows="15"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Type or paste contract text live here..."
            className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none font-mono"
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAudit}
            disabled={loading}
            aria-label="Trigger Gemini Audit"
            title="Trigger Gemini Audit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-200" />
                <span>Gemini 3.6 Flash Processing Structured Schema...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Run Dynamic Legal Audit</span>
              </>
            )}
          </button>
        </section>

        <section aria-label="Live AI Output Panel">
          {report ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-200">Dynamic Risk Assessment</h2>
                  <p className="text-xs text-slate-400 mt-1">Generated via Pydantic JSON schema parsing</p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-extrabold ${report.overall_risk_score > 70 ? 'text-red-400' : report.overall_risk_score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {report.overall_risk_score}/100
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" /> GenAI Clause Breakdown
                </h3>
                {report.clause_analyses?.map((clause, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                        {clause.clause_type}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${clause.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {clause.severity} Severity
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      "{clause.original_text}"
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-indigo-400">GenAI Explanation:</strong> {clause.explanation}
                    </p>

                    {clause.suggested_counter_clause && (
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 space-y-1">
                        <span className="text-xs font-medium text-indigo-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Generated Counter-Clause
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
              <p className="text-sm font-medium text-slate-400">Awaiting Input Execution</p>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">
                Enter text or trigger edge cases to observe real-time Gemini processing.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
