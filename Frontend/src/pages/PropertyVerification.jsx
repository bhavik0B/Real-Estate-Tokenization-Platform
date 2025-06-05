import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const PropertyVerification = () => {
  const [documents, setDocuments] = useState({
    title: false,
    inspection: false,
    appraisal: false,
    insurance: false
  });

  const handleUpload = (doc) => {
    setDocuments(prev => ({ ...prev, [doc]: true }));
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
            className="inline-block p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <Building2 className="h-8 w-8 text-purple-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Property Verification</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Submit required documentation to verify your property for tokenization.
            Our team will review and validate all submitted documents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Property Title',
              description: 'Upload clear copy of property title deed',
              icon: FileText,
              key: 'title'
            },
            {
              title: 'Property Inspection',
              description: 'Recent property inspection report',
              icon: Building2,
              key: 'inspection'
            },
            {
              title: 'Property Appraisal',
              description: 'Professional property valuation report',
              icon: FileText,
              key: 'appraisal'
            },
            {
              title: 'Insurance Documents',
              description: 'Valid property insurance documentation',
              icon: Shield,
              key: 'insurance'
            }
          ].map((doc) => (
            <motion.div
              key={doc.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-slate-800/50 rounded-xl p-6 border ${
                documents[doc.key]
                  ? 'border-green-500/50'
                  : 'border-slate-700/50'
              } backdrop-blur-sm transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  documents[doc.key] ? 'bg-green-500/20' : 'bg-slate-700/50'
                }`}>
                  <doc.icon className={`h-6 w-6 ${
                    documents[doc.key] ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{doc.description}</p>
                  {documents[doc.key] ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Uploaded successfully</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpload(doc.key)}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload Document</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-4">Verification Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Document Upload Progress</span>
              <span className="text-blue-400">
                {Object.values(documents).filter(Boolean).length} / 4
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(Object.values(documents).filter(Boolean).length / 4) * 100}%`
                }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span>Our team will review your documents within 2-3 business days</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PropertyVerification;