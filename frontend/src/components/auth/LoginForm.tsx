import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidEmail } from '@/utils/validators';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!isValidEmail(email)) errs.email = 'Valid email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error is set in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="you@example.com" />
      <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} placeholder="Enter your password" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" isLoading={isLoading} className="w-full">Sign In</Button>
      <p className="text-sm text-center text-slate-500">
        Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
      </p>
    </form>
  );
}
