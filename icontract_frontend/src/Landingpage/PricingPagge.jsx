import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose the plan that's right for you and start building smart contracts today.
        </p>
      </div>

      <Tabs defaultValue="monthly" className="w-full mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="w-full">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              description="Perfect for beginners and individual projects"
              price="$5"
              period="per month"
              features={[
                "Up to 3 smart contracts",
                "Basic contract templates",
                "Testnet deployments",
                "Community support",
                "Drag-and-drop builder",
              ]}
              limitations={["No mainnet deployments", "No collaboration features", "Limited AI assistance"]}
              buttonText="Get Started"
              buttonVariant="outline"
            />

            <PricingCard
              title="Pro"
              description="Ideal for developers and small teams"
              price="$10"
              period="per month"
              features={[
                "Unlimited smart contracts",
                "Advanced contract templates",
                "Testnet & mainnet deployments",
                "Email support",
                "Drag-and-drop builder",
                "Advanced mode (code editor)",
                "2 team members",
                "Enhanced AI assistance",
              ]}
              limitations={["Limited collaboration history"]}
              buttonText="Upgrade to Pro"
              buttonVariant="default"
              highlighted={true}
            />

            <PricingCard
              title="Enterprise"
              description="For businesses and larger teams"
              price="$15"
              period="per month"
              features={[
                "Unlimited smart contracts",
                "Premium contract templates",
                "Multi-chain deployments",
                "Priority support",
                "Drag-and-drop builder",
                "Advanced mode (code editor)",
                "Unlimited team members",
                "Full AI assistance",
                "Audit preparation tools",
                "Custom contract libraries",
                "API access",
              ]}
              limitations={[]}
              buttonText="Contact Sales"
              buttonVariant="outline"
            />
          </div>
        </TabsContent>

        <TabsContent value="annually" className="w-full">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              description="Perfect for beginners and individual projects"
              price="$48"
              period="per year"
              features={[
                "Up to 3 smart contracts",
                "Basic contract templates",
                "Testnet deployments",
                "Community support",
                "Drag-and-drop builder",
              ]}
              limitations={["No mainnet deployments", "No collaboration features", "Limited AI assistance"]}
              buttonText="Get Started"
              buttonVariant="outline"
              discount="Save $12"
            />

            <PricingCard
              title="Pro"
              description="Ideal for developers and small teams"
              price="$96"
              period="per year"
              features={[
                "Unlimited smart contracts",
                "Advanced contract templates",
                "Testnet & mainnet deployments",
                "Email support",
                "Drag-and-drop builder",
                "Advanced mode (code editor)",
                "2 team members",
                "Enhanced AI assistance",
              ]}
              limitations={["Limited collaboration history"]}
              buttonText="Upgrade to Pro"
              buttonVariant="default"
              highlighted={true}
              discount="Save $24"
            />

            <PricingCard
              title="Enterprise"
              description="For businesses and larger teams"
              price="$144"
              period="per year"
              features={[
                "Unlimited smart contracts",
                "Premium contract templates",
                "Multi-chain deployments",
                "Priority support",
                "Drag-and-drop builder",
                "Advanced mode (code editor)",
                "Unlimited team members",
                "Full AI assistance",
                "Audit preparation tools",
                "Custom contract libraries",
                "API access",
              ]}
              limitations={[]}
              buttonText="Contact Sales"
              buttonVariant="outline"
              discount="Save $36"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 font-medium">Feature</th>
                <th className="text-center py-4 px-6 font-medium">Basic</th>
                <th className="text-center py-4 px-6 font-medium">Pro</th>
                <th className="text-center py-4 px-6 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow feature="Price" basic="$5/month" pro="$10/month" enterprise="$15/month" />
              <ComparisonRow feature="Smart Contracts" basic="Up to 3" pro="Unlimited" enterprise="Unlimited" />
              <ComparisonRow
                feature="Deployments"
                basic="Testnet only"
                pro="Testnet & Mainnet"
                enterprise="Multi-chain"
              />
              <ComparisonRow feature="Team Members" basic="1" pro="2" enterprise="Unlimited" />
              <ComparisonRow feature="Drag-and-Drop Builder" basic={true} pro={true} enterprise={true} />
              <ComparisonRow feature="Advanced Mode (Code)" basic={false} pro={true} enterprise={true} />
              <ComparisonRow feature="AI Assistance" basic="Basic" pro="Enhanced" enterprise="Full" />
              <ComparisonRow feature="Support" basic="Community" pro="Email" enterprise="Priority" />
              <ComparisonRow feature="Audit Preparation" basic={false} pro={false} enterprise={true} />
              <ComparisonRow feature="API Access" basic={false} pro={false} enterprise={true} />
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16 text-center p-8 rounded-xl" id="trans-bg">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          We offer custom solutions for large enterprises and specialized use cases. Contact our sales team to discuss
          your specific requirements.
        </p>
        <Button size="lg" className="bg-purple-600">Contact Sales</Button>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  description,
  price,
  period,
  features,
  limitations,
  buttonText,
  buttonVariant,
  highlighted = false,
  discount = null,
}) {
  return (
    <Card className={`flex flex-col h-full ${highlighted ? "border-purple-600 shadow-lg" : "border-gray-200"}`}>
      {highlighted && <div className="bg-purple-600 text-white text-center py-2 text-sm font-medium">MOST POPULAR</div>}
      <CardHeader className={highlighted ? "pt-6" : ""}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400 ml-2">{period}</span>
          {discount && (
            <div className="mt-2">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                {discount}
              </span>
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className="mb-6">
            <p className="font-medium mb-2">Included:</p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {limitations.length > 0 && (
          <div>
            <p className="font-medium mb-2">Not included:</p>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${highlighted ? "bg-purple-600 hover:bg-purple-700" : ""}`} variant={buttonVariant}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ComparisonRow({ feature, basic, pro, enterprise }) {
  const renderCell = (value) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      )
    }
    return value
  }

  return (
    <tr className="border-b">
      <td className="py-4 px-6 font-medium">{feature}</td>
      <td className="text-center py-4 px-6">{renderCell(basic)}</td>
      <td className="text-center py-4 px-6 "  id="trans-bg">{renderCell(pro)}</td>
      <td className="text-center py-4 px-6">{renderCell(enterprise)}</td>
    </tr>
  )
}
