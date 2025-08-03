import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenTool,
  Search,
  Upload,
  RefreshCw,
  Share2,
  BookOpen,
  Users,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/50">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-violet-600/5 to-fuchsia-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full glassmorphism text-sm text-purple-600 font-medium shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Math Learning Platform
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
              Turn Handwritten Math into{" "}
              <span className="text-gradient relative">
                Shareable Exercises
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Upload your handwritten math problems, solve exercises from the
              community, and learn together through AI-powered text conversion
              and collaborative problem solving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="exercise-gradient text-white border-0 hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/submit">
                  <PenTool className="mr-2 h-5 w-5" />
                  Submit Exercise
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              >
                <Link href="/exercises">
                  <Search className="mr-2 h-5 w-5" />
                  Discover Exercises
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                <Target className="w-4 h-4 mr-2" />
                Discover & Learn
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Discover & Filter Exercises
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Browse through a vast collection of math exercises across
                different categories and difficulty levels. Use our advanced
                filters to find exactly what you&apos;re looking for, whether
                it&apos;s algebra, geometry, calculus, or statistics.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Filter by category, difficulty, and status
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Search exercises by keywords
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  View detailed solutions and explanations
                </li>
              </ul>
              <Button
                asChild
                className="exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/exercises">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Library
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Card className="exercise-card-hover glassmorphism shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Featured Exercise</span>
                    <span className="exercise-status-open text-xs px-3 py-1 rounded-full border">
                      Open
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">
                    Quadratic Equation Solving
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Solve the quadratic equation: x² - 5x + 6 = 0. Show all
                    steps in your solution.
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="exercise-level-intermediate px-3 py-1 rounded-full border">
                      Intermediate
                    </span>
                    <span>Algebra</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solve Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="exercise-card-hover glassmorphism shadow-xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border-2 border-dashed border-purple-200 flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">
                          Upload or Draw
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 p-3 bg-emerald-50 rounded border border-emerald-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-800">
                          AI Converted:
                        </span>
                      </div>
                      &quot;Solve the equation: 2x + 5 = 13&quot;
                    </div>
                    <Button className="w-full exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      Submit Solution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Solutions
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Submit Solutions with AI
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload images of your handwritten solutions or draw directly in
                your browser. Our AI technology converts your handwriting to
                editable text, making it easy to share and collaborate on math
                problems.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Upload photos or draw in-browser
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  AI-powered text conversion
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Edit and refine before submission
                </li>
              </ul>
              <Button
                asChild
                className="exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/submit">
                  <PenTool className="mr-2 h-4 w-4" />
                  Start Solving
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps and join our growing community
              of math enthusiasts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center exercise-card-hover glassmorphism shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 exercise-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  1. Upload
                </h3>
                <p className="text-slate-600">
                  Take a photo of your handwritten math problem or draw directly
                  using our in-browser tools.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center exercise-card-hover glassmorphism shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 exercise-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  2. Convert
                </h3>
                <p className="text-slate-600">
                  Our AI technology converts your handwriting to editable text
                  that you can review and modify.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center exercise-card-hover glassmorphism shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 exercise-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  3. Share
                </h3>
                <p className="text-slate-600">
                  Submit your exercise or solution to the community and help
                  others learn math concepts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 exercise-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students and educators who are already using
            Integral to enhance their math learning experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-slate-900 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/submit">
                <PenTool className="mr-2 h-5 w-5" />
                Submit Your First Exercise
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/exercises">
                <Users className="mr-2 h-5 w-5" />
                Join the Community
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
