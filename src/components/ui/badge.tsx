import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-lato transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/80 focus:ring-primary",
        secondary: "border-transparent bg-secondary text-white hover:bg-secondary/80 focus:ring-secondary",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
        outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
