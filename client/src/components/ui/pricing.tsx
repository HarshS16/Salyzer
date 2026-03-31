import React from 'react'
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  highlightLabel?: string;
  buttonVariant?: "default" | "outline";
}

export function PricingCard({
  title,
  price,
  description,
  features,
  highlight = false,
  buttonVariant = "outline",
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between p-8 space-y-6 transition-all duration-500",
        highlight ? "bg-surface-900 border-2 border-primary-500/50 rounded-2xl w-full md:w-1/2 shadow-2xl shadow-primary-500/10" : "flex-1 rounded-2xl border border-surface-800"
      )}
    >
      <div className={highlight ? "grid gap-6" : ""}>
        <div className="space-y-4">
          <div>
            <h2 className={cn("font-bold text-lg uppercase tracking-wider", highlight ? "text-primary-400" : "text-surface-400")}>{title}</h2>
            <span className="my-3 block text-4xl font-bold text-white">{price}</span>
            <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
          </div>

          <Button asChild className="w-full h-12 rounded-xl text-md font-bold" variant={buttonVariant}>
            <Link to="/register">{highlight ? "Start Pro Trial" : "Get Started Free"}</Link>
          </Button>
        </div>
      </div>

      {highlight && (
        <div className="pt-4 border-t border-surface-800">
          <div className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-4">Everything in Free, plus:</div>
        </div>
      )}

      <ul className={cn("list-outside space-y-4 text-sm", !highlight && "border-t border-surface-800 pt-6")}>
        {features.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-surface-300">
            <Check className="size-4 text-primary-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-950 border-t border-surface-900" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Salyze at Scale with Pro
          </h2>
          <p className="text-surface-400 lg:text-lg mb-0 leading-relaxed">
            Choose the plan that fits your sales team. From solo founders to enterprise squads, we've got your calls covered.
          </p>
        </div>

        <div className="rounded-3xl flex flex-col justify-between border border-surface-800/50 bg-surface-900/20 p-2">
          <div className="flex flex-col gap-6 md:flex-row">
            <PricingCard
              title="Individual"
              price="$0 / mo"
              description="Perfect for testing the AI transcription and analysis experience."
              buttonVariant="outline"
              features={[
                "5 Sales Calls per Month",
                "Groq Whisper-v3 Transcription",
                "Basic GPT-4o Analysis",
                "Single User Account",
                "Community Support",
              ]}
            />

            <PricingCard
              title="Sales Pro"
              price="$49 / mo"
              description="For heavy hitters who need deep competitive intelligence."
              buttonVariant="default"
              highlight
              features={[
                "Unlimited Call Transcriptions",
                "Multi-Model 'Race' Analysis",
                "Custom Scoring Scripts",
                "Competitor Mention Tracking",
                "Team Performance Dashboard",
                "Priority API Access",
                "Automated CRM Sync",
                "Custom Branding",
                "Daily Performance Backups",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
