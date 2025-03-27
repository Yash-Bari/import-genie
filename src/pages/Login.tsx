
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
