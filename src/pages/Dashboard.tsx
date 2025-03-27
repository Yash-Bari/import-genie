
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { FileImport, LayoutDashboard, Settings, History, AlertTriangle } from "lucide-react";
import { getSettings } from "@/utils/apiService";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const settings = getSettings();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold flex items-center">
              <LayoutDashboard className="h-7 w-7 mr-2 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.username || "User"}
            </p>
          </div>
          
          {!settings && (
            <Card className="glass-card border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Setup Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You need to configure your WooCommerce API credentials before importing products.
                </p>
                <Button 
                  onClick={() => navigate("/settings")} 
                  variant="outline" 
                  size="sm"
                  className="text-amber-600 border-amber-200 hover:bg-amber-100"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">Quick Import</CardTitle>
                <CardDescription>
                  Start a new product import
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/import")} 
                  disabled={!settings}
                  className="w-full"
                >
                  <FileImport className="h-4 w-4 mr-2" />
                  Start Import
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  Configure your API credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/settings")} 
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">Import History</CardTitle>
                <CardDescription>
                  View past import logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  className="w-full opacity-60"
                  disabled
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">Coming soon</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No recent import activity found
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
