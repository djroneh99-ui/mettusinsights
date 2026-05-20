import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "HR" | "Executive" | "Manager";
export const BU_LIST = ["Operations", "Technology", "Commercial", "Corporate", "Support"] as const;
export type BU = (typeof BU_LIST)[number];

export const BU_HIERARCHY: Record<BU, string[]> = {
  Operations: ["Call Centre", "Verifications", "Risk & Quality", "Client Support"],
  Technology: ["Data & Analytics", "Engineering", "Business Analysis"],
  Commercial: ["Sales", "Credit & Collections", "Client Success"],
  Corporate: ["HR", "Finance", "Legal & Compliance", "Administration"],
  Support: ["Shared Services"],
};

type RoleCtx = {
  role: Role;
  setRole: (r: Role) => void;
  managedBU: BU;
  setManagedBU: (b: BU) => void;
  can: (action: "viewAllBUs" | "viewSalary" | "viewRewardsConfidential" | "editFilters") => boolean;
};

const Ctx = createContext<RoleCtx | null>(null);

type Props = {
  children: ReactNode;
  initialRole?: Role;
  initialManagedBU?: BU | null;
};

export function RoleProvider({ children, initialRole = "HR", initialManagedBU }: Props) {
  const [role, setRole] = useState<Role>(initialRole);
  const [managedBU, setManagedBU] = useState<BU>(initialManagedBU ?? "Technology");

  const can: RoleCtx["can"] = (action) => {
    if (role === "HR") return true;
    if (role === "Executive") {
      return action === "viewAllBUs" || action === "viewSalary" || action === "viewRewardsConfidential";
    }
    // Manager
    return false;
  };

  return <Ctx.Provider value={{ role, setRole, managedBU, setManagedBU, can }}>{children}</Ctx.Provider>;
}

export function useRole() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRole outside provider");
  return c;
}
