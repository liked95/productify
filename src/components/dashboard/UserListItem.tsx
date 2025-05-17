"use client";

import Image from 'next/image';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

interface UserListItemProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

export function UserListItem({ user, onEdit, onDelete }: UserListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint || "person portrait"} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          className={
            user.role === 'Manager'
              ? 'bg-blue-600 text-white'
              : user.role === 'Contributor'
              ? 'bg-green-600 text-white'
              : 'bg-yellow-500 text-white'
          }
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="text-center text-foreground">{user.metrics.tasksCompleted}</TableCell>
      <TableCell className="text-center text-foreground">{user.metrics.avgCompletionTime}</TableCell>
      <TableCell className="text-center">
        <span className={`font-semibold ${user.metrics.productivityScore >= 80 ? 'text-green-600' : user.metrics.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
          {user.metrics.productivityScore}%
        </span>
      </TableCell>
       <TableCell className="text-center text-foreground">{user.metrics.activeProjects}</TableCell>
      <TableCell className="text-center">
         <span className={user.metrics.overdueTasks > 0 ? 'text-red-600 font-semibold' : 'text-foreground'}>
            {user.metrics.overdueTasks}
         </span>
      </TableCell>
      <TableCell className="text-center align-middle">
        <div className="flex gap-2 justify-center items-center h-full">
          {onEdit && (
            <button
              className="text-blue-600 hover:underline"
              onClick={() => onEdit(user)}
              title="Edit"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="text-red-600 hover:underline"
              onClick={() => onDelete(user.id)}
              title="Delete"
            >
              Delete
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
