import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const ServiceUnavilabe = () => {
  const handleRetry = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6F2F5] p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl p-8 text-center border-t-4 border-orange-500">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-50 rounded-full">
            <AlertTriangle className="w-16 h-16 text-orange-600 animate-bounce" />
          </div>
        </div>

        {/* <h1 className="text-3xl font-bold text-[#0F3A46] mb-2">503</h1> */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Service Unavailable
        </h2>

        <p className="text-gray-600 mb-8">
          We are currently performing brief maintenance on FinAxis to improve
          your experience. Please try again in a few minutes.
        </p>

        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#0F3A46] text-white rounded-lg hover:bg-[#0C2A35] transition-all font-bold shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Connection
        </button>

        <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">
          Systems Operations Center
        </p>
      </div>
    </div>
  );
};

export default ServiceUnavilabe;
