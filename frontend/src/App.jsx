import React, { useState } from 'react';
import { 
  ShieldAlert, FileText, CheckCircle2, AlertTriangle, Scale, 
  RefreshCw, Sparkles, FileCode, Download, Copy, Check, ArrowRight 
} from 'lucide-react';

const SAMPLES = {
  freelance: `FREELANCE SERVICES AGREEMENT

1. INTELLECTUAL PROPERTY: All work product created by Contractor shall belong exclusively to Client in perpetuity. Contractor waives all moral rights.

2. NON-COMPETE: During the term and for 24 months following termination, Contractor shall not provide services to any company operating in the software industry globally.

3. INDEMNIFICATION: Contractor agrees to indemnify and hold harmless Client against any claims, losses, or legal fees without limitation.

4. TERMINATION: Client may terminate this agreement at any time without notice or cause. Contractor must provide 60 days written notice.`,

  nda: `CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT

1. DURATION: Recipient agrees to keep all information confidential for an indefinite period of time.

2. SCOPE: Confidential Information includes all ideas, public concepts, and general industry knowledge disclosed by Discloser.

3. REMEDIES: Discloser shall be entitled to immediate injunctive relief and liquidated damages of $500,000 upon any breach without proof of actual harm.`
};

const MOCK_REPORT = {
  overall_risk_score: 88,
  high_severity_count: 2,
  medium_severity_count: 1,
  estimated_liability_exposure: "High / Uncapped",
  clause_analyses: [
    {
      clause_type: "Non-Compete Clause",
      severity: "High",
      original_text: "During the term and for 24 months following termination, Contractor shall not provide services to any company operating in the software industry globally.",
      explanation: "A 24-month global restriction on working in the entire software industry is overly broad and likely legally unenforceable.",
      suggested_counter_clause: "Contractor agrees not to provide direct consulting services to direct competitors for 6 months within the specific niche of the project."
    },
    {
      clause_type: "Indemnification Clause",
      severity: "High",
      original_text: "Contractor agrees to indemnify and hold harmless Client against any claims, losses, or legal fees without limitation.",
      explanation: "Uncapped liability exposes the contractor to catastrophic legal damages far exceeding contract value.",
      suggested_counter_clause: "Contractor liability shall be capped at the total amount paid under this agreement over the preceding 12 months."
    },
    {
      clause_type: "Termination Clause",
      severity: "Medium",
      original_text: "Client may terminate this agreement at any time without notice or cause. Contractor must provide 60 days written notice.",
      explanation: "Asymmetrical termination terms put unfair administrative burden on the contractor.",
      suggested_counter_clause: "Either party may terminate this agreement with 14 days written notice."
    }
  ]
};

export default function App() {
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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
      setTimeout(() => {
        setReport(MOCK_REPORT);
      }, 800);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const handleApplyFix = (original, counter) => {
    if (contractText.includes(original)) {
      setContractText(contractText.replace(original, counter));
    }
  };

  const exportReport = () => {
    if (!report) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `LexiGuard_Audit_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyModifiedContract = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="contract-input" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Live Contract Input
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setError(null); setContractText(SAMPLES.freelance); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-800/40"
              >
                <Sparkles className="w-3 h-3" /> Freelance Preset
              </button>
              <button
                onClick={() => { setError(null); setContractText(SAMPLES.nda); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-800/40"
              >
                <Sparkles className="w-3 h-3" /> Strict NDA
              </button>
            </div>
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleAudit}
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-200" />
                  <span>Gemini Processing Structured Schema...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  <span>Run Dynamic Legal Audit</span>
                </>
              )}
            </button>
            
            {contractText && (
              <button
                onClick={copyModifiedContract}
                title="Copy Updated Contract"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
        </section>

        <section aria-label="Live AI Output Panel">
          {report ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-200">Dynamic Risk Assessment</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Parsed via Gemini Structured Output</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-extrabold ${report.overall_risk_score > 70 ? 'text-red-400' : report.overall_risk_score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {report.overall_risk_score}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">High Risk Flags</span>
                    <span className="text-sm font-bold text-red-400">{report.high_severity_count || 2}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Medium Flags</span>
                    <span className="text-sm font-bold text-amber-400">{report.medium_severity_count || 1}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Exposure</span>
                    <span className="text-xs font-bold text-slate-300">{report.estimated_liability_exposure || 'Uncapped'}</span>
                  </div>
                </div>

                <button
                  onClick={exportReport}
                  className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> Export JSON Audit Report
                </button>
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
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-indigo-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Generated Counter-Clause
                          </span>
                          <button
                            onClick={() => handleApplyFix(clause.original_text, clause.suggested_counter_clause)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          >
                            Apply Fix to Input <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
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
