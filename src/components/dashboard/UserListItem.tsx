"use client";

import Image from 'next/image';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

interface UserListItemProps {
  user: User;
}

export function UserListItem({ user }: UserListItemProps) {
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
        <Badge variant={user.role === 'Manager' ? 'default' : 'secondary'}>{user.role}</Badge>
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
    </TableRow>
  );
}
