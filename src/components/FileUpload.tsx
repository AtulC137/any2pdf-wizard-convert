
import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, FileText, Download, X, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface FileUploadProps {
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ id }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isConverted, setIsConverted] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: uiToast } = useToast();

  const allowedFileTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/html',
    'text/plain'
  ];

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Filter invalid file types
    const validFiles = droppedFiles.filter(file => 
      allowedFileTypes.includes(file.type) || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.html') ||
      file.name.endsWith('.txt')
    );
    
    if (validFiles.length !== droppedFiles.length) {
      toast.error("Invalid file type. Please upload only documents, spreadsheets, images, HTML, or text files.");
    }
    
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      setIsConverted(false);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    // Filter invalid file types
    const validFiles = selectedFiles.filter(file => 
      allowedFileTypes.includes(file.type) || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.html') ||
      file.name.endsWith('.txt')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error("Invalid file type. Please upload only documents, spreadsheets, images, HTML, or text files.");
    }
    
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      setIsConverted(false);
    }
    
    // Clear the input to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setIsConverted(false);
    setConvertedFileUrl(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file to convert.");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 300);

      // For each file, create a FormData object to send to the Supabase Edge Function
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // Call our Supabase Edge Function (URL will be provided after creating the function)
      const response = await fetch('https://YOUR_SUPABASE_PROJECT_URL/functions/v1/convert-to-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setConvertedFileUrl(pdfUrl);
      
      // Set conversion state to complete
      setConversionProgress(100);
      setTimeout(() => {
        setIsConverting(false);
        setIsConverted(true);
        toast.success("Conversion complete! Your PDF is ready to download.");
      }, 500);
      
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Error converting files. Please try again.");
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFileUrl) {
      const link = document.createElement('a');
      link.href = convertedFileUrl;
      link.download = "converted-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setIsConverted(false);
    setConversionProgress(0);
    setConvertedFileUrl(null);
  };

  return (
    <section id={id} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload & Convert</h2>
            <p className="text-lg text-gray-600">
              Drag and drop your files or click to browse. We'll convert them to PDF instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {!isConverted ? (
              <>
                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-any2pdf-teal bg-any2pdf-teal/5'
                      : 'border-gray-300 hover:border-any2pdf-teal/70 hover:bg-gray-50'
                  }`}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={handleFileSelect}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".docx,.xlsx,.png,.jpg,.jpeg,.html,.txt,.doc,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports Word, Excel, Images, HTML, and Text files
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Files to convert:</h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-800 truncate max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conversion button */}
                {isConverting ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-any2pdf-teal">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">Converting...</span>
                    </div>
                    <Progress value={conversionProgress} className="h-2" />
                    <p className="text-center text-sm text-gray-500">
                      {conversionProgress}% complete
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleConvert}
                    disabled={files.length === 0}
                    className="w-full bg-any2pdf hover:bg-any2pdf-dark text-white py-6 font-medium text-lg"
                  >
                    Convert to PDF
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-6 space-y-6 animate-fade-in">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Conversion Complete!</h3>
                <p className="text-gray-600">Your PDF is ready to download</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-any2pdf-teal hover:bg-any2pdf-teal/90 text-white font-medium"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Convert another file
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your files are secure and will be automatically deleted after conversion.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
