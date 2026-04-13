import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold">See It In Action</h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Create an account, manage tasks, and open the Behind the Scenes panel to watch the full architecture working live.
        </p>
        <div className="mt-8">
          <Link to="/register">
            <Button size="lg">Try the Live Demo</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
