"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/brand", label: "Brand" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/suggestions", label: "Suggestions" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-5 bg-gray-600 transition-all duration-200 ${
            open ? "translate-y-[3px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-gray-600 transition-all duration-200 mt-1 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-gray-600 transition-all duration-200 mt-1 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="flex flex-col py-2 px-4">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="py-3 px-3 border-t border-gray-100 mt-1">
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
