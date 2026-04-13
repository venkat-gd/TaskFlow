import { motion } from 'framer-motion';

const nodes = [
  { label: 'React + TS', x: 50, y: 30, color: '#61DAFB' },
  { label: 'Flask API', x: 250, y: 30, color: '#4F46E5' },
  { label: 'PostgreSQL', x: 400, y: 100, color: '#336791' },
  { label: 'Redis', x: 400, y: -40, color: '#DC382D' },
  { label: 'Celery', x: 250, y: 130, color: '#37B24D' },
  { label: 'WebSocket', x: 150, y: 130, color: '#F59E0B' },
];

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold">Live Architecture</h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">Every connection is real. Watch data flow through the system.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <svg viewBox="-20 -80 520 260" className="w-full">
          {/* Connection lines */}
          {[
            [50, 30, 250, 30],
            [250, 30, 400, 100],
            [250, 30, 400, -40],
            [250, 30, 250, 130],
            [150, 130, 250, 130],
            [50, 30, 150, 130],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-600"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            />
          ))}
          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={node.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <circle cx={node.x} cy={node.y} r="28" fill={node.color} opacity={0.15} />
              <circle cx={node.x} cy={node.y} r="22" fill={node.color} opacity={0.3} />
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="text-[10px] font-semibold fill-current">
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </section>
  );
}
