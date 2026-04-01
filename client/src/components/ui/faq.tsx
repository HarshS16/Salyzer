import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "How accurate is Salyzer's AI transcription?",
        answer: "We use Groq's Groq Whisper-v3 Large model, which provides 99%+ accuracy and sub-second word-level timestamps. It also features automatic speaker separation (diarization) for clear agent-customer dialogue."
    },
    {
        question: "Is my proprietary call data secure?",
        answer: "Absolutely. Salyzer uses enterprise-grade AES-256 encryption. We never use your private sales calls to train our AI models or sell your data to third parties. Your intelligence stays yours."
    },
    {
        question: "Which AI models process the sales scoring?",
        answer: "We use a multi-model 'race' architecture. Depending on the complexity, your calls are analyzed by GPT-4o, Claude 3.5, or Llama 3.1 405B to ensure you get the deepest insights with the lowest latency."
    },
    {
        question: "Can I integrate Salyzer with my CRM?",
        answer: "Yes. Salyzer Pro features native integrations with Salesforce, HubSpot, and Pipedrive. Your call scores and summaries are automatically synced to the appropriate customer records."
    },
    {
        question: "Do you support languages other than English?",
        answer: "Yes, our Groq-powered transcription engine supports over 50 languages with native-level accuracy, including Spanish, French, German, and Mandarin."
    }
];

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

const faqItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            bounce: 0.3,
            duration: 0.8,
            delay: 0.1 + i * 0.1,
        },
    }),
}

export const FaqSection = () => {
    return (
        <section className="py-24 md:py-32 bg-surface-950 border-t border-surface-900" id="faq">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={headingVariants}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Common Questions</h2>
                    <p className="text-surface-400 text-lg">Everything you need to know about the Salyzer AI Platform.</p>
                </motion.div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={faqItemVariants}
                        >
                            <AccordionItem value={`item-${index}`} className="hover:bg-surface-900/40 transition-all duration-300 px-4 -mx-4 rounded-xl">
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
