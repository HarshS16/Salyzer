import React from 'react'
import { HeroSection } from '@/components/blocks/hero-section-1'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { MagicCard } from '@/components/ui/magic-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Landing = () => {
  return (
    <div className="bg-surface-950 min-h-screen text-surface-200 selection:bg-primary-500 selection:text-white overflow-hidden pb-12">
      {/* 🚀 The Star of the Show: Hero Section */}
      <HeroSection />

      {/* 📊 Features / Social Proof Section */}
      <section className="py-24 border-t border-surface-900 bg-surface-950" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 space-y-4 text-center md:text-left">
            <TextEffect per="char" preset="fade" className="text-primary-500 font-bold uppercase tracking-widest text-sm">
              The Salyzer Advantage
            </TextEffect>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              AI-Driven Sales <br /> 
              <span className="text-surface-500">Intelligence at Scale</span>
            </h2>
          </div>

          <AnimatedGroup preset="blur-slide" className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Feature 1: Precision Transcription */}
             <Card className="border-none p-0 shadow-none bg-transparent h-full">
              <MagicCard gradientColor="#262626" className="p-0 h-full">
                <CardHeader className="p-8 pb-0">
                  <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 duration-500 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 20v-6M6 20V10M18 20V4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-4">Precision Transcription</CardTitle>
                  <CardDescription className="text-surface-400 leading-relaxed text-sm">
                    Powered by Groq Whisper-v3 Large. 100% accurate, word-level timestamps with automatic speaker separation and diarization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                   <div className="h-1 bg-surface-800/50 rounded-full w-full overflow-hidden">
                      <div className="bg-primary-500 h-full w-[98%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                   </div>
                </CardContent>
              </MagicCard>
            </Card>

            {/* Feature 2: Multi-Model Analysis */}
            <Card className="border-none p-0 shadow-none bg-transparent h-full">
              <MagicCard gradientColor="#262626" className="p-0 h-full">
                <CardHeader className="p-8 pb-0">
                  <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 duration-500 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-4">Multi-Model Analysis</CardTitle>
                  <CardDescription className="text-surface-400 leading-relaxed text-sm">
                    We "race" GPT-4, Claude 3, and Llama 3.1 in parallel. The fastest and most accurate model wins the race to give you instant feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                   <div className="flex gap-2">
                       <div className="px-3 py-1 rounded-full bg-surface-800 text-[10px] font-bold text-surface-400 uppercase tracking-tight">GPT-4o</div>
                       <div className="px-3 py-1 rounded-full bg-surface-800 text-[10px] font-bold text-surface-400 uppercase tracking-tight">Claude 3.5</div>
                       <div className="px-3 py-1 rounded-full bg-primary-600/20 text-[10px] font-bold text-primary-400 uppercase tracking-tight border border-primary-500/20">Llama 3.1</div>
                   </div>
                </CardContent>
              </MagicCard>
            </Card>

            {/* Feature 3: Sentiment Scoring */}
            <Card className="border-none p-0 shadow-none bg-transparent h-full">
              <MagicCard gradientColor="#262626" className="p-0 h-full">
                <CardHeader className="p-8 pb-0">
                  <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 duration-500 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-4">Sentiment Scoring</CardTitle>
                  <CardDescription className="text-surface-400 leading-relaxed text-sm">
                    Get a breakdown of tone, objection handling, and competitor mentions. Automated performance grading against your official scripts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-6 text-sm italic text-surface-500">
                    "AI insight: The customer responded positively to the pricing pitch..."
                </CardContent>
              </MagicCard>
            </Card>
          </AnimatedGroup>
        </div>
      </section>

      {/* 📝 Footer Section */}
      <footer className="py-20 border-t border-surface-900 bg-surface-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-8 inline-flex items-center space-x-3 grayscale opacity-50">
                <div className="w-8 h-8 bg-surface-700 rounded-lg"></div>
                <span className="font-bold text-lg text-white">Salyzer</span>
            </div>
            <p className="text-surface-500 text-sm mb-12">© 2024 Salyzer AI Platform. All rights reserved.</p>
            <div className="flex justify-center gap-8 text-surface-400 text-sm font-semibold">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
