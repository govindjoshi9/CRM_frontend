"use client";

import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  Building2,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { useAuthStore } from "@/store/authStore";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, party, activeRole, logout } = useAuthStore();
  const [branch] = useState("Main Branch");

  const isStaff = activeRole === 'staff';
  const displayName = isStaff ? (user?.email || "Staff User") : (party?.name || "Client User");
  const displayRole = isStaff ? (user?.role || "staff") : "client";
  const initials = isStaff 
    ? (user?.email ? user.email.slice(0, 2).toUpperCase() : "ST") 
    : (party?.name ? party.name.slice(0, 2).toUpperCase() : "CL");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Global search */}
      <div className="relative hidden flex-1 md:block md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anything — leads, invoices, parties…"
          className="h-9 border-border bg-muted/50 pl-9 pr-16 text-sm focus-visible:bg-background focus-visible:ring-primary"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        {/* Branch switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden h-9 gap-2 sm:flex items-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs font-medium outline-none">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="max-w-[120px] truncate">{branch}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Active Branch
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Main Branch
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              Warehouse West
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              Outlet South
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-background" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring border-none bg-transparent cursor-pointer">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start leading-tight lg:flex">
              <span className="text-xs font-medium text-foreground">
                {displayName}
              </span>
              <Badge
                variant="outline"
                className="h-4 px-1 text-[9px] font-medium uppercase text-emerald-600"
              >
                {displayRole}
              </Badge>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground lg:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {isStaff ? (user?.business || "Zamtrix Solutions") : "Client Party"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              Help & Docs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
