import { Check, Zap, Users, Brain, BookOpen, TestTube, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl bg-black text-white">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About <span className="text-purple-600">i-contract</span>
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-300 max-w-3xl mx-auto">
            Build, Test, and Deploy Smart Contracts—No Coding Required
          </p>
        </section>

        {/* Welcome Section */}
        <section className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-200">
            Welcome to <strong>i-contract</strong>, the revolutionary platform that makes blockchain
            development accessible to everyone—whether you're a seasoned developer or just starting out.
          </p>
          <p className="text-lg text-gray-200">
            With our <strong>drag-and-drop interface</strong>, you can design, customize, and deploy smart contracts
            <strong> without writing a single line of code</strong>. Prefer coding? Switch to{" "}
            <strong>advanced mode</strong> for full control.
          </p>
        </section>

        {/* Key Features Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-purple-600" />}
              title="Drag-and-Drop Smart Contract Builder"
              description="Easily create contracts using a visual editor—no prior coding knowledge needed."
            />
            <FeatureCard
              icon={<ArrowRight className="h-6 w-6 text-purple-600" />}
              title="One-Click Deployment"
              description="Deploy your contracts directly to multiple blockchains with a single click."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-purple-600" />}
              title="Peer-to-Peer Live Collaboration"
              description="Share projects in real-time with teammates or friends for seamless co-development."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-purple-600" />}
              title="AI-Powered Guidance"
              description="Get instant suggestions, debugging help, and optimization tips from our built-in AI assistant."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-purple-600" />}
              title="Interactive Learning Hub"
              description="New to blockchain? Our beginner-friendly tutorials will get you started. Advanced users can explore cutting-edge contract patterns and best practices."
            />
            <FeatureCard
              icon={<TestTube className="h-6 w-6 text-purple-600" />}
              title="Test Before You Deploy"
              description="Run simulations in a sandbox environment to ensure your contracts work flawlessly."
            />
          </div>
        </section>

        {/* Who Is This For Section */}
        <section className=" p-8 rounded-xl" id="trans-bg">
          <h2 className="text-3xl font-bold mb-6">Who Is This For?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="h-6 w-6 text-green-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Beginners</span> – Learn blockchain development in a simple, guided way.
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-green-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Developers</span> – Speed up prototyping with AI assistance and live
                collaboration.
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-green-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Businesses</span> – Quickly deploy secure contracts without hiring
                expensive experts.
              </div>
            </li>
          </ul>
        </section>

        {/* Call to Action Section */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold">Join the Future of Smart Contract Development</h2>
          <p className="text-xl">
            i-contract empowers <strong>anyone</strong> to harness the power of blockchain—
            <strong>faster, smarter, and easier than ever before.</strong>
          </p>
          <div>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Start building for free today! <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow ">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">{icon}</div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 hover:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
