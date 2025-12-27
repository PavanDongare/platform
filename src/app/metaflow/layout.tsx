import { MetaflowNav } from './components/metaflow-nav';

export default function MetaflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MetaflowNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
