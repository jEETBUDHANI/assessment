import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        Weavy Workflow
                    </h1>
                    <p className="text-gray-400 text-sm">Start building AI workflows today</p>
                </div>

                {/* Clerk Sign Up Component */}
                <div className="flex justify-center">
                    <SignUp
                        forceRedirectUrl="/workflow"
                        signInUrl="/sign-in"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl",
                                headerTitle: "text-white",
                                headerSubtitle: "text-gray-400",
                                socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700 text-white",
                                formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600",
                                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                                identityPreviewText: "text-white",
                                identityPreviewEditButton: "text-cyan-400",
                                formFieldInput: "bg-gray-800 border-gray-700 text-white",
                                formFieldLabel: "text-gray-300",
                                dividerLine: "bg-gray-700",
                                dividerText: "text-gray-500",
                            }
                        }}
                    />
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                        <div className="text-2xl mb-1">🚀</div>
                        <div className="text-xs text-gray-400">Quick Start</div>
                    </div>
                    <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="text-xs text-gray-400">Secure</div>
                    </div>
                    <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                        <div className="text-2xl mb-1">💎</div>
                        <div className="text-xs text-gray-400">Free Credits</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
