"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserListItem } from './UserListItem';
import { ArrowUpDown, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SortKey = keyof User['metrics'] | 'name' | 'role';

export function UserList() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (debouncedSearchTerm) {
      sortableUsers = sortableUsers.filter(user =>
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'name' || sortConfig.key === 'role') {
          valA = a[sortConfig.key];
          valB = b[sortConfig.key];
        } else {
          valA = a.metrics[sortConfig.key as keyof User['metrics']];
          valB = b.metrics[sortConfig.key as keyof User['metrics']];
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, debouncedSearchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <ArrowUpDown className="ml-2 h-4 w-4 transform rotate-0 text-primary" /> : 
      <ArrowUpDown className="ml-2 h-4 w-4 transform rotate-180 text-primary" />;
  };
  
  const SortableHeader = ({ sortKey, children }: { sortKey: SortKey; children: React.ReactNode }) => (
    <TableHead onClick={() => requestSort(sortKey)} className="cursor-pointer group hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-center">
        {children}
        {getSortIndicator(sortKey)}
      </div>
    </TableHead>
  );


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            User Productivity Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
          />
        </div>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer group hover:bg-accent/50 transition-colors min-w-[200px]">
                  <div className="flex items-center">User {getSortIndicator('name')}</div>
                </TableHead>
                <SortableHeader sortKey="role">Role</SortableHeader>
                <SortableHeader sortKey="tasksCompleted">Tasks Done</SortableHeader>
                <SortableHeader sortKey="avgCompletionTime">Avg. Time</SortableHeader>
                <SortableHeader sortKey="productivityScore">Score</SortableHeader>
                <SortableHeader sortKey="activeProjects">Active Projects</SortableHeader>
                <SortableHeader sortKey="overdueTasks">Overdue</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserListItem key={user.id} user={user} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredUsers.length === 0 && debouncedSearchTerm && (
           <p className="text-center mt-4 text-muted-foreground">No users match your search for "{debouncedSearchTerm}".</p>
        )}
      </CardContent>
    </Card>
  );
}
