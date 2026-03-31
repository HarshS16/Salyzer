import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const Support = () => {
    return (
        <div className="bg-surface-950 min-h-screen text-surface-200 py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Button asChild variant="ghost" className="mb-12 -ml-4 text-surface-400 hover:text-white">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Support Center</h1>
                <p className="text-surface-400 mb-16 text-lg">We're here to help you get the most out of Salyzer AI.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-surface-900/50 border-surface-800 hover:border-primary-500 transition-all duration-300">
                        <CardHeader>
                            <Mail className="h-8 w-8 text-primary-500 mb-4" />
                            <CardTitle>Email Support</CardTitle>
                            <CardDescription className="mb-6">
                                Response within 24 hours for all paid plans.
                            </CardDescription>
                            <Button variant="outline" className="w-full">support@salyzer.ai</Button>
                        </CardHeader>
                    </Card>

                    <Card className="bg-surface-900/50 border-surface-800 hover:border-blue-500 transition-all duration-300">
                        <CardHeader>
                            <MessageSquare className="h-8 w-8 text-blue-500 mb-4" />
                            <CardTitle>Live Chat</CardTitle>
                            <CardDescription className="mb-6">
                                Available 9am-5pm EST for Enterprise.
                            </CardDescription>
                            <Button variant="outline" className="w-full">Open Chat</Button>
                        </CardHeader>
                    </Card>

                    <Card className="bg-surface-900/50 border-surface-800 hover:border-surface-600 transition-all duration-300">
                        <CardHeader>
                            <HelpCircle className="h-8 w-8 text-surface-400 mb-4" />
                            <CardTitle>Documentation</CardTitle>
                            <CardDescription className="mb-6">
                                Tutorials, setup guides, and more.
                            </CardDescription>
                            <Button variant="outline" className="w-full">View Docs</Button>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Support
