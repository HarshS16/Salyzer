import React from 'react'
import { HeroSection } from '@/components/blocks/hero-section-1'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { MagicCard } from '@/components/ui/magic-card'
import { Link } from 'react-router-dom'
import { PricingSection } from '@/components/ui/pricing'
import { FaqSection } from '@/components/ui/faq'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const featureCardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.35,
      duration: 1.2,
      delay: i * 0.15,
    },
  }),
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

const footerLinkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
      delay: 0.3 + i * 0.1,
    },
  }),
}

const Landing = () => {
  return (
    <div className="bg-surface-950 min-h-screen text-surface-200 selection:bg-primary-500 selection:text-white overflow-hidden pb-12">
      {/* 🚀 The Star of the Show: Hero Section */}
      <HeroSection />

      {/* 📊 Features / Social Proof Section */}
      <section className="py-24 border-t border-surface-900 bg-surface-950" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-20 space-y-4 text-center md:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headingVariants}
          >
            <TextEffect per="char" preset="fade" className="text-primary-500 font-bold uppercase tracking-widest text-sm">
              The Salyzer Advantage
            </TextEffect>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              AI-Driven Sales <br />
              <span className="text-surface-500">Intelligence at Scale</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Precision Transcription */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={featureCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
            >
              <Card className="border-none p-0 shadow-none bg-transparent h-full">
                <MagicCard gradientColor="#262626" className="p-0 h-full hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-500">
                  <CardHeader className="p-8 pb-0">
                    <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 group-hover:bg-primary-600/20 group-hover:shadow-lg group-hover:shadow-primary-500/20 duration-500 transition-all">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 20v-6M6 20V10M18 20V4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors duration-300">Precision Transcription</CardTitle>
                    <CardDescription className="text-surface-400 leading-relaxed text-sm group-hover:text-surface-300 transition-colors duration-300">
                      Powered by Groq Whisper-v3 Large. 100% accurate, word-level timestamps with automatic speaker separation and diarization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-6">
                    <div className="h-1 bg-surface-800/50 rounded-full w-full overflow-hidden">
                      <motion.div
                        className="bg-primary-500 h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        initial={{ width: '0%' }}
                        whileInView={{ width: '98%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </CardContent>
                </MagicCard>
              </Card>
            </motion.div>

            {/* Feature 2: Multi-Model Analysis */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={featureCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
            >
              <Card className="border-none p-0 shadow-none bg-transparent h-full">
                <MagicCard gradientColor="#262626" className="p-0 h-full hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-500">
                  <CardHeader className="p-8 pb-0">
                    <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 group-hover:bg-primary-600/20 group-hover:shadow-lg group-hover:shadow-primary-500/20 duration-500 transition-all">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors duration-300">Multi-Model Analysis</CardTitle>
                    <CardDescription className="text-surface-400 leading-relaxed text-sm group-hover:text-surface-300 transition-colors duration-300">
                      We "race" GPT-4, Claude 3, and Llama 3.1 in parallel. The fastest and most accurate model wins the race to give you instant feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-6">
                    <div className="flex gap-2">
                      <motion.div
                        className="px-3 py-1 rounded-full bg-surface-800 text-[10px] font-bold text-surface-400 uppercase tracking-tight hover:bg-surface-700 hover:text-surface-200 transition-all duration-300 cursor-default"
                        whileHover={{ scale: 1.1 }}
                      >GPT-4o</motion.div>
                      <motion.div
                        className="px-3 py-1 rounded-full bg-surface-800 text-[10px] font-bold text-surface-400 uppercase tracking-tight hover:bg-surface-700 hover:text-surface-200 transition-all duration-300 cursor-default"
                        whileHover={{ scale: 1.1 }}
                      >Claude 3.5</motion.div>
                      <motion.div
                        className="px-3 py-1 rounded-full bg-primary-600/20 text-[10px] font-bold text-primary-400 uppercase tracking-tight border border-primary-500/20 hover:bg-primary-600/30 hover:border-primary-500/40 transition-all duration-300 cursor-default"
                        whileHover={{ scale: 1.1 }}
                      >Llama 3.1</motion.div>
                    </div>
                  </CardContent>
                </MagicCard>
              </Card>
            </motion.div>

            {/* Feature 3: Sentiment Scoring */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={featureCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
            >
              <Card className="border-none p-0 shadow-none bg-transparent h-full">
                <MagicCard gradientColor="#262626" className="p-0 h-full hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-500">
                  <CardHeader className="p-8 pb-0">
                    <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 group-hover:bg-primary-600/20 group-hover:shadow-lg group-hover:shadow-primary-500/20 duration-500 transition-all">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors duration-300">Sentiment Scoring</CardTitle>
                    <CardDescription className="text-surface-400 leading-relaxed text-sm group-hover:text-surface-300 transition-colors duration-300">
                      Get a breakdown of tone, objection handling, and competitor mentions. Automated performance grading against your official scripts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-6 text-sm italic text-surface-500 group-hover:text-surface-400 transition-colors duration-300">
                    "AI insight: The customer responded positively to the pricing pitch..."
                  </CardContent>
                </MagicCard>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 💰 Pricing Section */}
      <PricingSection />

      {/* ❓ FAQ Section */}
      <FaqSection />

      {/* 📝 Footer Section */}
      <motion.footer
        className="py-20 border-t border-surface-900 bg-surface-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="mb-8 inline-flex items-center space-x-3"
            variants={headingVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 bg-surface-700 rounded-lg hover:bg-primary-600 transition-colors duration-500"></div>
            <span className="font-bold text-lg text-white">Salyzer</span>
          </motion.div>
          <motion.p
            className="text-surface-500 text-sm mb-12"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6 } },
            }}
          >
            © 2026 Salyzer AI Platform. All rights reserved.
          </motion.p>
          <div className="flex justify-center gap-8 text-surface-400 text-sm font-semibold">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((label, i) => (
              <motion.div key={label} custom={i} variants={footerLinkVariants}>
                <Link
                  to={`/${label === 'Privacy Policy' ? 'privacy' : label === 'Terms of Service' ? 'terms' : 'support'}`}
                  className="hover:text-primary-400 transition-colors duration-300 relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Landing
