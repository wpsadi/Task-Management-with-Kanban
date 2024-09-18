import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Navbar} from '@/components/components-navbar'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0">
      <Navbar />
      </div>
     
      <main className="flex-grow">
        <section className="py-20 px-6 text-black">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Task Management Dashboard with Kanban Board
            </h1>
            <p className="text-xl  mb-8">
              Streamline your workflow and boost productivity with our intuitive Kanban board system.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard 
                title="Visual Task Management" 
                description="Organize tasks into columns representing different stages of your workflow."
              />
              <FeatureCard 
                title="Drag and Drop" 
                description="Easily move tasks between columns as they progress."
              />
              {/* <FeatureCard 
                title="Collaboration" 
                description="Work together with your team in real-time on shared boards."
              /> */}
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  )
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}