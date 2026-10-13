"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: React.ReactNode; disabled: boolean };

type Props = {
  children: React.ReactNode;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  className?: string;
  fullWidth?: boolean;
  id?: string;
  "aria-label"?: string;
  disabled?: boolean;
  required?: boolean;
};

export function StyledSelect({
  children,
  value,
  onChange,
  className = "",
  fullWidth = false,
  id,
  "aria-label": ariaLabel,
  disabled = false,
}: Props) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState({ top: 0, left: 0, width: 0, maxHeight: 240 });

  const options: Option[] = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>> =>
      React.isValidElement(child) && child.type === "option",
    )
    .map((child) => ({
      value: String(child.props.value ?? ""),
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  useLayoutEffect(() => {
    if (!open) return;
    const positionMenu = () => {
      const anchor = triggerRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const menuWidth = Math.min(Math.max(anchor.width, 200), window.innerWidth - 24);
      const spaceBelow = window.innerHeight - anchor.bottom - 12;
      const maxHeight = Math.min(256, Math.max(120, spaceBelow - 8));
      setPlacement({
        top: anchor.bottom + 6,
        left: Math.max(12, Math.min(anchor.left, window.innerWidth - menuWidth - 12)),
        width: menuWidth,
        maxHeight,
      });
    };
    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: PointerEvent) => {
      if (!triggerRef.current?.contains(event.target as Node) &&
          !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, listId, open]);

  const choose = (option?: Option) => {
    if (!option || option.disabled) return;
    onChange({ target: { value: option.value } });
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveActive = (direction: number) => {
    if (!options.length) return;
    let next = open ? activeIndex : selectedIndex;
    for (let count = 0; count < options.length; count += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next].disabled) {
        setActiveIndex(next);
        setOpen(true);
        return;
      }
    }
  };

  return (
    <span className={`inline-block max-w-full align-middle ${fullWidth ? "w-full" : ""}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => {
          setActiveIndex(Math.max(0, selectedIndex));
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Enter" || event.key === " ") {
            if (open) {
              event.preventDefault();
              choose(options[activeIndex]);
            }
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
          } else if (event.key === "Tab" && open) {
            setOpen(false);
          } else if (event.key === "Home" && open) {
            event.preventDefault();
            setActiveIndex(0);
          } else if (event.key === "End" && open) {
            event.preventDefault();
            setActiveIndex(options.length - 1);
          }
        }}
        className={`inline-flex items-center justify-between gap-2 text-left font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:opacity-50 ${className}`}
      >
        <span className="min-w-0 truncate">{selected?.label ?? value}</span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 opacity-65 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          onMouseDown={(event) => event.stopPropagation()}
          style={{ position: "fixed", top: placement.top, left: placement.left, width: placement.width, maxHeight: placement.maxHeight }}
          className="z-[100] overflow-y-auto rounded-xl border border-zinc-700 bg-[#37373A] p-1.5 font-sans text-zinc-100 shadow-xl shadow-black/25"
        >
          {options.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              id={`${listId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              disabled={option.disabled}
              tabIndex={-1}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors disabled:opacity-40 ${
                option.value === value
                  ? "bg-white font-semibold text-zinc-900"
                  : index === activeIndex
                    ? "bg-white/[0.14] text-white"
                    : "text-zinc-200 hover:bg-white/[0.1] hover:text-white"
              }`}
            >
              <span className="min-w-0 truncate">{option.label}</span>
              {option.value === value && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </span>
  );
}
