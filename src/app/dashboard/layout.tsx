"use client";
import {
  Avatar,
  Caption,
  CollapsibleSidebar,
  Header,
  IconButton,
  Text,
  colors,
} from "@hdfclife-insurance/one-x-ui";
import CustomDrawer from "./components/Drawer";
import {
  CaretLeft,
  CaretRight,
  ChartPie,
  Copy,
  Handshake,
  ShieldCheck,
  UserCircleGear,
  Users,
  UsersThree,
  WifiNone,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useCallback, useState } from "react";
// import AvatarImage from "../../../assets/avatar.png";
import AvatarImage from "../../../assets/avatar.png";
import HLIInspireLogo from "../../../assets/templates/logos/HLI_Inspire_Logo.svg";

export default function DashboardBase({ children }) {
  // Single state for sidebar toggle
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Memoized toggle handler
  const handleSidebarToggle = useCallback((pressed: boolean) => {
    setSidebarOpen(pressed);
  }, []);

  const handleDrawerToggle = useCallback((pressed: boolean) => {
    setDrawerOpen(pressed);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 [--gutter:24px] [--header-height:68px]">
      {/* Header Section */}
      <Header
        fixed
        className="border-0 border-b border-solid border-indigo-200 gap-5"
      >
        <Header.Hamburger
          pressed={isSidebarOpen}
          onPressedChange={handleSidebarToggle}
        />

        {/* Hard coded */}
        <Header.Logo
          src="/assets/templates/logos/HLI_Inspire_Logo.svg"
          className="!w-[150px]"
        />
        <div className="flex items-center justify-end gap-3 w-full">
          <div className="text-right hidden lg:block">
            <Text size="sm" fontWeight="bold">
              Sujoy Guru
            </Text>
            <Text size="sm">Key Account Manager</Text>
            <Caption className="italic">
              Last login : 03/09/2024 12:21 pm
            </Caption>
          </div>
          <Avatar variant="outline" src="/assets/avatar.png" />
          <IconButton
            variant="tertiary"
            size="sm"
            onClick={() => handleDrawerToggle(!isDrawerOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            {isDrawerOpen ? <CaretRight /> : <CaretLeft />}
          </IconButton>
        </div>
      </Header>

      <div className="lg:flex flex-1">
        {/* Sidebar - Hidden on mobile, flexible width on desktop */}
        <aside
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="hidden lg:flex z-[1] flex-col fixed transition-all bottom-0 top-0 pt-[var(--header-height)] left-0"
        >
          <CollapsibleSidebar
            collapsed={!isSidebarOpen}
            items={[
              // Single sidebar links
              {
                label: "New business",
                href: "#",
                leftSection: <Users />,
                active: true,
              },
              // Sidebar section with grouped links
              {
                title: "Partner Management",
                leftSection: <Handshake />,
                active: false,
                links: [
                  {
                    label: "Policy plan setup",
                    href: "#/partner/onboarding",
                    leftSection: <Users />,
                  },
                  {
                    label: "Leader setup",
                    href: "#/partner/directory",
                    // leftSection: <Copy />,
                  },
                  {
                    label: "Derivation config",
                    href: "#/partner/reports",
                    leftSection: <ChartPie />,
                  },
                ]
              },
              {
                label: "MPH onboarding",
                href: "#",
                leftSection: <ShieldCheck />,
              },
              // Another section for Reports & Analytics
              {
                title: "Reports & downloads",
                leftSection: <Copy />,
                active: false,
                links: [
                  {
                    label: "New business",
                    href: "#/reports/business",
                    leftSection: <Copy />,
                  },
                  {
                    label: "FR documents",
                    href: "#/reports/fund",
                    leftSection: <ChartPie />,
                  },
                  {
                    label: "MIF documents",
                    href: "#/reports/claims",
                    leftSection: <ShieldCheck />,
                  },
                  {
                    label: "Claims",
                    href: "#/reports/claims",
                    leftSection: <ShieldCheck />,
                  },
                  {
                    label: "FR docs (Claims)",
                    href: "#/reports/claims",
                    leftSection: <WifiNone/>,
                  },
                  {
                    label: "COIs",
                    href: "#/reports/claims",
                    leftSection: <WifiNone />,
                  },
                  {
                    label: "Pre issuance cancellation",
                    href: "#/reports/claims",
                    leftSection: <WifiNone/>,
                  },
                ]
              },
              {
                label: "Fund management",
                href: "#",
                leftSection: <ChartPie />,
              },
              {
                label: "Claims",
                href: "#",
                leftSection: <ShieldCheck />,
              },
              // User Management section
              {
                title: "User Management",
                leftSection: <UserCircleGear />,
                active: false,
                links: [
                  {
                    label: "Manage Users",
                    href: "#/users/manage",
                    leftSection: <UserCircleGear />,
                  },
                  {
                    label: "My Team",
                    href: "#/users/team",
                    leftSection: <UsersThree />,
                  },
                  {
                    label: "User Roles",
                    href: "#/users/roles",
                    leftSection: <Users />,
                  },
                ]
              },
            ]}
          />
        </aside>

        {/* Main Content Area - Responsive padding based on sidebar state */}
        <main
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className={clsx(
            "flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))]",
            "lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))]",
            "duration-300 transition-[padding]",
            isDrawerOpen ? "lg:pr-[calc(var(--gutter)+300px)]" : "lg:pr-[var(--gutter)]"
          )}
        >
          {/* Add your main content here */}
          {children}
        </main>

        {/* Right Drawer - Only render when open */}
        {isDrawerOpen && (
          <aside
            className={clsx(
              "fixed right-0 top-0 bottom-0 pt-[var(--header-height)] z-[2]",
              "bg-white border-l border-gray-200 shadow-lg",
              "transition-all duration-300 w-[300px]",
              "animate-in slide-in-from-right"
            )}
          >
            <div className="h-full w-full overflow-y-auto">
              <CustomDrawer />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
