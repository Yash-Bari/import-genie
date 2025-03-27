
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileType, AlertCircle, FileText, Check, X } from "lucide-react";
import { parseCsvFile } from "@/utils/apiService";
import { toast } from "sonner";

type FileUploadProps = {
  onFileProcessed: (data: string[][]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files?.length) {
      validateAndSetFile(files[0]);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    // Check if file is CSV
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }
    
    setFile(file);
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const data = await parseCsvFile(file);
      
      if (data.length < 2) {
        setError('CSV file appears to be empty or invalid');
        return;
      }
      
      onFileProcessed(data);
      toast.success('CSV file processed successfully');
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <Card className="glass-card w-full slide-up">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Upload CSV File
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <div className="mx-auto flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your CSV file, or click to browse
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supports CSV files up to 5MB
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                />
                <Button size="sm" variant="outline">
                  Select File
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileType className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-500 hover:text-destructive"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {file && (
          <Button
            variant="default"
            onClick={processFile}
            disabled={isProcessing}
            className="flex items-center"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Process File
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
