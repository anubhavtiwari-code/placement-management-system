import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto z-10"
      >
        <span className="px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 font-medium text-sm border border-brand-500/20 mb-6 inline-block">
          🚀 Production Stabilized (v1.2.9-Ultra)
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold font-heading text-white tracking-tight mb-6 leading-tight">
          Launch your career with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">NexusPlace</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one ecosystem bridging the gap between top-tier technical talent and leading global companies. Seamlessly manage drives, applications, and offers.
        </p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link to="/register" className="btn-primary text-lg px-8 py-3.5 w-full sm:w-auto">
            Get Started Free
          </Link>
          <Link to="/login" className="btn-outline text-lg px-8 py-3.5 w-full sm:w-auto">
            Login to Account
          </Link>
        </motion.div>
      </motion.div>

      {/* Role Cards Area */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10 mb-20"
      >
        <RoleCard 
          icon="🎓"
          title="For Students" 
          desc="Build your profile, apply to top companies with one click, and track your interview rounds effortlessly." 
          color="from-blue-500/20 to-cyan-500/20"
        />
        <RoleCard 
          icon="🏢"
          title="For Companies" 
          desc="Post job drives, filter applicants by CGPA or skills, and seamlessly transition candidates through the pipeline." 
          color="from-purple-500/20 to-pink-500/20"
        />
        <RoleCard 
          icon="🛡️"
          title="For Admins" 
          desc="Monitor the entire ecosystem, verify company accounts, and generate high-level placement reports." 
          color="from-emerald-500/20 to-teal-500/20"
        />
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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

function RoleCard({ icon, title, desc, color }) {
  return (
    <div className={`glass-card p-8 group relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-heading font-bold text-2xl text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
          {desc}
        </p>
      </div>
    </div>
  );
}