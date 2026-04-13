import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

const features = [
  {
    title: 'Frontend',
    items: ['React 19 + TypeScript strict', 'Tailwind with dark mode', 'Kanban drag-and-drop', 'Zustand state management', 'Optimistic UI updates'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Backend',
    items: ['Flask app factory + JWT auth', 'PostgreSQL + SQLAlchemy ORM', 'Redis caching with invalidation', 'Celery async task queue', 'Rate limiting + request logging'],
    color: 'from-primary-500 to-purple-500',
  },
  {
    title: 'QA / DevOps',
    items: ['pytest 90%+ coverage', 'Playwright E2E tests', 'Docker Compose orchestration', 'GitHub Actions CI/CD', 'Security scanning (pip-audit, Trivy)'],
    color: 'from-emerald-500 to-teal-500',
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Three Pillars</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="h-full">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.title}
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
