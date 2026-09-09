export function getPriorityLabel(score: number) {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 45) return "Medium";
  if (score >= 20) return "Low";
  return "Backlog";
}

export function getPriorityColor(score: number) {
  if (score >= 85) return "bg-rose-50 text-rose-700 border-rose-200";
  if (score >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  if (score >= 45) return "bg-blue-50 text-blue-700 border-blue-200";
  if (score >= 20) return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-zinc-100 text-zinc-600 border-zinc-200";
}
