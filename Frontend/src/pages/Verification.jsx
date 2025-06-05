import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Building2, FileText, ArrowRight } from 'lucide-react';

const Verification = () => {
  const verificationTypes = [
    {
      title: 'KYC Verification',
      description: 'Complete your identity verification to start investing in tokenized real estate.',
      icon: Shield,
      path: '/kyc-verification',
      color: 'blue'
    },
    {
      title: 'Property Verification',
      description: 'Submit and verify your property documents for tokenization.',
      icon: Building2,
      path: '/property-verification',
      color: 'purple'
    },
    {
      title: 'Document Verification',
      description: 'Get your legal and financial documents verified for compliance.',
      icon: FileText,
      path: '/document-verification',
      color: 'green'
    }
  ];

  return (
    <div className="pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4"
          >
            <Shield className="h-8 w-8 text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Verification Center</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete necessary verifications to ensure security and compliance.
            Choose the verification process you need to complete.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {verificationTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/50 rounded-xl p-6 border border-${type.color}-500/20 hover:border-${type.color}-500/50 backdrop-blur-sm transition-all duration-300`}
            >
              <div className={`p-3 rounded-lg bg-${type.color}-500/20 inline-block mb-4`}>
                <type.icon className={`h-6 w-6 text-${type.color}-500`} />
              </div>
              <h2 className="text-xl font-semibold mb-2">{type.title}</h2>
              <p className="text-gray-400 mb-6">{type.description}</p>
              <Link
                to={type.path}
                className={`inline-flex items-center space-x-2 text-${type.color}-400 hover:text-${type.color}-300 transition-colors`}
              >
                <span>Start Verification</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-4">Verification Process</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">1. Identity Verification</h4>
                <p className="text-sm text-gray-400">Complete KYC process with valid ID and proof of address</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Property Verification</h4>
                <p className="text-sm text-gray-400">Submit property documents and complete verification</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Document Review</h4>
                <p className="text-sm text-gray-400">Get your documents reviewed and approved</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Verification;