import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar,
} from "recharts";
import {
  Users, TrendingDown, Activity, LogOut, Sparkles, Target, Award,
  Briefcase, GraduationCap, Brain, Coins, ShieldCheck, Lock, Network, Table as TableIcon,
  Rocket, HeartHandshake, ClipboardList, Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/FilterBar";
import { EmployeeTable } from "@/components/EmployeeTable";
import {
  TalentPipelineTab, InclusionTab,
  SurveyTab, WorkloadTab, TimeTab,
} from "@/components/ExtraTabs";
import { useRole, BU_LIST, BU_HIERARCHY, type BU } from "@/lib/role-context";
import { computeMetrics, EMPLOYEES } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mettus · Integrated Workforce Dashboard" },
      { name: "description", content: "Workforce analytics, skills planning, and rewards differentiation for Mettus." },
    ],
  }),
  component: Dashboard,
});

const PERIOD_START = new Date(2025, 7, 1);
const PERIOD_END = new Date(2026, 7, 31);
const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const { role, managedBU, can } = useRole();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: PERIOD_START, to: PERIOD_END });
  const [selectedBUs, setSelectedBUs] = useState<BU[]>([...BU_LIST]);

  // Force manager scope to single BU
  const effectiveBUs = role === "Manager" ? [managedBU] : selectedBUs;
  const from = dateRange?.from ?? PERIOD_START;
  const to = dateRange?.to ?? PERIOD_END;

  const m = useMemo(
    () => computeMetrics({ bus: effectiveBUs, from, to }),
    [effectiveBUs, from, to]
  );

  // Redirect to login if unauthenticated (in effect to avoid render-time navigation)
  useEffect(() => {
    if (!user) void navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-8">
      <header className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/40 px-6 py-8 shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-5">
            <img
              src="/Mettus  Icon.png"
              alt="Mettus"
              className="h-16 w-16 shrink-0 drop-shadow-lg md:h-20 md:w-20"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Mettus · Integrated Operating Model
              </div>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                Workforce <span className="text-primary">Intelligence</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Analytics · Skills & Workforce Planning · Rewards Differentiation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> {role}
            </Badge>
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); void navigate({ to: "/login" }); }}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <FilterBar
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedBUs={selectedBUs}
        setSelectedBUs={setSelectedBUs}
        onReset={() => {
          setDateRange({ from: PERIOD_START, to: PERIOD_END });
          setSelectedBUs([...BU_LIST]);
        }}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 h-auto flex-wrap gap-1">
          <TabsTrigger value="overview" className="gap-1.5"><Activity className="h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="employees" className="gap-1.5"><TableIcon className="h-4 w-4" /> Employees</TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-1.5"><Network className="h-4 w-4" /> BU Hierarchy</TabsTrigger>
          <TabsTrigger value="talent" className="gap-1.5"><Rocket className="h-4 w-4" /> Talent Pipeline</TabsTrigger>
          <TabsTrigger value="inclusion" className="gap-1.5"><HeartHandshake className="h-4 w-4" /> Inclusion</TabsTrigger>
          <TabsTrigger value="survey" className="gap-1.5"><ClipboardList className="h-4 w-4" /> Employee Survey</TabsTrigger>
          <TabsTrigger value="workload" className="gap-1.5"><Activity className="h-4 w-4" /> Workload</TabsTrigger>
          <TabsTrigger value="time" className="gap-1.5"><Clock className="h-4 w-4" /> Time</TabsTrigger>
          <TabsTrigger value="skills" className="gap-1.5"><Brain className="h-4 w-4" /> Skills</TabsTrigger>
          <TabsTrigger value="rewards" className="gap-1.5"><Coins className="h-4 w-4" /> Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab m={m} months={m.monthsInRange} />
        </TabsContent>
        <TabsContent value="employees">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <CardHeader title="Employee master" subtitle="Searchable, sortable — scoped to selected business units" icon={Users} />
            <EmployeeTable bus={effectiveBUs} />
          </div>
        </TabsContent>
        <TabsContent value="hierarchy"><HierarchyTab activeBUs={effectiveBUs} /></TabsContent>
        <TabsContent value="talent"><TalentPipelineTab /></TabsContent>
        <TabsContent value="inclusion"><InclusionTab /></TabsContent>
        <TabsContent value="survey"><SurveyTab /></TabsContent>
        <TabsContent value="workload"><WorkloadTab /></TabsContent>
        <TabsContent value="time"><TimeTab /></TabsContent>
        <TabsContent value="skills"><SkillsTab /></TabsContent>
        <TabsContent value="rewards">
          <RewardsTab canConfidential={can("viewRewardsConfidential")} canSalary={can("viewSalary")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ───────── Generic UI bits ───────── */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>{children}</div>
  );
}

function CardHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
    </div>
  );
}

function KPI({
  label, value, suffix, icon: Icon, hint, tone,
}: {
  label: string; value: number | string; suffix?: string;
  icon: React.ComponentType<{ className?: string }>; hint?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
}) {
  const toneClasses: Record<string, string> = {
    primary: "text-primary",
    success: "text-[color:var(--success)]",
    warning: "text-[color:var(--warning)]",
    destructive: "text-destructive",
  };
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", tone ? toneClasses[tone] : "text-muted-foreground")} />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold tabular-nums", tone && toneClasses[tone])}>{value}</span>
        {suffix && <span className="text-base text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

/* ───────── Tab 1 · Overview ───────── */

function OverviewTab({ m, months }: { m: ReturnType<typeof computeMetrics>; months: number }) {
  if (m.headcount === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">No employees match the current filters. Adjust BUs or date range.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Headcount" value={m.headcount} icon={Users} tone="primary" hint="Active employees in scope" />
        <KPI label="Turnover %" value={m.turnoverPct} suffix="%" icon={TrendingDown} tone="warning" hint={`Annualised over ${months} mo`} />
        <KPI label="Exits in range" value={m.exits} icon={LogOut} tone="destructive" hint={`${m.exitRate}% exit rate`} />
        <KPI label="Engagement" value={m.engagementScore} suffix="%" icon={Activity} tone="success" hint="Weighted across selected BUs" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Workforce composition" subtitle="By grade" icon={Users} />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={m.composition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {m.composition.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Exits by reason" subtitle={`Scaled to ${months}-month window`} icon={LogOut} />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={m.exitsByReason}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {m.exitsByReason.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Engagement gauge" subtitle="Composite score" icon={Activity} />
          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "Eng", value: m.engagementScore, fill: "var(--chart-1)" }]} startAngle={210} endAngle={-30}>
              <RadialBar background dataKey="value" cornerRadius={10} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground" style={{ fontSize: 32, fontWeight: 700 }}>
                {m.engagementScore}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Business unit breakdown" subtitle="Headcount, exits and engagement per BU in scope" icon={Briefcase} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">Business Unit</th>
                <th className="py-2 font-medium">Headcount</th>
                <th className="py-2 font-medium">Exits</th>
                <th className="py-2 font-medium">Turnover %</th>
                <th className="py-2 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {m.buBreakdown.map((r) => (
                <tr key={r.bu} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{r.bu}</td>
                  <td className="py-2.5 tabular-nums">{r.headcount}</td>
                  <td className="py-2.5 tabular-nums">{r.exits}</td>
                  <td className="py-2.5 tabular-nums">{r.turnover}%</td>
                  <td className="py-2.5 tabular-nums">{r.engagement}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Gender distribution" icon={Users} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={m.gender} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader title="Race distribution" icon={Users} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={m.race} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="var(--chart-3)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ───────── Tab 2 · Skills & Planning ───────── */

function SkillsTab() {
  const pipeline = [
    { role: "AI Developers", planned: 2 },
    { role: "Machine Learning Engineer", planned: 1 },
    { role: "Cybersecurity Specialists", planned: 2 },
    { role: "Data Analysts", planned: 8 },
  ];
  const tiers = [
    { tier: "Tier 1 · Capability Categories", items: ["Technology", "Data & Analytics", "Leadership", "Business Ops", "Client & Delivery", "Risk & Governance"] },
    { tier: "Tier 2 · Skill Groupings", items: ["Cybersecurity", "Cloud Engineering", "Financial Analysis", "Agile Delivery", "Strategic Leadership"] },
    { tier: "Tier 3 · Individual Skills", items: ["Python", "Power BI", "SQL", "Workforce Analytics", "Stakeholder Mgmt", "Project Delivery"] },
  ];
  const proficiency = [
    { level: "Awareness", desc: "Basic understanding" },
    { level: "Foundation", desc: "Routine activities with guidance" },
    { level: "Practitioner", desc: "Applies skills independently" },
    { level: "Advanced", desc: "Applies strategically; mentors others" },
    { level: "Expert", desc: "Recognised subject matter authority" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Unified model" value="1" icon={Target} tone="primary" hint="One operating model" />
        <KPI label="Workforce levers" value="5" icon={Sparkles} tone="success" />
        <KPI label="Demand outlook" value="5-Yr" icon={Brain} tone="warning" />
        <KPI label="Quarterly reviews" value="4x" icon={Activity} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="5-year workforce demand plan" subtitle="Total new demand: 13 roles" icon={GraduationCap} />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipeline} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 11 }} width={170} />
              <Tooltip />
              <Bar dataKey="planned" radius={[0, 6, 6, 0]} fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Capability investment · FY2023/24" icon={Award} />
          <div className="grid grid-cols-2 gap-3">
            <Mini label="Actual spend" value="R1.58M" tone="primary" />
            <Mini label="Excellence prog." value="251" tone="warning" />
          </div>
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Training breakdown</p>
            <div className="grid grid-cols-2 gap-3">
              <Mini label="Inhouse products" value="298" tone="primary" />
              <Mini label="External enrolments" value="75" tone="success" />
              <Mini label="Programme streams" value="5" tone="warning" />
              <Mini label="Compliance coverage" value="100%" tone="success" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Budget R1.5M · Actual R1 575 493.99 — supports digital transformation, leadership readiness and retention.
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Skills taxonomy" subtitle="Three-tier model" icon={Brain} />
        <div className="grid gap-3 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.tier} className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{t.tier}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.items.map((i) => <Badge key={i} variant="secondary">{i}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Proficiency scale" icon={Target} />
        <div className="grid gap-2 md:grid-cols-5">
          {proficiency.map((p, i) => (
            <div key={p.level} className="rounded-lg border p-3">
              <div className="text-xs font-semibold text-primary">Level {i + 1}</div>
              <div className="mt-1 text-sm font-semibold">{p.level}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Workforce planning roadmap" icon={Activity} />
        <ol className="grid gap-3 md:grid-cols-5">
          {["Plan & gather", "Audit execution", "Gap analysis", "Review & feedback", "Train & upskill"].map((step, i) => (
            <li key={step} className="rounded-lg border bg-card p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
              <div className="mt-2 text-sm font-medium">{step}</div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "primary" | "success" | "warning" }) {
  const toneCls: Record<string, string> = {
    primary: "text-primary", success: "text-[color:var(--success)]", warning: "text-[color:var(--warning)]",
  };
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-xl font-bold", tone && toneCls[tone])}>{value}</p>
    </div>
  );
}

/* ───────── Tab 3 · Rewards Differentiation ───────── */

function RewardsTab({ canConfidential, canSalary }: { canConfidential: boolean; canSalary: boolean }) {
  const ratings = [
    { level: "Level 5 · Exceptional", range: "90–100%", color: "var(--chart-1)", count: 8 },
    { level: "Level 4 · High", range: "80–89%", color: "var(--chart-2)", count: 42 },
    { level: "Level 3 · Solid", range: "70–79%", color: "var(--chart-3)", count: 168 },
    { level: "Level 2 · Developing", range: "60–69%", color: "var(--chart-4)", count: 36 },
    { level: "Level 1 · Underperforming", range: "<60%", color: "var(--chart-5)", count: 9 },
  ];
  const categories = [
    { title: "Scarce-Skills Focus", items: ["Company-funded training", "Coaching", "Mentoring sessions"], icon: Brain },
    { title: "Cross-Functional Reward", items: ["Departmental rotation", "Cross-projects alignment", "Team-leader rotation"], icon: Sparkles },
    { title: "Non-Financial Recognition", items: ["Half-day leave", "Internal mailer mentions", "Lunches"], icon: Award },
    { title: "Bonus & Financial Reward", items: ["Bonuses", "Excursions", "Funded lunches"], icon: Coins },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Employees" value={298} icon={Users} tone="primary" />
        <KPI label="Departments" value={41} icon={Briefcase} tone="success" />
        <KPI label="Managers" value={39} icon={ShieldCheck} tone="warning" />
        <KPI label="SLT members" value={16} icon={Target} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Performance rating distribution" subtitle="FY2025/26 calibration outcome" icon={Activity} />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ratings}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="level" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {ratings.map((r, i) => <Cell key={i} fill={r.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader title="Performance rubric" icon={Target} />
          <ul className="space-y-2 text-sm">
            {ratings.map((r) => (
              <li key={r.level} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="font-medium">{r.level}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.range}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Four contribution categories" subtitle="Aligning performance, capability and reward" icon={Award} />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <div key={c.title} className="rounded-lg border bg-muted/30 p-4">
              <c.icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold">{c.title}</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {c.items.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {canSalary ? (
        <Card>
          <CardHeader title="Scarce-skills premium · critical roles" subtitle="Confidential — HR & Executive" icon={Coins} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Market premium</th>
                  <th className="py-2 font-medium">Sign-on bonus</th>
                  <th className="py-2 font-medium">Accelerated increment</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { r: "Data Scientist", p: "Up to 5% above market median", b: "R5 000 – R15 000", i: "Two-step on High or Exceptional" },
                  { r: "Data Engineer", p: "Up to 5% above market median", b: "R5 000 – R15 000", i: "Two-step on High or Exceptional" },
                  { r: "Cybersecurity Specialist", p: "Up to 7% above market median", b: "R8 000 – R20 000", i: "Two-step on consecutive Exceptional" },
                ].map((x) => (
                  <tr key={x.r} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{x.r}</td>
                    <td className="py-2.5">{x.p}</td>
                    <td className="py-2.5">{x.b}</td>
                    <td className="py-2.5">{x.i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <LockedCard message="Scarce-skills premium tables are restricted to HR and Executive roles." />
      )}

      {canConfidential ? (
        <Card>
          <CardHeader title="Reward equity & fairness audit" subtitle="Annual HR-led review" icon={ShieldCheck} />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs font-semibold uppercase text-primary">Reviewed</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>· Performance rating distribution</li>
                <li>· Salary increase outcomes</li>
                <li>· Bonus allocation</li>
                <li>· Scarce-skills premiums</li>
                <li>· Promotion-related decisions</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs font-semibold uppercase text-primary">Identifies</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>· Disproportionate allocation</li>
                <li>· Manager bias</li>
                <li>· Inconsistent differentiation</li>
                <li>· Demographic disparities</li>
              </ul>
            </div>
          </div>
        </Card>
      ) : (
        <LockedCard message="Equity & fairness audit is visible to HR and Executive roles only." />
      )}
    </div>
  );
}

function LockedCard({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Lock className="h-5 w-5" />
        <p className="text-sm">{message}</p>
      </div>
    </Card>
  );
}

/* ───────── Tab · BU Hierarchy ───────── */

function HierarchyTab({ activeBUs }: { activeBUs: BU[] }) {
  const counts: Record<string, number> = {};
  for (const e of EMPLOYEES) counts[`${e.bu}::${e.subBU}`] = (counts[`${e.bu}::${e.subBU}`] ?? 0) + 1;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Business unit hierarchy" subtitle="Two-tier nested model · Group → Department" icon={Network} />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {BU_LIST.map((bu) => {
            const subs = BU_HIERARCHY[bu];
            const total = subs.reduce((s, d) => s + (counts[`${bu}::${d}`] ?? 0), 0);
            const inScope = activeBUs.includes(bu);
            return (
              <div key={bu} className={cn("rounded-lg border p-4 transition", inScope ? "border-primary/40 bg-primary/5" : "opacity-60")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{bu}</span>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">{total}</Badge>
                </div>
                <ul className="mt-3 space-y-1.5 border-l pl-3">
                  {subs.map((d) => (
                    <li key={d} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">· {d}</span>
                      <span className="tabular-nums text-xs text-muted-foreground">{counts[`${bu}::${d}`] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
