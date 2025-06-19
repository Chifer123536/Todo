import { toast } from "sonner"
import { AxiosError } from "axios"

export function toastMessageHandler(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data === "object" && data !== null && "message" in data) {
      const message = Array.isArray(data.message)
        ? data.message.join(" ")
        : String(data.message)

      toast.error(message)
    } else {
      toast.error(error.message)
    }
    return
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  toast.error("Unknown error occurred")
}

function isAxiosError(err: unknown): err is AxiosError {
  return typeof err === "object" && err !== null && "isAxiosError" in err
}
