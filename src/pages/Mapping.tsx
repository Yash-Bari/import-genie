
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, Table } from "lucide-react";
import MappingInterface from "@/components/ui/MappingInterface";
import ImportProgress from "@/components/ui/ImportProgress";
import { getSettings, importProducts, ImportStatus } from "@/utils/apiService";
import { toast } from "sonner";

const Mapping = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    status: 'pending',
    errors: []
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const settings = getSettings();
    if (!settings) {
      toast.error("Please configure WooCommerce API settings first");
      navigate("/settings");
      return;
    }
    
    // Get CSV data from navigation state
    const state = location.state as { csvData?: string[][] };
    if (!state || !state.csvData || state.csvData.length === 0) {
      toast.error("No CSV data found. Please upload a file first.");
      navigate("/import");
      return;
    }
    
    setCsvData(state.csvData);
  }, [isAuthenticated, navigate, location.state]);
  
  const handleMappingComplete = async (mappedData: any[]) => {
    const settings = getSettings();
    if (!settings) {
      toast.error("WooCommerce API settings not found");
      return;
    }
    
    setIsImporting(true);
    
    try {
      await importProducts(mappedData, settings, (status) => {
        setImportStatus(status);
      });
    } catch (error) {
      console.error("Import error:", error);
      setImportStatus({
        ...importStatus,
        status: 'failed',
        errors: [...importStatus.errors, "An unexpected error occurred during import."]
      });
    }
  };
  
  const handleImportComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between slide-up">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                {isImporting ? (
                  <>
                    <ArrowRight className="h-7 w-7 mr-2 text-primary" />
                    Importing Products
                  </>
                ) : (
                  <>
                    <Table className="h-7 w-7 mr-2 text-primary" />
                    Map CSV Columns
                  </>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isImporting 
                  ? "Processing your product import"
                  : "Match your CSV columns to WooCommerce product fields"
                }
              </p>
            </div>
            {!isImporting && (
              <Button 
                variant="outline" 
                onClick={() => navigate("/import")}
                className="hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            )}
          </div>
          
          {isImporting ? (
            <ImportProgress 
              status={importStatus} 
              onComplete={handleImportComplete} 
            />
          ) : (
            csvData.length > 0 && (
              <MappingInterface 
                csvData={csvData} 
                onMappingComplete={handleMappingComplete} 
              />
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mapping;
