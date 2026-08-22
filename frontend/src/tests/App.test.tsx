import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge, PriorityBadge } from '../components/IssueBadge';
import { StatCard } from '../components/StatCard';
import { FolderGit2 } from 'lucide-react';
import React from 'react';

describe('Frontend Component Tests', () => {
  it('renders StatusBadge correctly', () => {
    render(<StatusBadge status="TODO" />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders PriorityBadge correctly', () => {
    render(<PriorityBadge priority="HIGH" />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders StatCard with title and value', () => {
    render(
      <StatCard
        title="Total Projects"
        value={12}
        icon={<FolderGit2 data-testid="icon" />}
        color="sky"
      />
    );
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
