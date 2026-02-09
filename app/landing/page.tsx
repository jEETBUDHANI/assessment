import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, Code2 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-gray-800 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                            Weavy Workflow
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/sign-in"
                            className="text-gray-300 hover:text-white transition-colors text-sm"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-8">
                        <Zap size={16} className="text-cyan-400" />
                        <span className="text-sm text-gray-300">Build AI Workflows Visually</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Create Powerful{" "}
                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                            AI Workflows
                        </span>
                        <br />
                        Without Code
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Drag, drop, and connect nodes to build sophisticated LLM-powered workflows.
                        Process images, videos, and text with AI - all in a beautiful visual interface.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/sign-up"
                            className="group bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                        >
                            Start Building Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/workflow"
                            className="px-8 py-4 rounded-lg font-semibold text-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-900/50 transition-all"
                        >
                            View Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">6</div>
                            <div className="text-sm text-gray-500 mt-1">Node Types</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">∞</div>
                            <div className="text-sm text-gray-500 mt-1">Possibilities</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">0</div>
                            <div className="text-sm text-gray-500 mt-1">Code Required</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
                    <p className="text-gray-400 text-lg">Powerful features for building AI workflows</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-cyan-500/50 transition-all group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                            <Sparkles size={24} className="text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI-Powered Nodes</h3>
                        <p className="text-gray-400">
                            Connect to Google Gemini and other LLMs. Process text, images, and videos with cutting-edge AI models.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-violet-500/50 transition-all group">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                            <Zap size={24} className="text-violet-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                        <p className="text-gray-400">
                            Parallel execution, background tasks with Trigger.dev, and optimized processing for maximum speed.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-pink-500/50 transition-all group">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                            <Shield size={24} className="text-pink-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                        <p className="text-gray-400">
                            Enterprise-grade authentication with Clerk. Your workflows and data are always protected.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-cyan-500/50 transition-all group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                            <Code2 size={24} className="text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Export & Import</h3>
                        <p className="text-gray-400">
                            Save workflows as JSON. Share with your team or version control your AI pipelines.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-violet-500/50 transition-all group">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Execution History</h3>
                        <p className="text-gray-400">
                            Track every workflow run with detailed node-level execution logs and performance metrics.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl hover:border-pink-500/50 transition-all group">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Media Processing</h3>
                        <p className="text-gray-400">
                            Crop images, extract video frames, and process media files with FFmpeg integration.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 border border-gray-800 rounded-3xl p-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of developers building the future with AI workflows
                    </p>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25"
                    >
                        Get Started Free
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 bg-black/50 backdrop-blur-xl mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
                    <p>© 2024 Weavy Workflow. Built with Next.js, Clerk, and Trigger.dev.</p>
                </div>
            </footer>
        </div>
    );
}
