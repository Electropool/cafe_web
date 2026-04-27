"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface MenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  showChevron?: boolean
}

export function Menu({ trigger, children, align = "left", showChevron = true }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left z-50">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-flex items-center"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        {showChevron && (
          <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-9 focus:outline-none z-50`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  isActive?: boolean
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: MenuItemProps) {
  return (
    <button
      className={`relative block w-full h-12 md:h-16 text-center group transition-colors duration-200
        ${disabled ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" : "text-gray-600 dark:text-white"}
        ${isActive ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"}
      `}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center justify-center h-full">
        {icon && (
          <span className="h-5 w-5 md:h-6 md:w-6 transition-all duration-200 group-hover:[&_svg]:stroke-[2.5]">
            {icon}
          </span>
        )}
        {children}
      </span>
    </button>
  )
}

export function MenuContainer({ 
  children, 
  direction = "up", 
  triggerClassName = "bg-[#E5D3B3] dark:bg-[#D2B48C]" 
}: { 
  children: React.ReactNode, 
  direction?: "up" | "down",
  triggerClassName?: string 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const childrenArray = React.Children.toArray(children)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative w-[48px] md:w-[64px]" data-expanded={isExpanded}>
      {/* Container for all items */}
      <div className="relative flex flex-col items-center">
        {/* Other items - Rendered BEFORE the trigger if direction is 'up' */}
        {direction === "up" && childrenArray.slice(1).map((child, index) => {
          return (
            <div 
              key={index} 
              className="absolute w-12 h-12 md:w-16 md:h-16 bg-white/95 dark:bg-gray-900 will-change-transform rounded-full shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden"
              style={{
                bottom: 0,
                transform: `translateY(${isExpanded ? -(index + 1) * (70) : 0}px)`,
                opacity: isExpanded ? 1 : 0,
                zIndex: 40 - index,
                pointerEvents: isExpanded ? "auto" : "none",
                transition: `transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms`,
              }}
            >
              {childrenArray[index + 1]}
            </div>
          )
        })}

        {/* Trigger item */}
        <div 
          className={`relative w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full group z-50 shadow-2xl border border-black/10 flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${triggerClassName}`}
          onClick={handleToggle}
        >
          {childrenArray[0]}
        </div>

        {/* Downward items (original logic if needed) */}
        {direction === "down" && childrenArray.slice(1).map((child, index) => (
          <div 
            key={index} 
            className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-gray-900 will-change-transform rounded-full shadow-lg border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden"
            style={{
              transform: `translateY(${isExpanded ? (index + 1) * 70 : 0}px)`,
              opacity: isExpanded ? 1 : 0,
              zIndex: 40 - index,
              pointerEvents: isExpanded ? "auto" : "none",
              transition: `transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
