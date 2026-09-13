import React, { useState } from 'react';
import { Scale, Loader2, Key, CheckCircle } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('clauses');

  const loadSample = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sample');
      const data = await res.json();
      setText(data.sample_text);
      setFile(null);
    } catch (err) {
      alert('Could not connect to backend. Ensure backend is running on port 8000.');
    }
  };

  const handleAudit = async () => {
    if (!apiKey) return alert('Please paste your Gemini API Key in the top right box!');
    if (!file && !text) return alert('Please upload a PDF or click "Load Sample Predatory Contract"!');

    setLoading(true);
    const formData = new FormData();
    formData.append('api_key', apiKey);
    if (file) formData.append('file', file);
    if (text) formData.append('raw_text', text);

    try {
      const res = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setReport(data);
    } catch (err) {
      alert('Audit Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Predatory': return 'bg-red-700 text-white';
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-black';
      default: return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-indigo-400">
              <Scale className="w-8 h-8 text-indigo-400" /> LexiGuard AI
            </h1>
            <p className="text-slate-400 text-sm mt-1">Autonomous Legal Document Intelligence & Risk Auditor</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700 w-full md:w-auto">
            <Key className="w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              placeholder="Paste Gemini API Key Here" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-transparent border-none text-sm text-white focus:outline-none w-full md:w-64"
            />
          </div>
        </header>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-medium text-slate-300">Upload PDF Contract</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => { setFile(e.target.files[0]); setText(''); }}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
            <div className="text-center text-xs text-slate-500">— OR —</div>
            <textarea
              rows={4}
              placeholder="Paste contract text directly here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <button 
              onClick={loadSample}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 px-4 rounded-lg font-medium text-sm transition cursor-pointer"
            >
              📄 Load Sample Predatory Contract
            </button>
            <button 
              onClick={handleAudit} 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '🚀 Run Full Legal Audit'}
            </button>
            <p className="text-xs text-slate-500 text-center">Informational legal analysis only; not certified legal counsel.</p>
          </div>
        </div>

        {/* Results */}
        {report && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase font-semibold text-slate-400">Risk Score</span>
                <span className={`text-4xl font-black mt-2 ${report.overall_risk_score > 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {report.overall_risk_score}<span className="text-base text-slate-500">/100</span>
                </span>
              </div>
              <div className="md:col-span-3 bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-xs font-semibold uppercase text-indigo-400">{report.document_type}</span>
                <h3 className="font-semibold text-slate-200">Executive Summary</h3>
                <p className="text-sm text-slate-400">{report.executive_summary}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 gap-6">
              <button 
                onClick={() => setActiveTab('clauses')} 
                className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'clauses' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}
              >
                Clause Risk Breakdown ({report.clauses.length})
              </button>
              <button 
                onClick={() => setActiveTab('obligations')} 
                className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'obligations' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}
              >
                Key Obligations
              </button>
              <button 
                onClick={() => setActiveTab('counsel')} 
                className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'counsel' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}
              >
                Lawyer Talking Points
              </button>
            </div>

            {/* Tab Body */}
            {activeTab === 'clauses' && (
              <div className="space-y-4">
                {report.clauses.map((c, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-200">{c.clause_title}</h4>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getRiskBadge(c.risk_level)}`}>
                        {c.risk_level} Risk
                      </span>
                    </div>
                    <div className="text-xs bg-slate-900/80 p-3 rounded font-mono text-slate-300 border border-slate-800">
                      "{c.original_text}"
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                      <p><strong className="text-indigo-300">Plain English:</strong> {c.plain_summary}</p>
                      <p><strong className="text-red-400">Risk Assessment:</strong> {c.risk_reason}</p>
                    </div>
                    <div className="bg-indigo-950/40 border border-indigo-900/60 p-3 rounded-lg text-sm text-indigo-200">
                      <strong className="block text-indigo-400 mb-1">Suggested Counter-Clause:</strong>
                      {c.suggested_counter_clause}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'obligations' && (
              <ul className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-3 text-sm text-slate-300">
                {report.key_deadlines_and_obligations.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'counsel' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
                <p className="text-xs text-slate-400">Export or bring these specific questions to your legal consultation:</p>
                {report.lawyer_consultation_questions.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-700/60 text-sm">
                    <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
