
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Settings as SettingsIcon, Key, Globe, Save, Loader2, CheckCircle2 } from "lucide-react";
import { WooCommerceSettings, getSettings, saveSettings, validateCredentials } from "@/utils/apiService";
import { toast } from "sonner";

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  
  const [settings, setSettings] = useState<WooCommerceSettings>({
    siteUrl: "",
    consumerKey: "",
    consumerSecret: "",
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Load existing settings if available
    const savedSettings = getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [isAuthenticated, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setIsValidated(false);
  };
  
  const handleValidate = async () => {
    if (!settings.siteUrl || !settings.consumerKey || !settings.consumerSecret) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsValidating(true);
    
    try {
      const isValid = await validateCredentials(settings);
      
      if (isValid) {
        toast.success("API credentials validated successfully");
        setIsValidated(true);
      } else {
        toast.error("Failed to validate API credentials");
      }
    } catch (error) {
      toast.error("An error occurred during validation");
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleSave = () => {
    saveSettings(settings);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="h-7 w-7 mr-2 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your WooCommerce API credentials
            </p>
          </div>
          
          <Card className="glass-card slide-up">
            <CardHeader>
              <CardTitle className="text-xl">WooCommerce API Configuration</CardTitle>
              <CardDescription>
                Enter your WooCommerce REST API credentials to enable product imports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteUrl">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    WooCommerce Site URL
                  </div>
                </Label>
                <Input 
                  id="siteUrl"
                  name="siteUrl"
                  placeholder="https://your-store.com"
                  value={settings.siteUrl}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL of your WooCommerce store
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consumerKey">
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-1" />
                    Consumer Key
                  </div>
                </Label>
                <Input 
                  id="consumerKey"
                  name="consumerKey"
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={settings.consumerKey}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in WooCommerce &gt; Settings &gt; Advanced &gt; REST API
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consumerSecret">
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-1" />
                    Consumer Secret
                  </div>
                </Label>
                <Input 
                  id="consumerSecret"
                  name="consumerSecret"
                  type="password"
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={settings.consumerSecret}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Keep this secret secure — it authorizes access to your store
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={handleValidate}
                disabled={isValidating || !settings.siteUrl || !settings.consumerKey || !settings.consumerSecret}
                className="w-full sm:w-auto"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : isValidated ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Validated
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!settings.siteUrl || !settings.consumerKey || !settings.consumerSecret}
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-card slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Import Default Settings</CardTitle>
              <CardDescription>
                Configure default behavior for product imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                Additional settings coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
