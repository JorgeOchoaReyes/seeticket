import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Smartphone,
  Tablet,
  FolderSyncIcon as Sync,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  Star,
  ChefHat,
  Heart,
  Home,
  Users,
  Clock,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden"> 
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <Link href="/" className="flex items-center justify-center group">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Sync className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-180" />
            </div>
            <span className="font-bold text-xl transition-colors duration-300 group-hover:text-blue-600">SeeTicket</span>
          </div>
        </Link>
 
        <nav className="ml-auto hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="#use-cases"
            className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
          >
            Use Cases
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
 
        <Button
          variant="ghost"
          size="icon"
          className="ml-4 md:hidden transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
 
        <div
          className={`absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b md:hidden transition-all duration-300 ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col gap-4 p-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#use-cases"
              className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1"> 
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div
                className={`flex flex-col justify-center space-y-6 transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="space-y-4">
                  <Badge
                    variant="secondary"
                    className="w-fit animate-pulse hover:scale-105 transition-transform duration-300"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Real-time Sync
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none leading-tight">
                    Create Tasks on Your Phone,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
                      View Anywhere
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 text-lg md:text-xl leading-relaxed">
                    Perfect for restaurants, healthcare professionals, and personal productivity. Create tasks instantly
                    on your phone and watch them appear on any tablet, anywhere in the world.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: ChefHat, label: "Restaurants" },
                    { icon: Heart, label: "Healthcare" },
                    { icon: Home, label: "Personal" },
                  ].map((item, index) => (
                    <Badge
                      key={item.label}
                      variant="outline"
                      className={`flex items-center gap-1 hover:scale-105 transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={async () => {
                      await router.push("/dashboard");
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-blue-50"
                  >
                    Watch Demo
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                  {["Free 14-day trial", "No credit card required"].map((text, index) => (
                    <div
                      key={text}
                      className={`flex items-center gap-1 transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
 
              <div
                className={`flex items-center justify-center transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="relative w-full max-w-lg"> 
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl animate-pulse"></div>
 
                  <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                    <div className="flex items-center justify-between"> 
                      <div className="flex flex-col items-center space-y-3 group">
                        <div className="w-16 md:w-20 h-28 md:h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl relative overflow-hidden shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                          <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-lg p-2">
                            <div className="text-xs font-medium text-gray-800 mb-2">New Task</div>
                            <div className="space-y-1">
                              <div className="h-1.5 bg-blue-200 rounded animate-pulse"></div>
                              <div
                                className="h-1.5 bg-blue-200 rounded w-3/4 animate-pulse"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="h-1.5 bg-blue-600 rounded w-1/2 animate-pulse"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                            <div className="mt-2 h-3 bg-blue-600 rounded text-white text-[6px] flex items-center justify-center transition-all duration-300 hover:bg-blue-700 cursor-pointer">
                              Send
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors duration-300 group-hover:text-blue-600">
                          <Smartphone className="w-3 h-3" />
                          Create
                        </div>
                      </div>
 
                      <div className="flex flex-col items-center space-y-2 px-2 md:px-4">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                              style={{
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: "1s",
                              }}
                            ></div>
                          ))}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 animate-pulse" />
                        <div className="text-xs text-gray-500 font-medium">Sync</div>
                      </div>
 
                      <div className="flex flex-col items-center space-y-3 group">
                        <div className="w-24 md:w-28 h-16 md:h-20 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg relative overflow-hidden shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2">
                          <div className="absolute top-1 left-1 right-1 bottom-1 bg-white rounded p-2">
                            <div className="text-[8px] font-medium text-gray-800 mb-1">Task Dashboard</div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="space-y-0.5">
                                <div className="h-1 bg-green-200 rounded animate-pulse"></div>
                                <div
                                  className="h-1 bg-blue-200 rounded animate-pulse"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="h-1 bg-purple-600 rounded animate-pulse"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <div className="space-y-0.5">
                                <div
                                  className="h-1 bg-yellow-200 rounded animate-pulse"
                                  style={{ animationDelay: "0.3s" }}
                                ></div>
                                <div
                                  className="h-1 bg-red-200 rounded animate-pulse"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                                <div
                                  className="h-1 bg-green-600 rounded animate-pulse"
                                  style={{ animationDelay: "0.5s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors duration-300 group-hover:text-purple-600">
                          <Tablet className="w-3 h-3" />
                          Display
                        </div>
                      </div>
                    </div>
 
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full transition-all duration-300 hover:bg-green-100 hover:scale-105">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        Live Sync Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
 
        <section id="use-cases" className="w-full py-12 md:py-20 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Built for Real-World Scenarios
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you{"\'"}re running a restaurant, working in healthcare, or managing personal tasks, SeeTicket
                  adapts to your workflow.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  icon: ChefHat,
                  title: "Restaurant Operations",
                  description:
                    "Servers create orders and special requests on their phones. Kitchen staff see everything instantly on tablet displays. Perfect for order management, inventory alerts, and shift coordination.",
                  color: "orange",
                  features: [
                    "Order tracking & kitchen display",
                    "Inventory management alerts",
                    "Staff shift coordination",
                  ],
                },
                {
                  icon: Heart,
                  title: "Healthcare & Nursing",
                  description:
                    "Nurses log patient care tasks on mobile devices. Charge nurses and doctors view patient status on ward tablets. Ensure critical care coordination and medication tracking.",
                  color: "red",
                  features: ["Patient care coordination", "Medication reminders", "Shift handoff notes"],
                },
                {
                  icon: Home,
                  title: "Personal & Family",
                  description:
                    "Create shopping lists, chores, and reminders on your phone. Family members see updates on the kitchen tablet. Perfect for household management and family coordination.",
                  color: "blue",
                  features: ["Shopping lists & groceries", "Household chores & schedules", "Family event planning"],
                },
              ].map((useCase, index) => (
                <Card
                  key={useCase.title}
                  className={`relative overflow-hidden border-${useCase.color}-200 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer transform-gpu`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: isVisible ? "slideInUp 0.6s ease-out forwards" : "none",
                  }}
                >
                  <CardHeader className="transition-all duration-300 group-hover:translate-y-[-2px]">
                    <div
                      className={`w-12 h-12 bg-${useCase.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <useCase.icon className={`w-6 h-6 text-${useCase.color}-600`} />
                    </div>
                    <CardTitle
                      className={`text-${useCase.color}-800 transition-colors duration-300 group-hover:text-${useCase.color}-600`}
                    >
                      {useCase.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{useCase.description}</CardDescription>
                    <div className="pt-4 space-y-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <div
                          key={feature}
                          className={`flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                          }`}
                          style={{ transitionDelay: `${index * 200 + featureIndex * 100 + 400}ms` }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
 
        <section id="features" className="w-full py-12 md:py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Powerful Features for Every Environment
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Professional-grade features designed for high-pressure environments and everyday productivity.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  icon: Clock,
                  title: "Instant Sync",
                  description:
                    "Tasks appear on tablets within milliseconds of creation. Critical for time-sensitive environments like restaurants and hospitals.",
                  color: "blue",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description:
                    "Multiple team members can create and view tasks simultaneously. Perfect for shift work and team coordination.",
                  color: "purple",
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description:
                    "Enterprise-grade security with 99.9% uptime. HIPAA compliant for healthcare environments and secure for all industries.",
                  color: "green",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Optimized",
                  description:
                    "Lightning-fast mobile interface designed for busy professionals. Voice-to-text, quick templates, and one-handed operation.",
                  color: "orange",
                },
                {
                  icon: Tablet,
                  title: "Large Display Ready",
                  description:
                    "Beautiful, organized displays optimized for tablets and large screens. Easy to read from across the room.",
                  color: "red",
                },
                {
                  icon: Zap,
                  title: "Smart Prioritization",
                  description:
                    "AI-powered priority detection and urgent task highlighting. Never miss critical tasks in fast-paced environments.",
                  color: "indigo",
                },
              ].map((feature, index) => (
                <Card
                  key={feature.title}
                  className="relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer transform-gpu"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? "slideInUp 0.6s ease-out forwards" : "none",
                  }}
                >
                  <CardHeader className="transition-all duration-300 group-hover:translate-y-[-2px]">
                    <div
                      className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <CardTitle className="transition-colors duration-300 group-hover:text-blue-600">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
 
        <section id="how-it-works" className="w-full py-12 md:py-20 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started in three simple steps and transform your workflow in minutes.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  number: 1,
                  title: "Create on Mobile",
                  description:
                    "Open the app on your phone and create tasks instantly. Add details, set priorities, assign team members, and categorize as needed.",
                  gradient: "from-blue-600 to-purple-600",
                },
                {
                  number: 2,
                  title: "Instant Sync",
                  description:
                    "Your tasks automatically sync across all connected devices in real-time. No delays, no manual refresh - just instant updates.",
                  gradient: "from-purple-600 to-pink-600",
                },
                {
                  number: 3,
                  title: "View & Manage",
                  description:
                    "Access your organized dashboard on any tablet or large screen. Perfect for kitchens, nursing stations, or family command centers.",
                  gradient: "from-pink-600 to-red-600",
                },
              ].map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-center space-y-4 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold transition-colors duration-300 hover:text-blue-600">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
 
        <section className="w-full py-12 md:py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Professionals
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From busy restaurants to critical care units, professionals rely on SeeTicket for seamless
                  coordination.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  rating: 5,
                  text: "SeeTicket transformed our restaurant operations. Servers input orders on their phones, and our kitchen staff see everything instantly on the tablet. Order accuracy improved 40%.",
                  author: "Maria Rodriguez",
                  role: "Restaurant Manager, Bella Vista",
                },
                {
                  rating: 5,
                  text: "As a charge nurse, having real-time updates from our floor staff on the ward tablet is game-changing. Patient care coordination has never been smoother.",
                  author: "Jennifer Chen, RN",
                  role: "Charge Nurse, Metro General Hospital",
                },
                {
                  rating: 5,
                  text: "Perfect for our family! I add grocery items while commuting, and my spouse sees the updated list on our kitchen tablet. No more forgotten items or duplicate shopping.",
                  author: "David Thompson",
                  role: "Family Organizer",
                },
              ].map((testimonial, index) => (
                <Card
                  key={testimonial.author}
                  className={`transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer transform-gpu ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <CardHeader className="transition-all duration-300 group-hover:translate-y-[-2px]">
                    <div className="flex items-center gap-1 mb-2">
                      {[...new Array(testimonial.rating) as number[]].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                    <CardDescription className="leading-relaxed text-gray-700">{"\""}{testimonial.text}{"\""}</CardDescription>
                    <div className="pt-4">
                      <p className="font-semibold transition-colors duration-300 group-hover:text-blue-600">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
 
        <section className="w-full py-12 md:py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="max-w-[600px] text-blue-100 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join others using SeeTicket for seamless
                  coordination.
                </p>
              </div>
              <div className="w-full max-w-md space-y-3">
                <form className="flex flex-col sm:flex-row gap-3"> 
                  <Button
                    type="submit"
                    variant="secondary"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={async () => {
                      await router.push("/dashboard");
                    }}
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-blue-100">Free 14-day trial. No credit card required. HIPAA compliant.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
 
      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-gray-600">© 2024 SeeTicket. All rights reserved.</p>
        <nav className="sm:ml-auto flex flex-wrap gap-4 sm:gap-6">
          {["Terms of Service", "Privacy Policy", "HIPAA Compliance", "Contact"].map((link) => (
            <Link
              key={link}
              href="#"
              className="text-xs hover:underline underline-offset-4 text-gray-600 transition-all duration-300 hover:text-blue-600 hover:scale-105"
            >
              {link}
            </Link>
          ))}
        </nav>
      </footer>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
