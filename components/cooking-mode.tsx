"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react"

interface CookingModeProps {
  instructions: string
  prepTime: number | null
  cookTime: number | null
  onClose: () => void
}

export function CookingMode({ instructions, prepTime, cookTime, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const steps = instructions.split(/\n+/).filter((step) => step.trim().length > 0)

  useEffect(() => {
    if (timeRemaining === null || !isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = (minutes: number) => {
    setTimeRemaining(minutes * 60)
    setIsRunning(true)
  }

  const resetTimer = () => {
    setTimeRemaining(null)
    setIsRunning(false)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between bg-card">
        <h2 className="text-xl font-bold">Cooking Mode</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Timer Section */}
        {(prepTime || cookTime) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeRemaining !== null ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl font-bold font-mono">{formatTime(timeRemaining)}</div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRunning(!isRunning)}
                      disabled={timeRemaining === 0}
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetTimer}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  {timeRemaining === 0 && (
                    <div className="text-center text-lg font-semibold text-primary">Time's up! 🎉</div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {prepTime && (
                    <Button variant="outline" className="w-full justify-start" onClick={() => startTimer(prepTime)}>
                      Prep Timer: {prepTime} min
                    </Button>
                  )}
                  {cookTime && (
                    <Button variant="outline" className="w-full justify-start" onClick={() => startTimer(cookTime)}>
                      Cook Timer: {cookTime} min
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step {currentStep + 1} of {steps.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg leading-relaxed min-h-[200px]">{steps[currentStep]}</div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


