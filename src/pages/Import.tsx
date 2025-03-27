
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, ArrowLeft, Database } from "lucide-react";
import { getSettings } from "@/utils/apiService";
import FileUpload from "@/components/ui/FileUpload";
import { toast } from "sonner";

const Import = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState<string[][]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const settings = getSettings();
    if (!settings) {
      toast.error("Please configure WooCommerce API settings first");
      navigate("/settings");
    }
  }, [isAuthenticated, navigate]);
  
  const handleFileProcessed = (data: string[][]) => {
    setCsvData(data);
    
    // Navigate to mapping page with data
    navigate("/mapping", { state: { csvData: data } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between slide-up">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Upload className="h-7 w-7 mr-2 text-primary" />
                Import Products
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload your CSV file to begin the import process
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="hover-lift"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <FileUpload onFileProcessed={handleFileProcessed} />
          
          <Card className="glass-card slide-up">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Database className="mr-2 h-5 w-5 text-primary" />
                CSV Format Guidelines
              </CardTitle>
              <CardDescription>
                For best results, format your CSV file according to these guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Required Columns</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Product Name</li>
                  <li>Price</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Recommended Columns</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Description</li>
                  <li>SKU</li>
                  <li>Category</li>
                  <li>Stock Quantity</li>
                  <li>Image URL</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">CSV Formatting Tips</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Use UTF-8 encoding for proper character support</li>
                  <li>Include column headers in the first row</li>
                  <li>Use standard CSV formatting with commas as delimiters</li>
                  <li>For multiple values in a single field (like categories), separate with a pipe (|)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Import;
