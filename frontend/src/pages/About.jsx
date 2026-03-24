import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl z-10 text-center glass-card p-10 md:p-16 mb-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
          About <span className="text-brand-400">NexusPlace</span>
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
          NexusPlace is a modern, unified Placement Management System designed to bridge the gap between universities, students, and top-tier global companies. In today's fast-paced tech environment, traditional placement processes are often bogged down by scattered data, miscommunication, and inefficient tracking. NexusPlace solves this by providing a centralized hub where talent meets opportunity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left mt-12">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <h4 className="text-xl font-bold text-white mb-2">🚀 Fast Setup</h4>
            <p className="text-sm text-slate-400">Get your university or company onboarded in minutes, not days.</p>
          </div>
          <div className="p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <h4 className="text-xl font-bold text-white mb-2">📊 Analytics</h4>
            <p className="text-sm text-slate-400">Real-time placement statistics, offer ratios, and skill matching.</p>
          </div>
          <div className="p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <h4 className="text-xl font-bold text-white mb-2">🔒 Secure</h4>
            <p className="text-sm text-slate-400">Enterprise-grade security ensuring student data privacy.</p>
          </div>
          <div className="p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <h4 className="text-xl font-bold text-white mb-2">🤖 AI-Driven</h4>
            <p className="text-sm text-slate-400">Smart matching capabilities to connect the right candidate with the right role.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
