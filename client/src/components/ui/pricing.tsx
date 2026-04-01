import React from 'react'
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  highlightLabel?: string;
  buttonVariant?: "default" | "outline";
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.35,
      duration: 1.2,
      delay: i * 0.2,
    },
  }),
}

const featureVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.6,
      delay: 0.4 + i * 0.06,
    },
  }),
}

export function PricingCard({
  title,
  price,
  description,
  features,
  highlight = false,
  buttonVariant = "outline",
  index = 0,
}: PricingCardProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className={cn(
        "flex flex-col justify-between p-8 space-y-6 transition-all duration-500",
        highlight
          ? "bg-surface-900 border-2 border-primary-500/50 rounded-2xl w-full md:w-1/2 shadow-2xl shadow-primary-500/10 hover:shadow-primary-500/20 hover:border-primary-400/60"
          : "flex-1 rounded-2xl border border-surface-800 hover:border-surface-700 hover:shadow-lg hover:shadow-surface-900/50"
      )}
    >
      <div className={highlight ? "grid gap-6" : ""}>
        <div className="space-y-4">
          <div>
            <h2 className={cn("font-bold text-lg uppercase tracking-wider", highlight ? "text-primary-400" : "text-surface-400")}>{title}</h2>
            <motion.span
              className="my-3 block text-4xl font-bold text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.8, delay: 0.2 + index * 0.2 }}
            >
              {price}
            </motion.span>
            <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button asChild className={cn(
              "w-full h-12 rounded-xl text-md font-bold transition-all duration-300",
              highlight && "hover:shadow-lg hover:shadow-primary-500/30"
            )} variant={buttonVariant}>
              <Link to="/register">{highlight ? "Start Pro Trial" : "Get Started Free"}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {highlight && (
        <motion.div
          className="pt-4 border-t border-surface-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-4">Everything in Free, plus:</div>
        </motion.div>
      )}

      <ul className={cn("list-outside space-y-4 text-sm", !highlight && "border-t border-surface-800 pt-6")}>
        {features.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={featureVariants}
            className="flex items-start gap-3 text-surface-300 group/feature"
          >
            <Check className="size-4 text-primary-500 shrink-0 mt-0.5 group-hover/feature:scale-125 group-hover/feature:text-primary-400 transition-all duration-300" />
            <span className="group-hover/feature:text-surface-200 transition-colors duration-300">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 1,
    },
  },
}

export function PricingSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-950 border-t border-surface-900" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col text-left md:text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headingVariants}
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Salyze at Scale with Pro
          </h2>
          <p className="text-surface-400 lg:text-lg mb-0 leading-relaxed">
            Choose the plan that fits your sales team. From solo founders to enterprise squads, we've got your calls covered.
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl flex flex-col justify-between border border-surface-800/50 bg-surface-900/20 p-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-6 md:flex-row">
            <PricingCard
              title="Individual"
              price="$0 / mo"
              description="Perfect for testing the AI transcription and analysis experience."
              buttonVariant="outline"
              index={0}
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
              index={1}
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
        </motion.div>
      </div>
    </section>
  );
}
