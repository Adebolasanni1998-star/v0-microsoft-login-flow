"use client"

import { useState } from "react"

export function useSignInFlow() {
  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")

  const handleNext = (inputEmail: string) => {
    setEmail(inputEmail)
    setStep("password")
  }

  const handleBackToEmail = () => {
    setStep("email")
  }

  return {
    step,
    email,
    handleNext,
    handleBackToEmail,
  }
}
