'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/metaflow/ontology', label: 'Ontology' },
  { href: '/metaflow/workspace', label: 'Workspace' },
  { href: '/metaflow/actions', label: 'Actions' },
  { href: '/metaflow/processes', label: 'Processes' },
  { href: '/metaflow/dashboard', label: 'Dashboard' },
];

export function MetaflowNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-background">
      <nav className="flex gap-0 px-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
