import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PrivacyPolicy = () => {
    return (
        <div className="bg-surface-950 min-h-screen text-surface-200 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Button asChild variant="ghost" className="mb-12 -ml-4 text-surface-400 hover:text-white">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Privacy Policy</h1>
                <p className="text-surface-400 mb-12">Last Updated: April 1, 2026</p>

                <div className="space-y-12 prose prose-invert max-w-none">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p className="mb-4">
                            Salyzer collects audio recordings, transcribed text, and related metadata provided by our users for the purpose of AI analysis. 
                            We also collect basic account information including your name, email address, and team membership details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Use of AI Content</h2>
                        <p className="mb-4">
                            All audio recordings are processed via third-party AI models (Groq, OpenAI, Anthropic). We do not use your proprietary call data 
                            to train our internal models or public datasets. Your data is strictly yours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Security</h2>
                        <p className="mb-4">
                            We implement industry-standard encryption for both data-at-rest (Postgres Cloud storage) and data-in-transit (TLS/SSL). 
                            Authentication is handled via secure JWT tokens.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
