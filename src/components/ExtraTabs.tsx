import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, Cell, PieChart, Pie,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Rocket, Users, HeartHandshake, ClipboardList, Clock,
  TrendingUp, AlertTriangle, CheckCircle2, Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* shared */
const CHART = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>{children}</div>;
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
function KPI({ label, value, suffix, hint, tone = "primary" }: { label: string; value: string | number; suffix?: string; hint?: string; tone?: "primary" | "success" | "warning" | "destructive" }) {
  const t: Record<string, string> = {
    primary: "text-primary",
    success: "text-[color:var(--success)]",
    warning: "text-[color:var(--warning)]",
    destructive: "text-destructive",
  };
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold tabular-nums", t[tone])}>{value}</span>
        {suffix && <span className="text-base text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

/* ───────── Talent Pipeline · critical roles ───────── */

export function TalentPipelineTab() {
  const roles = [
    { role: "Data Scientist", open: 2, candidates: 14, stage: 78, urgency: "High" },
    { role: "ML Engineer", open: 1, candidates: 9, stage: 60, urgency: "High" },
    { role: "Cybersecurity Lead", open: 2, candidates: 11, stage: 45, urgency: "Critical" },
    { role: "Cloud Architect", open: 1, candidates: 6, stage: 30, urgency: "Medium" },
    { role: "Data Analyst", open: 8, candidates: 38, stage: 82, urgency: "High" },
    { role: "Risk & Quality Lead", open: 1, candidates: 5, stage: 50, urgency: "Medium" },
  ];
  const funnel = [
    { stage: "Sourced", n: 312 },
    { stage: "Screened", n: 184 },
    { stage: "Interview", n: 92 },
    { stage: "Assessment", n: 48 },
    { stage: "Offer", n: 21 },
    { stage: "Hired", n: 13 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Critical roles open" value={15} tone="warning" hint="Across 6 role families" />
        <KPI label="Active candidates" value={83} tone="primary" />
        <KPI label="Time-to-hire" value={5} suffix="d" tone="success" hint="Target: 45 days" />
        <KPI label="Offer acceptance" value={86} suffix="%" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Live pipeline by role" subtitle="Stage progress across critical hires" icon={Rocket} />
          <div className="space-y-3">
            {roles.map((r) => (
              <div key={r.role} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{r.role}</p>
                    <p className="text-xs text-muted-foreground">{r.open} open · {r.candidates} candidates</p>
                  </div>
                  <Badge variant={r.urgency === "Critical" ? "destructive" : r.urgency === "High" ? "default" : "secondary"}>{r.urgency}</Badge>
                </div>
                <Progress value={r.stage} className="mt-2 h-2" />
                <p className="mt-1 text-right text-xs text-muted-foreground">{r.stage}% through pipeline</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Hiring funnel" subtitle="Quarter to date" icon={Target} />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="n" radius={[0, 6, 6, 0]}>
                {funnel.map((_, i) => <Cell key={i} fill={CHART[i % CHART.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <RealtimePipelineKPI />
    </div>
  );
}

function RealtimePipelineKPI() {
  const kpis = [
    { label: "Skills Coverage", value: "78%", hint: "Target 90%", bg: "bg-teal-600" },
    { label: "Competency Depth", value: "3.6/5", hint: "Target 4.2", bg: "bg-blue-600" },
    { label: "Ready Now Successors", value: "15", hint: "Across 9 critical roles", bg: "bg-slate-800" },
    { label: "Pipeline Engagement", value: "81%", hint: "Target 85%", bg: "bg-purple-600" },
    { label: "Diversity Representation", value: "42%", hint: "Target 50%", bg: "bg-orange-500" },
  ];
  const health = [
    { role: "Data Analytics", ready: 1, mid: 3, long: 1 },
    { role: "Operations", ready: 2, mid: 2, long: 1 },
    { role: "HR", ready: 2, mid: 1, long: 1 },
    { role: "Sales", ready: 2, mid: 1, long: 1 },
    { role: "Finance", ready: 2, mid: 1, long: 1 },
    { role: "Agile Leadership", ready: 2, mid: 2, long: 1 },
    { role: "AI Engineering", ready: 1, mid: 2, long: 1 },
    { role: "Data Science", ready: 1, mid: 2, long: 1 },
    { role: "Leadership", ready: 2, mid: 3, long: 1 },
  ];
  const readinessMix = [
    { name: "Ready Now", value: 35, fill: "#14b8a6" },
    { name: "1-2 Yrs", value: 42, fill: "#2563eb" },
    { name: "3+ Yrs", value: 23, fill: "#94a3b8" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Real-time pipeline KPI dashboard</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={cn("rounded-xl p-4 text-white shadow-sm", k.bg)}>
            <p className="text-xs font-semibold">{k.label}</p>
            <p className="mt-3 text-3xl font-bold">{k.value}</p>
            <p className="mt-3 text-xs italic opacity-90">{k.hint}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Pipeline Health by Critical Role" subtitle="Ready Now · 1-2 Yrs · 3+ Yrs" icon={AlertTriangle} />
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={health} layout="vertical" stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ready" stackId="a" name="Ready Now" fill="#14b8a6" />
              <Bar dataKey="mid" stackId="a" name="1-2 Yrs" fill="#2563eb" />
              <Bar dataKey="long" stackId="a" name="3+ Yrs" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader title="Overall Readiness Mix" subtitle="Distribution across horizons" icon={Target} />
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={readinessMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label={(e) => `${e.value}%`} />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ───────── Inclusion Measurement ───────── */

export function InclusionTab() {
  const dimensions = [
    { dim: "Belonging", score: 72, prev: 70 },
    { dim: "Respect", score: 68, prev: 67 },
    { dim: "Voice", score: 61, prev: 64 },
    { dim: "Fair Practices", score: 65, prev: 64 },
    { dim: "Psych. Safety", score: 58, prev: 56 },
    { dim: "Growth", score: 63, prev: 60 },
  ];
  const groups = [
    { group: "All Employees", Belong: 72, Respect: 68, Voice: 61, Fair: 65, Safety: 58, Growth: 63 },
    { group: "Female", Belong: 70, Respect: 64, Voice: 58, Fair: 60, Safety: 54, Growth: 59 },
    { group: "Male", Belong: 74, Respect: 72, Voice: 65, Fair: 70, Safety: 63, Growth: 68 },
    { group: "African", Belong: 68, Respect: 63, Voice: 57, Fair: 60, Safety: 53, Growth: 58 },
    { group: "White", Belong: 79, Respect: 76, Voice: 72, Fair: 76, Safety: 71, Growth: 74 },
    { group: "Technical", Belong: 68, Respect: 64, Voice: 57, Fair: 61, Safety: 54, Growth: 59 },
    { group: "Top Management", Belong: 82, Respect: 80, Voice: 78, Fair: 79, Safety: 75, Growth: 80 },
  ];
  const gaps = [
    { area: "Psychological Safety", pair: "African vs White", gap: 18, status: "Highest risk" },
    { area: "Growth & Development", pair: "Technical vs Top Mgmt", gap: 21, status: "Largest gap" },
    { area: "Fair People Practices", pair: "Female vs Male", gap: 10, status: "Equity gap" },
    { area: "Voice & Participation", pair: "Age 51–65 vs Avg", gap: 6, status: "Declining" },
  ];
  const actions = [
    { dim: "Psych. Safety", action: "Anonymous reporting channels", owner: "HR & DEI", due: "Q2 2026" },
    { dim: "Psych. Safety", action: "Manager training mandatory", owner: "L&D / HR", due: "Q2 2026" },
    { dim: "Fair Practices", action: "Pay equity & promotion audits", owner: "HR Analytics", due: "Q2 2026" },
    { dim: "Growth", action: "Expand technical mentorship", owner: "L&D / HR", due: "Q3 2026" },
    { dim: "Voice", action: "Forums for 51–65 cohort", owner: "HR / Managers", due: "Q3 2026" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Overall I&B score" value={64} suffix="/100" tone="warning" hint="Developing stage" />
        <KPI label="Response rate" value={78} suffix="%" tone="success" hint="232 of 298" />
        <KPI label="Widest gap" value={21} suffix="pts" tone="destructive" hint="Technical vs Top Mgmt" />
        <KPI label="Target" value="75+" tone="primary" hint="All dimensions by Q4 2026" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Six dimensions · Q1 2026 vs Q4 2025" icon={HeartHandshake} />
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={dimensions}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[40, 90]} tick={{ fontSize: 10 }} />
              <Radar name="Q1 2026" dataKey="score" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.4} />
              <Radar name="Q4 2025" dataKey="prev" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader title="Critical disparities" subtitle="Gaps ≥15 pts trigger action plan" icon={AlertTriangle} />
          <ul className="space-y-2">
            {gaps.map((g) => (
              <li key={g.area} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-semibold">{g.area}</p>
                  <p className="text-xs text-muted-foreground">{g.pair} · {g.status}</p>
                </div>
                <span className={cn("text-xl font-bold tabular-nums", g.gap >= 15 ? "text-destructive" : "text-[color:var(--warning)]")}>{g.gap}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Heat map · scores across demographic groups" icon={Users} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Group</th>
                {["Belong", "Respect", "Voice", "Fair", "Safety", "Growth"].map((k) => <th key={k} className="py-2">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {groups.map((row) => (
                <tr key={row.group} className="border-b last:border-0">
                  <td className="py-2 font-medium">{row.group}</td>
                  {(["Belong", "Respect", "Voice", "Fair", "Safety", "Growth"] as const).map((k) => {
                    const v = row[k];
                    const tone = v >= 75 ? "bg-[color:var(--success)]/20 text-[color:var(--success)]"
                      : v >= 60 ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                      : "bg-destructive/15 text-destructive";
                    return <td key={k} className="py-2 pr-2"><span className={cn("inline-flex w-12 justify-center rounded-md px-2 py-1 text-xs font-semibold tabular-nums", tone)}>{v}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Improvement action plan" subtitle="Owners and deadlines per gap" icon={CheckCircle2} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Dimension</th><th className="py-2">Action</th><th className="py-2">Owner</th><th className="py-2">Deadline</th></tr>
            </thead>
            <tbody>
              {actions.map((a, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{a.dim}</td>
                  <td className="py-2.5">{a.action}</td>
                  <td className="py-2.5 text-muted-foreground">{a.owner}</td>
                  <td className="py-2.5"><Badge variant="secondary">{a.due}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────── Employee Survey · Engagement Index ───────── */

export function SurveyTab() {
  const questions = [
    { q: "I feel valued as an employee", fav: 231, unfav: 32, neu: 35, score: 87.8 },
    { q: "Leadership listens to employee concerns", fav: 234, unfav: 19, neu: 45, score: 92.5 },
    { q: "I understand the company's vision and goals", fav: 222, unfav: 29, neu: 47, score: 88.4 },
    { q: "Work schedule supports work-life balance", fav: 226, unfav: 28, neu: 42, score: 89.0 },
    { q: "I feel motivated to do my best work", fav: 214, unfav: 40, neu: 44, score: 84.3 },
    { q: "Likely to recommend as a place to work", fav: 227, unfav: 25, neu: 46, score: 90.1 },
  ];
  const trend = [
    { p: "Q2 24", s: 82.1 }, { p: "Q3 24", s: 83.4 }, { p: "Q4 24", s: 85.9 },
    { p: "Q1 25", s: 86.7 }, { p: "Q2 25", s: 87.3 }, { p: "Q3 25", s: 88.7 },
  ];
  const stacked = questions.map((q) => ({ name: q.q.split(" ").slice(0, 3).join(" "), Favorable: q.fav, Neutral: q.neu, Unfavorable: q.unfav }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPI label="Engagement index" value={83} suffix="%" tone="success" hint="Survey 2025–2026" />
        <KPI label="Responses" value={298} tone="primary" />
        <KPI label="Favorable" value={247} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Score by question" subtitle="% favorable ÷ (favorable + unfavorable)" icon={ClipboardList} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={questions} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="q" tick={{ fontSize: 10 }} width={180} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader title="Engagement trend" subtitle="Last six quarters" icon={TrendingUp} />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="p" tick={{ fontSize: 11 }} />
              <YAxis domain={[78, 92]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="s" stroke="var(--chart-1)" fill="url(#eg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Response distribution" subtitle="Favorable · Neutral · Unfavorable per question" icon={ClipboardList} />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stacked}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Favorable" stackId="a" fill="var(--chart-1)" />
            <Bar dataKey="Neutral" stackId="a" fill="var(--chart-3)" />
            <Bar dataKey="Unfavorable" stackId="a" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ───────── Workload Management ───────── */

export function WorkloadTab() {
  const buLoad = [
    { bu: "Operations", capacity: 100, utilised: 92 },
    { bu: "Technology", capacity: 100, utilised: 104 },
    { bu: "Commercial", capacity: 100, utilised: 88 },
    { bu: "Corporate", capacity: 100, utilised: 76 },
    { bu: "Support", capacity: 100, utilised: 81 },
  ];
  const skillsCoverage = [
    { skill: "Data & Analytics", coverage: 72, target: 90 },
    { skill: "Cloud & Infra", coverage: 64, target: 85 },
    { skill: "Cybersecurity", coverage: 48, target: 80 },
    { skill: "AI / ML", coverage: 55, target: 80 },
    { skill: "Risk & Quality", coverage: 81, target: 85 },
    { skill: "Client Success", coverage: 88, target: 90 },
  ];
  const pipelineEngagement = [
    { m: "Oct", active: 58, responsive: 41, dropouts: 6 },
    { m: "Nov", active: 64, responsive: 47, dropouts: 5 },
    { m: "Dec", active: 71, responsive: 52, dropouts: 8 },
    { m: "Jan", active: 76, responsive: 58, dropouts: 7 },
    { m: "Feb", active: 80, responsive: 63, dropouts: 5 },
    { m: "Mar", active: 83, responsive: 68, dropouts: 4 },
  ];
  const pipelineHealth = [
    { role: "Data Scientist", health: 78, status: "Healthy" },
    { role: "ML Engineer", health: 62, status: "Watch" },
    { role: "Cybersecurity Lead", health: 41, status: "At risk" },
    { role: "Cloud Architect", health: 55, status: "Watch" },
    { role: "Data Analyst", health: 86, status: "Healthy" },
    { role: "Risk & Quality Lead", health: 70, status: "Healthy" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPI label="Avg utilisation" value={88} suffix="%" tone="primary" />
        <KPI label="Overloaded staff" value={47} tone="destructive" hint=">100% utilisation" />
        <KPI label="Open positions" value={15} tone="warning" />
      </div>

      <Card>
        <CardHeader title="Capacity vs utilisation by BU" subtitle="% of contracted capacity" icon={ClipboardList} />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={buLoad}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="bu" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="capacity" name="Capacity" fill="var(--chart-3)" />
            <Bar dataKey="utilised" name="Utilised" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="flex items-center gap-2 pt-2">
        <Rocket className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Real-time pipeline</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Skills coverage" subtitle="Current coverage vs target by skill family" icon={Target} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={skillsCoverage} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={130} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="coverage" name="Coverage %" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              <Bar dataKey="target" name="Target %" fill="var(--chart-3)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Pipeline engagement" subtitle="Active, responsive candidates and dropouts" icon={TrendingUp} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineEngagement} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="active" name="Active" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="responsive" name="Responsive" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dropouts" name="Dropouts" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Pipeline health by critical role" subtitle="Composite health score (0–100)" icon={AlertTriangle} />
        <ul className="space-y-3">
          {pipelineHealth.map((r) => {
            const tone = r.health >= 75 ? "success" : r.health >= 55 ? "warning" : "destructive";
            const variant = r.status === "Healthy" ? "secondary" : r.status === "Watch" ? "default" : "destructive";
            return (
              <li key={r.role} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{r.role}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={variant}>{r.status}</Badge>
                    <span className={cn("text-sm font-bold tabular-nums", tone === "success" ? "text-[color:var(--success)]" : tone === "warning" ? "text-[color:var(--warning)]" : "text-destructive")}>{r.health}</span>
                  </div>
                </div>
                <Progress value={r.health} className="mt-2 h-2" />
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

/* ───────── Time · attendance and absence ───────── */

export function TimeTab() {
  const monthly = [
    { m: "Aug", absent: 3.2, sick: 1.4, leave: 4.8, overtime: 6.1 },
    { m: "Sep", absent: 2.8, sick: 1.6, leave: 3.9, overtime: 5.4 },
    { m: "Oct", absent: 3.5, sick: 2.1, leave: 5.2, overtime: 6.8 },
    { m: "Nov", absent: 3.0, sick: 1.8, leave: 6.4, overtime: 7.1 },
    { m: "Dec", absent: 2.4, sick: 1.5, leave: 9.8, overtime: 4.2 },
    { m: "Jan", absent: 3.6, sick: 2.3, leave: 3.1, overtime: 7.5 },
    { m: "Feb", absent: 3.1, sick: 1.9, leave: 3.4, overtime: 6.9 },
    { m: "Mar", absent: 2.9, sick: 1.7, leave: 4.0, overtime: 7.2 },
  ];
  const leaveTypes = [
    { type: "Annual leave", days: 1840, balance: 920 },
    { type: "Sick leave", days: 612, balance: 480 },
    { type: "Family responsibility", days: 84, balance: 220 },
    { type: "Study leave", days: 96, balance: 110 },
    { type: "Maternity / paternity", days: 240, balance: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Avg absence" value={3.1} suffix="%" tone="warning" hint="Rolling 8-month" />
        <KPI label="Sick leave taken" value={612} suffix="d" tone="primary" />
        <KPI label="Overtime ratio" value={6.4} suffix="%" tone="warning" />
        <KPI label="On-time arrival" value={94.2} suffix="%" tone="success" />
      </div>

      <Card>
        <CardHeader title="Attendance & overtime trend" subtitle="Monthly % of contracted hours" icon={Clock} />
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="absent" stroke="var(--chart-4)" strokeWidth={2} />
            <Line type="monotone" dataKey="sick" stroke="var(--chart-5)" strokeWidth={2} />
            <Line type="monotone" dataKey="leave" stroke="var(--chart-3)" strokeWidth={2} />
            <Line type="monotone" dataKey="overtime" stroke="var(--chart-1)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader title="Leave consumption (FYTD)" subtitle="Days taken vs days remaining" icon={ClipboardList} />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={leaveTypes} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} width={160} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="days" name="Taken" stackId="a" fill="var(--chart-1)" />
            <Bar dataKey="balance" name="Remaining" stackId="a" fill="var(--chart-3)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
