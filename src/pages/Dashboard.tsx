
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getImportLogsByUserId, ImportLog } from "@/utils/databaseService";
import { 
  BarChart, 
  Upload, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user) {
      // Load import logs for the user
      const logs = getImportLogsByUserId(user.id);
      setImportLogs(logs);
    }
  }, [isAuthenticated, user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart className="h-7 w-7 mr-2 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.username}! Manage your WooCommerce imports.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">
            <Card className="hover-lift transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  Import Products
                </CardTitle>
                <CardDescription>
                  Upload and map your CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/import")}
                >
                  Start Import
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover-lift transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure WooCommerce API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate("/settings")}
                >
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover-lift transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Statistics
                </CardTitle>
                <CardDescription>
                  View your import activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{importLogs.length}</div>
                <div className="text-muted-foreground text-sm">Total imports</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Recent Import History
              </CardTitle>
              <CardDescription>
                View your recent product import activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {importLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Products</th>
                        <th className="text-left p-2">Successful</th>
                        <th className="text-left p-2">Failed</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-2">{formatDate(log.import_date)}</td>
                          <td className="p-2">{log.total_products}</td>
                          <td className="p-2 text-green-600">{log.successful_imports}</td>
                          <td className="p-2 text-red-600">{log.failed_imports}</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              {getStatusIcon(log.status)}
                              <span className="ml-2 capitalize">{log.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No import history yet. Start your first import to see logs here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
