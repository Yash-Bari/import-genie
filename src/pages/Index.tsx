
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileImport, ArrowRight, Users, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-6 slide-up">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <FileImport className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                WooCommerce Product <span className="text-gradient">Import Genie</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Effortlessly import and manage your WooCommerce products with our intuitive CSV import system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button size="lg" onClick={() => navigate("/register")} className="hover-lift">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="hover-lift">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Powerful Features</h2>
              <p className="text-muted-foreground mt-2">Everything you need to manage your WooCommerce product imports</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 hover-lift">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-14 h-14 flex items-center justify-center mb-4">
                  <FileImport className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Mapping</h3>
                <p className="text-muted-foreground">
                  Intelligently map your CSV data to WooCommerce product fields with our intuitive interface.
                </p>
              </div>
              
              <div className="glass-card p-6 hover-lift">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-14 h-14 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Imports</h3>
                <p className="text-muted-foreground">
                  Process large product catalogs efficiently with our optimized batch import system.
                </p>
              </div>
              
              <div className="glass-card p-6 hover-lift">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 w-14 h-14 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Integration</h3>
                <p className="text-muted-foreground">
                  Connect securely to your WooCommerce store with encrypted API credentials.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground mt-2">Simple steps to import your products</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Link your WooCommerce store with our secure API integration
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your product data in CSV format
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Map</h3>
                <p className="text-sm text-muted-foreground">
                  Map CSV columns to WooCommerce product fields
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Import</h3>
                <p className="text-sm text-muted-foreground">
                  Process your import and start selling
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center glass-panel py-12 px-6">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your product imports?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of WooCommerce store owners who are saving time with our import tool.
            </p>
            <Button size="lg" onClick={() => navigate("/register")} className="hover-lift">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
