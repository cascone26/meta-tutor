interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <div className="border-b border-stone-800 bg-stone-950 px-6 py-4 pl-14 lg:pl-6">
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <h1 className="text-lg font-semibold text-stone-100">{title}</h1>
          {subtitle && (
            <p className="text-xs text-stone-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
