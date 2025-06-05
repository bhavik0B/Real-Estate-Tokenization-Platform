import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Camera, FileText, Shield } from 'lucide-react';

const KYCVerification = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStep(step + 1);
    }, 2000);
  };

  return (
    <div className="pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 rounded-full bg-blue-500/20 mb-4"
          >
            <Shield className="h-8 w-8 text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">KYC Verification</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete your identity verification to start investing in tokenized real estate.
            This process helps ensure security and compliance with regulations.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700/50">
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3].map((number) => (
              <div key={number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > number
                      ? 'bg-green-500'
                      : step === number
                      ? 'bg-blue-500'
                      : 'bg-slate-700'
                  } transition-colors duration-300`}
                >
                  {step > number ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-white">{number}</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {number === 1 ? 'Personal Info' : number === 2 ? 'Documents' : 'Verification'}
                </div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full bg-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                <textarea
                  className="w-full bg-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Upload ID Photo</h3>
                  <p className="text-sm text-gray-400">
                    Upload a clear photo of your government-issued ID
                  </p>
                </div>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Proof of Address</h3>
                  <p className="text-sm text-gray-400">
                    Upload a recent utility bill or bank statement
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verification Complete!</h2>
              <p className="text-gray-400 mb-6">
                Your identity has been verified. You can now start investing in tokenized properties.
              </p>
            </motion.div>
          )}

          <div className="mt-8 flex justify-end">
            {step < 3 && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  uploading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KYCVerification;