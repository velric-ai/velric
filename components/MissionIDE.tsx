import { useState, useEffect } from 'react';
import { Code, Play, Save, FileText, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissionIDEProps {
  language: string;
  missionId: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

// Language configuration for syntax highlighting hints
const languageConfig: Record<string, { name: string; extension: string; comment: string }> = {
  python: { name: 'Python', extension: '.py', comment: '#' },
  javascript: { name: 'JavaScript', extension: '.js', comment: '//' },
  typescript: { name: 'TypeScript', extension: '.ts', comment: '//' },
  java: { name: 'Java', extension: '.java', comment: '//' },
  cpp: { name: 'C++', extension: '.cpp', comment: '//' },
  sql: { name: 'SQL', extension: '.sql', comment: '--' },
  go: { name: 'Go', extension: '.go', comment: '//' },
  rust: { name: 'Rust', extension: '.rs', comment: '//' },
  csharp: { name: 'C#', extension: '.cs', comment: '//' },
};

export default function MissionIDE({ language, missionId, initialCode = '', onCodeChange }: MissionIDEProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [fileName, setFileName] = useState(`solution${languageConfig[language]?.extension || '.txt'}`);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const langConfig = languageConfig[language.toLowerCase()] || { name: language, extension: '.txt', comment: '//' };

  const showWarningMessage = (message: string) => {
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`mission_${missionId}_code`);
    if (savedCode) {
      setCode(savedCode);
    } else if (initialCode) {
      setCode(initialCode);
    }
  }, [missionId, initialCode]);

  useEffect(() => {
    // Auto-save code to localStorage
    if (code) {
      localStorage.setItem(`mission_${missionId}_code`, code);
    }
    onCodeChange?.(code);
  }, [code, missionId, onCodeChange]);

  const handleRun = async () => {
    setIsRunning(true);
    setShowOutput(true);
    
    // Simulate code execution (in a real implementation, this would call an API)
    setTimeout(() => {
      setOutput(`Code execution simulation for ${langConfig.name}.\n\nIn a production environment, this would:\n1. Send code to a secure execution environment\n2. Run the code with appropriate language runtime\n3. Return execution results\n\nFor now, this is a placeholder.`);
      setIsRunning(false);
    }, 1000);
  };

  const handleSave = () => {
    localStorage.setItem(`mission_${missionId}_code`, code);
    // Show save confirmation
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Saved!';
      setTimeout(() => {
        if (saveBtn) saveBtn.textContent = originalText;
      }, 1000);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all code? This cannot be undone.')) {
      setCode('');
      localStorage.removeItem(`mission_${missionId}_code`);
    }
  };

  // Get line numbers for the editor
  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1E] rounded-lg border border-gray-800 overflow-hidden">
      {/* IDE Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-transparent text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 px-1 rounded"
                style={{ width: `${fileName.length + 2}ch` }}
              />
            </div>
            <span className="text-xs text-gray-500">{langConfig.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            id="save-btn"
            className="px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3 py-1.5 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* IDE Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto relative">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0D0D0D] border-r border-gray-800 text-right pr-2 text-gray-600 text-xs font-mono select-none">
              {lines.map((line) => (
                <div key={line} className="leading-6">
                  {line}
                </div>
              ))}
            </div>
            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onContextMenu={(e) => {
                e.preventDefault();
                showWarningMessage('❌ Right-click is disabled');
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                  e.preventDefault();
                  showWarningMessage('❌ Copy is not allowed');
                } else if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                  e.preventDefault();
                  showWarningMessage('❌ Paste is not allowed');
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                showWarningMessage('❌ Paste is not allowed');
              }}
              className="w-full h-full bg-transparent text-white font-mono text-sm p-4 pl-16 focus:outline-none resize-none"
              placeholder={`// Start coding in ${langConfig.name}...\n// Your code will be auto-saved\n`}
              spellCheck={false}
              style={{
                tabSize: 2,
                lineHeight: '1.5rem',
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        {showOutput && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '400px' }}
            exit={{ width: 0 }}
            className="border-l border-gray-800 bg-[#0D0D0D] flex flex-col"
          >
            <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Output</span>
              <button
                onClick={() => setShowOutput(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {output || 'No output yet. Click "Run" to execute your code.'}
              </pre>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[#0D0D0D] border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
        <span>Lines: {lineCount} | Characters: {code.length}</span>
        <span className="text-cyan-400">Auto-save enabled</span>
      </div>

      {/* Warning Message */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{warningMessage}</span>
        </motion.div>
      )}
    </div>
  );
}

