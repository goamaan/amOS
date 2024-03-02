"use client"

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react"

interface NavigationContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalNavigationContext = createContext<
  NavigationContextType | undefined
>(undefined)

export const useGlobalNavigation = (): NavigationContextType => {
  const context = useContext(GlobalNavigationContext)
  if (!context) {
    throw new Error(
      "useGlobalNavigation must be used within a GlobalNavigationProvider",
    )
  }
  return context
}

interface GlobalNavigationProviderProps {
  children: ReactNode
}

export const GlobalNavigationProvider: React.FC<
  GlobalNavigationProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <GlobalNavigationContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </GlobalNavigationContext.Provider>
  )
}
