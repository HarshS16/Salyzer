import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { InfiniteGrid } from '@/components/ui/infinite-grid'
import { cn } from '@/lib/utils'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden relative min-h-screen bg-surface-950">
                {/* 🌟 Dynamic Infinite Grid Background - Maximum Impact */}
                <InfiniteGrid className="z-0 opacity-100 pointer-events-auto" />
                
                <section className="relative z-10">
                    <div aria-hidden className="absolute inset-0 -z-20 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,rgba(15,23,42,0.6)_85%)]" />
                    
                    <div className="relative pt-24 md:pt-36">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants} className="space-y-8">
                                    <Link
                                        to="/register"
                                        className="hover:bg-surface-800 dark:hover:border-t-border bg-surface-900 group mx-auto flex w-fit items-center gap-4 rounded-full border border-surface-700/50 p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-surface-200 text-sm">Now Supporting Groq Whisper-v3</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-primary-600 text-white group-hover:bg-primary-500 size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1
                                        className="max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold tracking-tight text-white leading-[1.1]">
                                        Analyze Your Sales Calls with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">AI Intelligence</span>
                                    </h1>
                                    <p
                                        className="mx-auto max-w-2xl text-balance text-lg text-surface-400">
                                        Transcribe, analyze, and optimize every conversation. Empower your sales team with
                                        real-time AI-driven feedback and automated performance scoring.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 1.2,
                                                },
                                            },
                                        },
                                        item: transitionVariants.item
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-primary-500/20 rounded-[14px] border border-primary-500/30 p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-8 text-base">
                                            <Link to="/register">
                                                <span className="text-nowrap">Start Building Free</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    {/* <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-10.5 rounded-xl px-8">
                                        <Link to="/login">
                                            <span className="text-nowrap">Explore Demo</span>
                                        </Link>
                                    </Button> */}
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 1.5,
                                        },
                                    },
                                },
                                item: transitionVariants.item
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b from-transparent via-transparent to-surface-950 absolute inset-0 z-10"
                                />
                                <div className="border-surface-700/50 bg-surface-900 relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-2 shadow-[0_0_50px_rgba(37,99,235,0.1)] ring-1 ring-surface-800">
                                    <img
                                        className="bg-surface-950 aspect-16/9 relative rounded-xl"
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
                                        alt="Salyzer Dashboard Preview"
                                        width="1920"
                                        height="1080"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                
                {/* Trusted By Section */}
                {/* <section className="bg-surface-950/50 pb-16 pt-16 md:pb-32"> ... </section> */}
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '/history' },
    { name: 'Analytics', href: '/' },
    { name: 'Pricing', href: '#pricing' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <header className="relative z-[100]">
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-4 group top-4">
                <div className={cn(
                    'mx-auto max-w-6xl px-6 transition-all duration-500 rounded-2xl', 
                    isScrolled 
                        ? 'bg-surface-950/80 max-w-4xl border border-surface-800 backdrop-blur-md px-5' 
                        : 'bg-transparent'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between items-center lg:w-auto">
                            <Link
                                to="/"
                                className="flex items-center space-x-2">
                                <Logo />
                                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-surface-100 bg-clip-text text-transparent">Salyzer</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white">
                                {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-medium">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.href}
                                            className="text-surface-400 hover:text-white block duration-300 transition-colors">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={cn(
                            "group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 lg:m-0 lg:flex lg:w-fit lg:gap-8 lg:space-y-0 lg:p-0",
                            menuState && "bg-surface-900 border border-surface-800 mt-4 shadow-2xl"
                        )}>
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base font-semibold">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-surface-300 hover:text-primary-400 block duration-300">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-4 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-surface-300 hover:text-white font-semibold">
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-full px-6 font-bold">
                                    <Link to="/register">Join Free</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
            >
                <path
                    d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}
