import type React from "react";
import { useState, useEffect } from "react";
import { ChevronRight, DollarSign, Home, Settings, Menu, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { cn } from "../../lib/utils";
import Head from "next/head";
import firebase from "../../firebase"; 
import { useAuthState } from "react-firebase-hooks/auth";
import type { User } from "firebase/auth";

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, loading ] = useAuthState(firebase.auth);
  const router = useRouter();
  const pathname = router.pathname; 
  const _title = pathname.split("/")?.slice(-1)?.[0]?.replace(/-/g, " ") ?? "Dashboard";
  const titleWithCapitalization = _title.charAt(0).toUpperCase() + _title.slice(1);  
  const [isMobile, setMobile] = useState(false); 

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 1024); 
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 

  return (
    <>
      <Head>
        <title>{titleWithCapitalization ?? "Dashboard"}</title> 
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={
        cn(
          "flex bg-[#f2f4f6]",
          isMobile ? "h-full" : "'"
        )
      }>
        {user && <Sidebar user={user} selected={pathname} loading={loading} /> }
        <div className={cn("flex-1 transition-all bg-[#f2f4f6] lg:ml-0", isMobile ? "mt-16" : "")}>{children}</div>
      </div>
    </>
  );
};

const Sidebar: React.FC<{ user: User | null | undefined; selected: string; loading: boolean }> = ({ user, selected, loading }) => {
  const [open, setOpen] = useState(false);  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setOpen(true);  
      } else {
        setOpen(false);  
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && open) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, open]);

  return (
    <> 
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md border border-slate-300"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
 
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
 
      <motion.nav
        id="sidebar"
        layout
        initial={isMobile ? { x: -300 } : false}
        animate={isMobile ? { x: open ? 0 : -300 } : {}}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          ${isMobile ? "fixed" : "sticky"} 
          top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 z-50
          ${isMobile ? "w-64" : ""}
        `}
        style={
          !isMobile
            ? {
              width: open ? "225px" : "fit-content",
            }
            : {}
        }
      > 
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-slate-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <TitleSection open={open} user={user} loading={loading} />

        <div className="space-y-1">
          <Option
            Icon={Home}
            title="Dashboard"
            selected={selected === "/dashboard"}
            href="/dashboard"
            open={open}
            onSelect={() => isMobile && setOpen(false)}
          />
          <Option
            Icon={DollarSign}
            title="Billing"
            selected={selected === "/dashboard/billing"}
            href="/dashboard/billing"
            open={open}
            onSelect={() => isMobile && setOpen(false)}
          />
          <Option
            Icon={Settings}
            title="Settings"
            selected={selected === "/dashboard/settings"}
            href="/dashboard/settings"
            open={open}
            onSelect={() => isMobile && setOpen(false)}
          />
        </div>

        {!isMobile && <ToggleClose open={open} setOpen={setOpen} />}
      </motion.nav>
    </>
  );
};

const Option: React.FC<{
  Icon: React.ElementType
  title: string
  selected: boolean
  href: string
  open: boolean
  onSelect?: () => void
  notifs?: number
}> = ({ Icon, title, selected, href, open, onSelect, notifs }) => {
  const router = useRouter();

  const handleClick = async () => {
    await router.push(href);
    onSelect?.();
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer ${
        selected ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        <Icon className="h-5 w-5" />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white flex items-center justify-center"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection: React.FC<{ open: boolean; user: User | null | undefined; loading: boolean }> = ({ open, user, loading }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="block text-xs font-semibold">{user?.displayName ?? "SeeTicket"}</span>
                  <span className="block text-xs text-slate-500">{user?.email}</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div layout className="grid size-10 shrink-0 place-content-center rounded-md bg-black">
      <img src="/brew.png" alt="Logo" className="h-10 w-10 rounded-md" />
    </motion.div>
  );
};

const ToggleClose: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100 cursor-pointer"
    >
      <div className="flex items-center p-2">
        <motion.div layout className="grid size-10 place-content-center text-lg">
          <ChevronRight className={`h-5 w-5 transition-transform ${open && "rotate-180"}`} />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default Layout;
