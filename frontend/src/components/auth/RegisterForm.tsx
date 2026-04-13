import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidEmail, getPasswordStrength } from '@/utils/validators';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!isValidEmail(email)) errs.email = 'Valid email is required';
    if (username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await register(email, username, password);
      navigate('/dashboard');
    } catch {
      // Error is set in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="you@example.com" />
      <Input id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} placeholder="Choose a username" />
      <div>
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} placeholder="Min 8 characters" />
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(strength.score / 5) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500">{strength.label}</span>
          </div>
        )}
      </div>
      <Input id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} placeholder="Re-enter password" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" isLoading={isLoading} className="w-full">Create Account</Button>
      <p className="text-sm text-center text-slate-500">
        Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign In</Link>
      </p>
    </form>
  );
}
