import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle, 
  Link as LinkIcon,
  Eye,
  Download
} from "lucide-react";
import { uploadPortfolioFile } from "../../services/surveyApi";
import { validatePortfolioFile, validatePortfolioUrl } from "../../utils/surveyValidation";
import { extractTextFromPDFWithProgress } from "../../lib/pdfParser";

interface StepPortfolioUploadProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export function StepPortfolioUpload({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  onSkip,
  canProceed, 
  isSubmitting 
}: StepPortfolioUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | null>(null);
  const [urlInput, setUrlInput] = useState(formData.portfolio.url || '');
  const [isPdfParsing, setIsPdfParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const portfolio = formData.portfolio;

  // Initialize upload method based on existing data
  useEffect(() => {
    if (portfolio.file) {
      setUploadMethod('file');
    } else if (portfolio.url) {
      setUploadMethod('url');
      setUrlInput(portfolio.url);
    }
  }, [portfolio.file, portfolio.url]);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const fileError = validatePortfolioFile(file);
    if (fileError) {
      updateFormData({
        portfolio: {
          ...formData.portfolio,
          fileError,
          uploadStatus: 'error'
        }
      });
      return;
    }

    // Create preview
    const filePreview = URL.createObjectURL(file);
    
    // Update form data with file info
    updateFormData({
      portfolio: {
        ...formData.portfolio,
        file,
        filePreview,
        fileError: null,
        fileProgress: 0,
        uploadStatus: 'uploading',
        url: '', // Clear URL if file is selected
        urlError: null
      }
    });

    // If it's a PDF, extract text on the client-side
    let pdfText: string | null = null;
    if (file.type === 'application/pdf') {
      try {
        setIsPdfParsing(true);
        console.log('[StepPortfolioUpload] Starting client-side PDF parsing...');
        
        pdfText = await extractTextFromPDFWithProgress(file, (progress) => {
          console.log(`[StepPortfolioUpload] PDF parsing progress: ${progress}%`);
          // You can update UI here if needed
        });

        console.log('[StepPortfolioUpload] PDF parsing completed. Text length:', pdfText.length);
        
        // Store the parsed PDF text in form data
        updateFormData((prevFormData: any) => ({
          ...prevFormData,
          portfolio: {
            ...prevFormData.portfolio,
            parsedPdfText: pdfText
          }
        }));
      } catch (parseError) {
        console.error('[StepPortfolioUpload] PDF parsing error:', parseError);
        updateFormData((prevFormData: any) => ({
          ...prevFormData,
          portfolio: {
            ...prevFormData.portfolio,
            fileError: `PDF parsing failed: ${(parseError as Error).message}`,
            uploadStatus: 'error'
          }
        }));
        setIsPdfParsing(false);
        return;
      } finally {
        setIsPdfParsing(false);
      }
    }

    try {
      // Upload file to Supabase
      const result = await uploadPortfolioFile(file, (progress) => {
        updateFormData((prevFormData: any) => ({
          ...prevFormData,
          portfolio: {
            ...prevFormData.portfolio,
            fileProgress: progress
          }
        }));
      });

      console.log('[StepPortfolioUpload] Upload successful:', {
        filename: result.filename,
        url: result.url,
        size: result.size
      });

      // Update with success AND store the Supabase URL and parsed text
      updateFormData((prevFormData: any) => ({
        ...prevFormData,
        portfolio: {
          ...prevFormData.portfolio,
          uploadStatus: 'success',
          fileProgress: 100,
          fileError: null,
          uploadedFilename: result.filename,
          uploadedUrl: result.url,
          parsedPdfText: pdfText  // Store the parsed PDF text
        }
      }));

      console.log('[StepPortfolioUpload] Form data updated with uploaded file info and parsed PDF text');

    } catch (error) {
      console.error('File upload error:', error);
      updateFormData((prevFormData: any) => ({
        ...prevFormData,
        portfolio: {
          ...prevFormData.portfolio,
          uploadStatus: 'error',
          fileError: (error as Error).message || 'Upload failed. Please try again.',
          fileProgress: 0
        }
      }));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    
    // Clear file if URL is being entered
    if (value && formData.portfolio.file) {
      updateFormData((prevFormData: any) => ({
        ...prevFormData,
        portfolio: {
          ...prevFormData.portfolio,
          file: null,
          filePreview: null,
          fileError: null,
          uploadStatus: null
        }
      }));
    }
  };

  const handleUrlBlur = () => {
    const urlError = validatePortfolioUrl(urlInput);
    updateFormData((prevFormData: any) => ({
      ...prevFormData,
      portfolio: {
        ...prevFormData.portfolio,
        url: urlInput,
        urlError,
        file: urlInput ? null : prevFormData.portfolio.file,
        filePreview: urlInput ? null : prevFormData.portfolio.filePreview,
        fileError: urlInput ? null : prevFormData.portfolio.fileError,
        uploadStatus: urlInput ? null : prevFormData.portfolio.uploadStatus
      }
    }));
  };

  const handleRemoveFile = () => {
    if (formData.portfolio.filePreview) {
      URL.revokeObjectURL(formData.portfolio.filePreview);
    }
    
    updateFormData((prevFormData: any) => ({
      ...prevFormData,
      portfolio: {
        ...prevFormData.portfolio,
        file: null,
        filePreview: null,
        fileError: null,
        fileProgress: 0,
        uploadStatus: null
      }
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveUrl = () => {
    setUrlInput('');
    updateFormData((prevFormData: any) => ({
      ...prevFormData,
      portfolio: {
        ...prevFormData.portfolio,
        url: '',
        urlError: null
      }
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && !isSubmitting && portfolio.uploadStatus !== 'uploading') {
      onNext();
    }
  };

  // Determine if the Continue button should be enabled
  const isUploadInProgress = portfolio.uploadStatus === 'uploading';
  const canContinue = canProceed && !isSubmitting && !isUploadInProgress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Share your work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70 mb-2"
        >
          Upload a portfolio, project showcase, or resume to stand out
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          Optional - You can skip this for now and add it later in your settings
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-8"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Upload Method Selection */}
        {!uploadMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* File Upload Option */}
            <button
              onClick={() => setUploadMethod('file')}
              className="p-8 rounded-xl border-2 border-dashed border-white/30 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 text-center group"
            >
              <Upload className="w-12 h-12 text-white/60 group-hover:text-purple-400 mx-auto mb-4 transition-colors" />
              <h3 className="text-white font-semibold text-lg mb-2">Upload File</h3>
              <p className="text-white/60 text-sm">
                PDF, PNG, JPG, DOC, DOCX (max 10MB)
              </p>
            </button>

            {/* URL Option */}
            <button
              onClick={() => setUploadMethod('url')}
              className="p-8 rounded-xl border-2 border-dashed border-white/30 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 text-center group"
            >
              <LinkIcon className="w-12 h-12 text-white/60 group-hover:text-cyan-400 mx-auto mb-4 transition-colors" />
              <h3 className="text-white font-semibold text-lg mb-2">Portfolio Link</h3>
              <p className="text-white/60 text-sm">
                Link to your online portfolio or website
              </p>
            </button>
          </motion.div>
        )}

        {/* File Upload Section */}
        {uploadMethod === 'file' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Upload Status Message */}
            {portfolio.uploadStatus === 'uploading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start space-x-3"
              >
                <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-300 text-sm font-medium">Uploading your file to cloud storage</p>
                  <p className="text-blue-300/70 text-xs mt-1">Please don't close this tab or navigate away</p>
                </div>
              </motion.div>
            )}
            
            {portfolio.uploadStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start space-x-3"
              >
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 text-sm font-medium">Upload successful!</p>
                  <p className="text-green-300/70 text-xs mt-1">Your file is ready. You can now continue.</p>
                </div>
              </motion.div>
            )}
            
            {portfolio.fileError && portfolio.uploadStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 text-sm font-medium">Upload failed</p>
                  <p className="text-red-300/70 text-xs mt-1">{portfolio.fileError}</p>
                </div>
              </motion.div>
            )}
            
            {!portfolio.file ? (
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragOver
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`w-16 h-16 mx-auto mb-6 transition-colors ${
                  isDragOver ? 'text-purple-400' : 'text-white/60'
                }`} />
                <h3 className="text-white font-semibold text-xl mb-2">
                  {isDragOver ? 'Drop your file here' : 'Drag and drop your portfolio'}
                </h3>
                <p className="text-white/60 mb-4">
                  or click to upload
                </p>
                <p className="text-white/40 text-sm">
                  Supported formats: PDF, PNG, JPG, DOC, DOCX (max 10MB)
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <File className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{portfolio.file.name}</h4>
                      <p className="text-white/60 text-sm">{formatFileSize(portfolio.file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {portfolio.uploadStatus === 'success' && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Uploaded</span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Upload Progress */}
                {portfolio.uploadStatus === 'uploading' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Uploading...</span>
                      <span className="text-white/60 text-sm">{Math.round(portfolio.fileProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${portfolio.fileProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Error Display */}
                {portfolio.fileError && (
                  <div className="mt-4 flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{portfolio.fileError}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={() => setUploadMethod(null)}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Use a link instead
              </button>
            </div>
          </motion.div>
        )}

        {/* URL Input Section */}
        {uploadMethod === 'url' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3">
                Portfolio URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onBlur={handleUrlBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="https://yourportfolio.com"
                  className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    portfolio.urlError ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-white/30'
                  }`}
                />
                {portfolio.url && !portfolio.urlError && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <button
                      onClick={handleRemoveUrl}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {portfolio.urlError && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-400">{portfolio.urlError}</p>
                </div>
              )}
              
              {portfolio.url && !portfolio.urlError && (
                <div className="mt-3">
                  <a
                    href={portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview portfolio</span>
                  </a>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setUploadMethod(null)}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Upload a file instead
              </button>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center pt-6"
        >
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={onSkip}
              className="px-6 py-3 rounded-xl text-white/60 hover:text-white/80 hover:bg-white/5 transition-all duration-300"
            >
              Skip for now
            </button>
            
            <button
              onClick={onNext}
              disabled={!canContinue}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                canContinue
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer'
                  : 'bg-gradient-to-r from-purple-500/50 to-cyan-400/50 cursor-not-allowed opacity-60'
              }`}
              title={isUploadInProgress ? 'Please wait for upload to complete' : ''}
            >
              {isUploadInProgress ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading... {portfolio.fileProgress}%</span>
                </div>
              ) : isSubmitting ? (
                'Processing...'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}