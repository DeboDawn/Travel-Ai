import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-2 p-6 md:p-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </header>
  );
}
