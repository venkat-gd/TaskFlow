import { Card } from '@/components/ui/Card';

const techs = [
  { name: 'React 19', desc: 'UI library with hooks & concurrent features', color: 'bg-cyan-500' },
  { name: 'TypeScript', desc: 'Strict typing, no any, interface-first', color: 'bg-blue-600' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling with dark mode', color: 'bg-teal-500' },
  { name: 'Flask', desc: 'Python WSGI framework with app factory', color: 'bg-slate-700' },
  { name: 'SQLAlchemy', desc: 'ORM with PostgreSQL, UUID PKs, enums', color: 'bg-orange-600' },
  { name: 'Redis', desc: 'Caching, rate limiting, token blocklist', color: 'bg-red-600' },
  { name: 'Celery', desc: 'Async task queue with beat scheduling', color: 'bg-green-600' },
  { name: 'WebSocket', desc: 'Real-time devtools panel updates', color: 'bg-amber-500' },
  { name: 'Docker', desc: 'Multi-service compose with health checks', color: 'bg-blue-500' },
  { name: 'GitHub Actions', desc: 'CI/CD: lint, test, security, deploy', color: 'bg-gray-800' },
  { name: 'Playwright', desc: 'End-to-end testing across browsers', color: 'bg-green-500' },
  { name: 'Zustand', desc: 'Lightweight global state management', color: 'bg-purple-600' },
];

export function TechStack() {
  return (
    <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {techs.map((tech) => (
            <Card key={tech.name} className="group hover:shadow-md transition-shadow cursor-default">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${tech.color}`} />
                <div>
                  <p className="font-semibold text-sm">{tech.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tech.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
