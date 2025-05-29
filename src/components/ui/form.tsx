import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormField.displayName = "FormField"

interface FormLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FormLabelProps
>(({ className, required, children, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn("block text-sm font-medium text-gray-700 font-lato", className)}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </Label>
))
FormLabel.displayName = "FormLabel"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "error" | "success";
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "text-gray-600",
      error: "text-red-600",
      success: "text-green-600"
    };

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-lato",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500 font-lato", className)}
      {...props}
    />
  )
)
FormDescription.displayName = "FormDescription"

export {
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
}
