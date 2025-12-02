import { useState, useEffect } from 'react';
import { Code, Play, CheckCircle, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSnackbar } from '@/hooks/useSnackbar';

interface TechnicalInterviewIDEProps {
  interviewId: string;
  question?: string;
  initialCode?: string;
  initialLanguage?: string;
  onSubmit?: (code: string, language: string) => Promise<void>;
}

// Supported programming languages
const PROGRAMMING_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
];

export default function TechnicalInterviewIDE({
  interviewId,
  question,
  initialCode = '',
  initialLanguage = 'python',
  onSubmit,
}: TechnicalInterviewIDEProps) {
  const { showSnackbar } = useSnackbar();
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLang = PROGRAMMING_LANGUAGES.find(l => l.value === selectedLanguage) || PROGRAMMING_LANGUAGES[0];

  useEffect(() => {
    const savedCode = localStorage.getItem(`interview_${interviewId}_code`);
    const savedLanguage = localStorage.getItem(`interview_${interviewId}_language`);
    if (savedCode) {
      setCode(savedCode);
    } else if (initialCode) {
      setCode(initialCode);
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, [interviewId, initialCode]);

  useEffect(() => {
    if (code) {
      localStorage.setItem(`interview_${interviewId}_code`, code);
    }
    localStorage.setItem(`interview_${interviewId}_language`, selectedLanguage);
  }, [code, selectedLanguage, interviewId]);

  const handleRun = async () => {
    if (!code.trim()) {
      showSnackbar('Please write some code before running', 'error');
      return;
    }

    setIsRunning(true);
    setShowOutput(true);
    setOutput('Compiling and running code...\n');

    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setOutput(`Error: ${result.error || 'Failed to execute code'}\n${result.stderr || ''}`);
        showSnackbar('Code execution failed', 'error');
      } else {
        const outputText = result.stdout || result.output || 'Code executed successfully (no output)';
        const errorText = result.stderr ? `\nErrors:\n${result.stderr}` : '';
        setOutput(`${outputText}${errorText}`);
        if (result.stderr) {
          showSnackbar('Code executed with warnings', 'warning');
        } else {
          showSnackbar('Code executed successfully', 'success');
        }
      }
    } catch (err: any) {
      console.error('Error executing code:', err);
      setOutput(`Error: ${err.message || 'Failed to execute code. Please try again.'}`);
      showSnackbar('Failed to execute code', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      showSnackbar('Please write your solution before submitting', 'error');
      return;
    }

    if (!onSubmit) {
      showSnackbar('Submit handler not configured', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(code, selectedLanguage);
      showSnackbar('Solution submitted successfully!', 'success');
    } catch (err: any) {
      console.error('Error submitting solution:', err);
      showSnackbar(err.message || 'Failed to submit solution', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1E] rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-white/60">Compiler:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-[#0D0D0D] text-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
            className="px-4 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
              className="w-full h-full bg-transparent text-white font-mono text-sm p-4 pl-16 focus:outline-none resize-none"
              placeholder={`// Write your ${selectedLang.label} code here\n// Click "Run" to execute your code\n`}
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
        <span className="text-cyan-400">Language: {selectedLang.label}</span>
      </div>
    </div>
  );
}
