import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl lg:text-7xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Full-Stack
          </span>
          <br />
          Architecture Showcase
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          A production-grade task management app that lets you see the architecture working in real-time.
          Watch API calls, cache hits, and background jobs as they happen.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link to="/register">
            <Button size="lg">Try the Live Demo</Button>
          </Link>
          <a href="#architecture">
            <Button variant="secondary" size="lg">View Architecture</Button>
          </a>
        </motion.div>
      </div>
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
    </section>
  );
}
