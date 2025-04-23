import React from 'react';
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  const handleOAuthError = (error) => {
    console.error("OAuth error:", error);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <div className='shadow-lg p-5 bg-white rounded-lg'>
        <SignUp 
          appearance={{
            variables: {
              colorPrimary: '#f97316',
              colorText: '#000000',
              colorTextSecondary: '#666666',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#000000',
              colorInputBorder: '#e5e7eb'
            },
            elements: {
              formButtonPrimary: 'bg-orange-300 hover:bg-orange-700',
              card: 'shadow-none',
              rootBox: 'w-full',
              formFieldInput: 'w-full px-2 py-1 border-b border-gray-300 focus:border-blue-500 outline-none',
              footerActionLink: 'text-orange-500 hover:text-orange-700',
              socialButtonsIconButton: "hover:bg-orange-50",
              socialButtonsBlockButton: "hover:bg-orange-50"
            }
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          oauthCallback={(result) => {
            if (result.status === 'error') {
              handleOAuthError(result.error);
            }
          }}
          turnstileOptions={{
            theme: 'light',
            responseTimeout: 30000,
            refreshExpired: 'auto'
          }}
        />
      </div>
    </div>
  );
}

export default SignUpPage;
