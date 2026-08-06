"use client";

import React, { createContext, useContext } from "react";

/** When true (admin panel), GlowCard skips mouse tilt / spotlight motion */
const AdminStaticCardsContext = createContext(false);

export function AdminStaticCardsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStaticCardsContext.Provider value={true}>
      {children}
    </AdminStaticCardsContext.Provider>
  );
}

export function useAdminStaticCards() {
  return useContext(AdminStaticCardsContext);
}
