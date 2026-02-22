'use client';

import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bot, Globe, Languages, LayoutGrid, Route, Scan, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/', label: 'Home', icon: <LayoutGrid /> },
  { href: '/itinerary-generator', label: 'Itinerary Generator', icon: <Route /> },
  { href: '/travel-assistant', label: 'Travel Assistant', icon: <Bot /> },
  { href: '/phrasebook', label: 'Phrasebook', icon: <Languages /> },
  { href: '/ar-scanner', label: 'AR Scanner', icon: <Scan /> },
  { href: '/community', label: 'Community', icon: <Users /> },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
            <Globe className="size-8 text-sidebar-primary" />
            <h2 className="text-2xl font-bold font-headline text-sidebar-foreground">
                WanderWise
            </h2>
        </Link>
      </SidebarHeader>
      <Separator className="bg-sidebar-border" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
