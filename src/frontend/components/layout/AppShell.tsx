import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface AppShellProps {
  appName: string;
  roleLabel: string;
  navItems: NavItem[];
  children: ReactNode;
}

export function AppShell({ appName, roleLabel, navItems, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>{appName}</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>{item.label}</li>
            ))}
          </ul>
        </nav>
      </aside>
      <main>
        <header>
          <strong>{roleLabel}</strong>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
}
