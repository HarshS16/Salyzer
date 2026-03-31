import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TermsOfService = () => {
    return (
        <div className="bg-surface-950 min-h-screen text-surface-200 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Button asChild variant="ghost" className="mb-12 -ml-4 text-surface-400 hover:text-white">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Terms of Service</h1>
                <p className="text-surface-400 mb-12">Last Updated: April 1, 2026</p>

                <div className="space-y-12 prose prose-invert max-w-none">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptable Use</h2>
                        <p className="mb-4">
                            You are responsible for obtaining all necessary consents and permissions from your sales team and customers before recording or analyzing calls via Salyzer. 
                            Unauthorized recording of calls is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. AI Analysis Disclaimers</h2>
                        <p className="mb-4">
                            Salyzer's analysis is provided "as-is" by third-party Large Language Models. While highly accurate, we do not guarantee 100% 
                            perfection in transcription or scoring. 
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default TermsOfService
