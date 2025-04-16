// src/Auth.js
import React, { useEffect } from 'react';
import { loginWithGoogle, getUser } from './auth';
import MainPage from './AppAfterLogin/mainPage';
import { Navigate } from 'react-router-dom';

const Auth = ({ user, setUser }) => {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  if (user) {
    return <MainPage user={user} setUser={setUser} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">
            NITJ Lost and Found Portal
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.277c0-.816-.067-1.636-.211-2.438H12.24v4.621h6.482c-.28 1.564-1.128 2.88-2.4 3.762v3.114h3.87c2.27-2.097 3.574-5.195 3.574-9.059z" fill="#4285F4"/>
              <path d="M12.24 24c3.236 0 5.966-1.062 7.954-2.893l-3.87-3.014c-1.075.731-2.464 1.146-4.084 1.146-3.132 0-5.794-2.115-6.752-4.958H1.5v3.111C3.472 21.239 7.57 24 12.24 24z" fill="#34A853"/>
              <path d="M5.488 14.281a7.104 7.104 0 0 1-.39-2.281c0-.791.142-1.561.39-2.281V6.608H1.5A11.947 11.947 0 0 0 0 12c0 1.936.464 3.772 1.5 5.392l3.988-3.111z" fill="#FBBC05"/>
              <path d="M12.24 4.76c1.762 0 3.344.605 4.592 1.794l3.43-3.437C18.203 1.186 15.472 0 12.24 0 7.57 0 3.472 2.761 1.5 6.608l3.988 3.111c.958-2.843 3.62-4.958 6.752-4.958z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Secure login powered by Google
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Only accessible to NITJ students and staff
          </p>
          <p className="mt-2 text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
          <p className="mt-2 text-sm text-green-600">Secure connection</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

