"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  labels: Record<string, React.ReactNode>;
  registerLabel: (val: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({});

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newVal: string) => {
      if (value === undefined) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
      setOpen(false);
    },
    [value, onValueChange]
  );

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        labels,
        registerLabel,
      }}
    >
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ctx?.setOpen((prev) => !prev)}
      className={cn(
        "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs text-zinc-900 shadow-xs transition-colors hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-[#18181D] dark:text-zinc-100 dark:hover:bg-white/[0.04]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn(
        "h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform duration-200",
        ctx?.open && "rotate-180"
      )} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  const display = (ctx?.value && ctx.labels[ctx.value]) || ctx?.value || placeholder;
  return <span className="truncate">{display}</span>;
}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-1 text-zinc-900 shadow-lg dark:border-white/[0.08] dark:bg-[#18181D] dark:text-zinc-100 animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  const isSelected = ctx?.value === value;

  React.useEffect(() => {
    ctx?.registerLabel(value, children);
  }, [ctx, value, children]);

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      onClick={() => ctx?.onValueChange?.(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none transition-colors",
        isSelected
          ? "bg-zinc-100 text-zinc-900 dark:bg-white/[0.08] dark:text-white"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.04] dark:hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

