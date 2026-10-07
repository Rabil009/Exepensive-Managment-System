import { Link } from "react-router";
import { AuraIcon } from "../components/AuraIcon";
import { navigation } from "./navigation";
export function Sidebar({ active }: { active: string }) {
  return (
    <aside
      id="aura-sidebar"
      aria-label="Main navigation"
      className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 z-50 flex flex-col justify-between select-none"
    >
      <div>
        <Link
          to="/employee/dashboard"
          aria-label="Aura overview"
          title="Aura overview"
          className="aura-brand h-16 px-space-lg flex items-center gap-space-sm border-b border-outline-variant/20"
        >
          <span className="w-8 h-8 rounded-lg bg-[#1e2022] flex items-center justify-center text-white shrink-0 shadow-sm">
            <AuraIcon className="text-lg">umbrella</AuraIcon>
          </span>
          <span className="aura-brand-name font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface ml-1">
            Aura
          </span>
          <span className="aura-brand-tier ml-auto bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant text-[10px] uppercase tracking-wider font-semibold">
            Enterprise
          </span>
        </Link>
        <div className="pt-space-lg px-space-sm">
          <p className="aura-nav-heading px-space-md mb-space-xs font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
            Governance
          </p>
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                aria-label={item.label}
                title={item.label}
                aria-current={active === item.label ? "page" : undefined}
                className={`flex items-center gap-space-md px-space-md py-2 rounded-lg transition-colors ${active === item.label ? "bg-primary-container text-on-primary-container font-headline-sm shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-body-md text-body-md"}`}
              >
                <AuraIcon className="text-lg">{item.icon}</AuraIcon>
                <span className="aura-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="aura-sidebar-footer p-space-md border-t border-outline-variant/20 bg-surface-container-lowest/50">
        <div className="flex items-center gap-space-md p-space-xs">
          <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-xs font-semibold flex items-center justify-center shrink-0">
            RK
          </span>
          <div className="aura-profile-details flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <strong className="truncate font-headline-sm text-headline-sm">
                Rabil Khan
              </strong>
              <AuraIcon className="text-base text-on-surface-variant">
                more_vert
              </AuraIcon>
            </div>
            <span className="text-body-sm text-on-surface-variant">
              Executive Member
            </span>
          </div>
        </div>
        <div className="aura-profile-status mt-space-xs flex items-center justify-between px-space-xs text-label-caps">
          <span className="inline-flex items-center gap-1 text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            Active · FY25
          </span>
          <span className="text-on-surface-variant">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
}
