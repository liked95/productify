import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { User, UserRole } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUser?: User | null;
  onSubmit: (user: User) => void;
}

const ROLES: UserRole[] = ['Manager', 'Contributor', 'Analyst'];

const METRIC_FIELDS = [
  {
    label: 'Tasks Done',
    name: 'tasksCompleted',
    type: 'number',
    placeholder: 'Tasks Done',
    min: 0,
    required: true,
  },
  {
    label: 'Avg. Time',
    name: 'avgCompletionTime',
    type: 'text',
    placeholder: 'Avg. Time (e.g. 2h 30m)',
    required: true,
  },
  {
    label: 'Score (%)',
    name: 'productivityScore',
    type: 'number',
    placeholder: 'Score (%)',
    min: 0,
    max: 100,
    required: true,
  },
  {
    label: 'Active Projects',
    name: 'activeProjects',
    type: 'number',
    placeholder: 'Active Projects',
    min: 0,
    required: true,
  },
  {
    label: 'Overdue',
    name: 'overdueTasks',
    type: 'number',
    placeholder: 'Overdue',
    min: 0,
    required: true,
  },
];

export function UserFormDialog({ open, onOpenChange, initialUser, onSubmit }: UserFormDialogProps) {
  const [form, setForm] = useState<User>(
    initialUser || {
      id: '',
      name: '',
      email: '',
      role: 'Manager',
      metrics: {
        tasksCompleted: 0,
        avgCompletionTime: '',
        productivityScore: 0,
        activeProjects: 0,
        overdueTasks: 0,
      },
    }
  );

  useEffect(() => {
    if (initialUser) {
      setForm(initialUser);
    } else {
      setForm({
        id: '',
        name: '',
        email: '',
        role: 'Manager',
        metrics: {
          tasksCompleted: 0,
          avgCompletionTime: '',
          productivityScore: 0,
          activeProjects: 0,
          overdueTasks: 0,
        },
      });
    }
  }, [initialUser, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name in form.metrics) {
      setForm({
        ...form,
        metrics: {
          ...form.metrics,
          [name]: type === 'number' && name !== 'avgCompletionTime' ? Number(value) : value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.metrics.avgCompletionTime.trim()) return;
    const user: User = {
      ...form,
      id: form.id || uuidv4(),
    };
    onSubmit(user);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-foreground border border-border">
        <DialogHeader>
          <DialogTitle>{initialUser ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {initialUser ? 'Update user details below.' : 'Fill in the details to add a new user.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="bg-background border border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" className="bg-background border border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-foreground">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full border border-border rounded p-2 bg-background text-foreground">
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          {METRIC_FIELDS.map(field => (
            <div className="space-y-2" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-foreground">{field.label}</label>
              <Input
                id={field.name}
                name={field.name}
                value={form.metrics[field.name as keyof typeof form.metrics]}
                onChange={handleChange}
                placeholder={field.placeholder}
                type={field.type}
                min={field.min}
                max={field.max}
                required={field.required}
                className="bg-background border border-border text-foreground"
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">{initialUser ? 'Update' : 'Add'} User</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 