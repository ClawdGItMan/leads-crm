import Anthropic from "@anthropic-ai/sdk";
import { format } from "date-fns";

export type PipelineSummaryInput = {
  workspaceName: string;
  summaryDate: string;
  stats: {
    totalLeads: number;
    activeLeads: number;
    newLeads: number;
    updatedLeads: number;
    newContacts: number;
  };
  recentLeads: Array<{
    name: string;
    status: string;
    source: string | null;
    priority_score: number;
    updated_at: string;
  }>;
  recentContacts: Array<{
    full_name: string;
    title: string | null;
    organization: string;
    email: string | null;
    created_at: string;
  }>;
  recentActivities: Array<{
    type: string;
    summary: string;
    created_at: string;
  }>;
};

export type PipelineSummaryOutput = {
  executive_summary: string;
  lead_changes_summary: string;
  contact_changes_summary: string;
  action_items: string;
};

const SYSTEM_PROMPT = `You are an operations assistant generating a concise CRM pipeline summary for a sales team.

Return exactly these markdown sections:

## Executive Summary
2-3 sentences describing pipeline momentum and what matters most.

## Lead Changes
Summarize notable lead additions, status changes, and priority shifts.

## Contact Changes
Summarize new contacts added and any gaps in contact coverage that are obvious from the data.

## Action Items
Return 3-5 short bullet points with the next actions the team should take.

Rules:
- Stay grounded in the provided data.
- Use names, counts, and concrete details when available.
- If there is limited activity, say that clearly and still provide helpful next actions.
- Keep the tone crisp, professional, and operational.`;

function parseSection(text: string, header: string) {
  const regex = new RegExp(`##\\s*${header}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
  return text.match(regex)?.[1]?.trim() ?? "";
}

function buildFallbackSummary(input: PipelineSummaryInput): PipelineSummaryOutput {
  const { stats, recentLeads, recentContacts, recentActivities } = input;
  const topLead = recentLeads[0];
  const newestContact = recentContacts[0];

  return {
    executive_summary:
      recentActivities.length === 0
        ? `Activity was light on ${format(new Date(input.summaryDate), "MMMM d, yyyy")}. The workspace currently holds ${stats.totalLeads} leads and ${stats.activeLeads} active records, so the immediate focus should be tightening follow-up discipline and filling contact coverage.`
        : `${input.workspaceName} recorded ${recentActivities.length} recent activity updates, ${stats.newLeads} new leads, and ${stats.newContacts} new contacts. ${topLead ? `${topLead.name} is the clearest high-priority record in the current pipeline.` : "The pipeline has a workable base to prioritize from."}`,
    lead_changes_summary:
      recentLeads.length === 0
        ? "No notable lead changes were recorded in the current review window."
        : recentLeads
            .slice(0, 5)
            .map(
              (lead) =>
                `${lead.name} is currently ${lead.status.replace(/_/g, " ")} with a priority score of ${lead.priority_score}${lead.source ? ` via ${lead.source}` : ""}.`
            )
            .join(" "),
    contact_changes_summary:
      recentContacts.length === 0
        ? "No new contacts were added. The next best move is to add at least one decision-maker or operator contact to the most active leads."
        : `${recentContacts.length} contacts were added recently.${newestContact ? ` The newest addition is ${newestContact.full_name} at ${newestContact.organization}${newestContact.title ? ` as ${newestContact.title}` : ""}.` : ""}`,
    action_items: [
      topLead ? `- Review ${topLead.name} and confirm the next owner and outreach date.` : "- Review active leads and pick the top three records that need outreach this week.",
      recentContacts.length === 0
        ? "- Add missing contacts for the highest-priority leads."
        : "- Verify contact quality and missing decision-maker coverage on the latest accounts.",
      "- Archive stale records that no longer deserve active follow-up.",
      "- Refresh notes on leads that moved recently so the next step is obvious.",
    ].join("\n"),
  };
}

export async function generatePipelineSummary(
  input: PipelineSummaryInput
): Promise<PipelineSummaryOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return buildFallbackSummary(input);
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate the CRM summary from this JSON:\n\n${JSON.stringify(input, null, 2)}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return buildFallbackSummary(input);
    }

    return {
      executive_summary: parseSection(textBlock.text, "Executive Summary"),
      lead_changes_summary: parseSection(textBlock.text, "Lead Changes"),
      contact_changes_summary: parseSection(textBlock.text, "Contact Changes"),
      action_items: parseSection(textBlock.text, "Action Items"),
    };
  } catch {
    return buildFallbackSummary(input);
  }
}
