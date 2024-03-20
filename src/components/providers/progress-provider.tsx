"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

const ProgressProvider = () => {
  return (
    <ProgressBar
      height="3px"
      color="#0DE0F8"
      options={{ showSpinner: false }}
      shallowRouting
      delay={500}
    />
  )
}

export default ProgressProvider
