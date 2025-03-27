
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Download } from "lucide-react";
import { ImportStatus } from "@/utils/apiService";

type ImportProgressProps = {
  status: ImportStatus;
  onComplete: () => void;
};

const ImportProgress: React.FC<ImportProgressProps> = ({ status, onComplete }) => {
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    const progress = status.total > 0 
      ? Math.round((status.processed / status.total) * 100) 
      : 0;
    
    setProgressValue(progress);
  }, [status]);
  
  const getStatusColor = () => {
    if (status.status === 'completed' && status.failed === 0) return "text-green-500";
    if (status.status === 'completed' && status.failed > 0) return "text-amber-500";
    if (status.status === 'failed') return "text-destructive";
    return "text-blue-500";
  };
  
  const getStatusMessage = () => {
    if (status.status === 'completed' && status.failed === 0) {
      return "Import completed successfully!";
    }
    if (status.status === 'completed' && status.failed > 0) {
      return `Import completed with ${status.failed} errors.`;
    }
    if (status.status === 'failed') {
      return "Import failed. Please try again.";
    }
    return "Importing products...";
  };
  
  const getStatusIcon = () => {
    if (status.status === 'completed' && status.failed === 0) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (status.status === 'completed' && status.failed > 0) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
    if (status.status === 'failed') {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    
    return null;
  };

  return (
    <Card className="glass-card w-full slide-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>Import Progress</span>
          <span className={`flex items-center ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-2 text-base font-medium">
              {getStatusMessage()}
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          
          <div className="pt-2 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-medium">{status.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-600">Successful</p>
              <p className="text-2xl font-medium text-green-600">{status.successful}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-destructive">Failed</p>
              <p className="text-2xl font-medium text-destructive">{status.failed}</p>
            </div>
          </div>
        </div>
        
        {status.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Import Errors</AlertTitle>
            <AlertDescription>
              <div className="mt-2 max-h-32 overflow-y-auto text-sm">
                {status.errors.map((error, index) => (
                  <div key={index} className="py-1 border-b border-destructive/20 last:border-0">
                    {error}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {(status.status === 'completed' || status.status === 'failed') && (
          <>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
            <Button onClick={onComplete} className="flex items-center">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImportProgress;
