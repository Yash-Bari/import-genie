
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { saveWooCommerceSettings, validateCredentials } from "@/utils/apiService";
import { getWooCommerceSettingsByUserId } from "@/utils/databaseService";
import { Settings as SettingsIcon, Key, Globe, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [siteUrl, setSiteUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Load settings for the current user
    if (user) {
      const settings = getWooCommerceSettingsByUserId(user.id);
      if (settings) {
        setSiteUrl(settings.site_url);
        setConsumerKey(settings.consumer_key);
        setConsumerSecret(settings.consumer_secret);
        setIsValidated(true);
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteUrl || !consumerKey || !consumerSecret) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsValidating(true);
    
    try {
      const isValid = await validateCredentials({
        siteUrl,
        consumerKey,
        consumerSecret
      });
      
      if (isValid) {
        if (user) {
          saveWooCommerceSettings(
            { siteUrl, consumerKey, consumerSecret },
            user.id
          );
        }
        
        setIsValidated(true);
        toast.success("WooCommerce settings validated and saved");
      } else {
        toast.error("Failed to validate WooCommerce credentials. Please check your details.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An error occurred while validating credentials");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="h-7 w-7 mr-2 text-primary" />
              WooCommerce Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your WooCommerce API connection
            </p>
          </div>
          
          <Card className="glass-card slide-up">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Enter your WooCommerce REST API credentials
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteUrl" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Site URL
                  </Label>
                  <Input
                    id="siteUrl"
                    placeholder="https://your-woocommerce-site.com"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The full URL to your WooCommerce website (e.g., https://example.com)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consumerKey" className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Consumer Key
                  </Label>
                  <Input
                    id="consumerKey"
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxx"
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your WooCommerce Consumer Key (found in WooCommerce → Settings → Advanced → REST API)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consumerSecret" className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Consumer Secret
                  </Label>
                  <Input
                    id="consumerSecret"
                    type="password"
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxx"
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your WooCommerce Consumer Secret (found in WooCommerce → Settings → Advanced → REST API)
                  </p>
                </div>
                
                {isValidated && (
                  <div className="flex items-center text-green-600 text-sm mt-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Your WooCommerce connection is validated
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : isValidated ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Update Settings
                    </>
                  ) : (
                    "Save and Validate"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card className="glass-card slide-up">
            <CardHeader>
              <CardTitle className="text-lg">How to Get Your WooCommerce API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Log in to your WordPress admin panel</li>
                <li>Navigate to WooCommerce → Settings → Advanced → REST API</li>
                <li>Click on "Add Key" button</li>
                <li>
                  Enter a description (e.g., "Import Genie"), set permissions to "Read/Write", 
                  and select a user with admin privileges
                </li>
                <li>Click "Generate API Key"</li>
                <li>Copy the Consumer Key and Consumer Secret</li>
                <li>Paste them in the fields above</li>
              </ol>
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  Note: Make sure your WooCommerce site has properly configured CORS settings 
                  to allow requests from this application.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
