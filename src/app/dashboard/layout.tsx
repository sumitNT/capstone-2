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
  Eye,
  Handshake,
  ShieldCheck,
  UploadSimple,
  User,
  UserCircleGear,
  UserCirclePlus,
  Users,
  UsersThree,
  WifiNone,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useCallback, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// import AvatarImage from "../../../assets/avatar.png";
// import AvatarImage from "../../../assets/avatar.png";
import HLIInspireLogo from "../../../assets/templates/logos/HLI_Inspire_Logo.svg";
import { PartnerProvider } from "../../context/partners";
import { DrawerProvider, useDrawerContext } from "../../context/drawerContext";
import { usePartnerContext } from "../../context/partners";

export default function DashboardBase({ children }) {
  return (
    <DrawerProvider>
      <PartnerProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </PartnerProvider>
    </DrawerProvider>
  );
}

function DashboardLayout({ children }) {
  // Single state for sidebar toggle
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const { isDrawerOpen } = useDrawerContext();
  const { activePartnerId, activeConfig, isUploading, firstRawLoaderFile, rawLoaderFile, handleQuickSubmit } = usePartnerContext();


  // Fix hydration issues
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Memoized toggle handler
  const handleSidebarToggle = useCallback((pressed: boolean) => {
    setSidebarOpen(pressed);
  }, []);



  // Memoized sidebar items to prevent re-creation
  const sidebarItems = useCallback(() => [
    // New business dropdown section
    {
      title: "New business",
      leftSection: <Users />,
      active: isHydrated ? pathname?.includes("/new-business") : false,
      links: [
        {
          label: "Register partner",
          href: "/dashboard/new-business/register-partner",
          leftSection: <UserCirclePlus />,
          active: isHydrated ? pathname === "/dashboard/new-business/register-partner" : false,
        },
        {
          label: "View Partner",
          href: "/dashboard/new-business/view-partner",
          leftSection: <Eye />,
          active: isHydrated ? pathname?.includes("/dashboard/new-business/view-partner") : false,
        },
      ]
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
          label: "Loader setup",
          href: "#/partner/directory",
          leftSection: <Copy />,
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
          leftSection: <WifiNone />,
        },
        {
          label: "COIs",
          href: "#/reports/claims",
          leftSection: <WifiNone />,
        },
        {
          label: "Pre issuance cancellation",
          href: "#/reports/claims",
          leftSection: <WifiNone />,
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
  ], [isHydrated, pathname]);

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
              Test User
            </Text>
            <Text size="sm">Key Account Manager</Text>
            <Caption className="italic">
              Last login : 03/09/2024 12:21 pm
            </Caption>
          </div>
          <Avatar variant="outline" src="/assets/avatar.png" suppressHydrationWarning />
        </div>
      </Header>

      <div className="lg:flex flex-1">
        {/* Sidebar - Hidden on mobile, flexible width on desktop */}
        <aside
          key="sidebar"
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="hidden lg:flex z-[1] flex-col fixed transition-all bottom-0 top-0 pt-[var(--header-height)] left-0"
        >
          <CollapsibleSidebar
            key={`sidebar-${isHydrated}`}
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
                    label: "Partner registration",
                    href: "/dashboard/new-business/register-partner",
                    leftSection: <UserCirclePlus />,
                  },
                  {
                    label: "Policy plan setup",
                    href: "#/partner/onboarding",
                    leftSection: <Users />,
                  },
                  {
                    label: "View Partner",
                    href: "/dashboard/new-business/view-partner",
                    leftSection: <Eye />,
                    //active: isHydrated ? pathname?.includes("/dashboard/new-business/view-partner") : false,
                  },
                  {
                    label: "Leader setup",
                    href: "#/partner/directory",
                    leftSection: <Copy />,
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
                    leftSection: <User />,
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
                    leftSection: <WifiNone />,
                  },
                  {
                    label: "COIs",
                    href: "#/reports/claims",
                    leftSection: <WifiNone />,
                  },
                  {
                    label: "Pre issuance cancellation",
                    href: "#/reports/claims",
                    leftSection: <WifiNone />,
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

          {/* Fixed Red Submit Button - Top Right Corner */}
          <div className="fixed top-[calc(var(--header-height)+16px)] right-1 z-[4] group">
            <button
              type="button"
              disabled={(() => {
                const hasFirstRawLoader = !!firstRawLoaderFile;
                const hasRawLoader = !!rawLoaderFile;
                const currentFile = firstRawLoaderFile || rawLoaderFile;

                if (!activePartnerId || !currentFile) return true;

                // firstRawLoader: only needs partner + file
                if (hasFirstRawLoader) return false;

                // rawLoader: needs partner + config + file  
                if (hasRawLoader) return !activeConfig;

                return true;
              })()}
              className={clsx(
                "shadow-lg hover:shadow-xl rounded-[8px] w-[30px] h-[30px] flex items-center justify-center transition-all duration-200 border-0",
                (() => {
                  const hasFirstRawLoader = !!firstRawLoaderFile;
                  const hasRawLoader = !!rawLoaderFile;
                  const currentFile = firstRawLoaderFile || rawLoaderFile;

                  if (!activePartnerId || !currentFile) return "bg-gray-400 cursor-not-allowed";
                  if (hasFirstRawLoader) return "bg-red-500 hover:bg-red-600 cursor-pointer";
                  if (hasRawLoader && activeConfig) return "bg-red-500 hover:bg-red-600 cursor-pointer";

                  return "bg-gray-400 cursor-not-allowed";
                })()
              )}
              aria-label={isUploading ? "Uploading..." : "Submit Upload"}
              title={(() => {
                const hasFirstRawLoader = !!firstRawLoaderFile;
                const hasRawLoader = !!rawLoaderFile;
                const currentFile = firstRawLoaderFile || rawLoaderFile;

                if (isUploading) return "Uploading...";
                if (!activePartnerId) return "Please select a partner first";
                if (!currentFile) return "Please upload a file using firstRawLoader or RawLoader";

                if (hasFirstRawLoader) {
                  return `Submit ${currentFile.name} (firstRawLoader)`;
                }

                if (hasRawLoader) {
                  if (!activeConfig) return "Please select a loader configuration from the table";
                  return `Submit ${currentFile.name} (rawLoader) with ${activeConfig.configName}`;
                }

                return "Please upload a file";
              })()}
              onClick={handleQuickSubmit}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <UploadSimple size={20} className="text-white" />
              )}
            </button>



          </div>

        </main>
      </div>
    </div>
  );
}
