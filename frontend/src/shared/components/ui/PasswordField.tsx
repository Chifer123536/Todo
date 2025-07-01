import React, {
  useState,
  forwardRef,
  InputHTMLAttributes,
  CSSProperties
} from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/shared/utils"

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ placeholder = "Enter password", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const toggleVisibility = () => setShowPassword((v) => !v)

    // Глаз светлый, когда пароль виден, и серый — когда скрыт
    const baseColor = showPassword
      ? "var(--eye-color)"
      : "var(--eye-color-muted)"
    const baseFilter = "drop-shadow(var(--eye-shadow))"
    const hoverFilter =
      "drop-shadow(var(--eye-shadow)) drop-shadow(0 0 6px var(--primary-foreground))"

    const buttonStyle: CSSProperties = {
      color: baseColor,
      filter: isHovered ? hoverFilter : baseFilter,
      transition: "filter 0.3s ease, color 0.3s ease",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }

    return (
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          ref={ref}
          {...props}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
              "ring-offset-background placeholder:text-muted-foreground " +
              "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
            className
          )}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(false)}
          onMouseLeave={() => setIsHovered(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    )
  }
)

PasswordField.displayName = "PasswordField"
