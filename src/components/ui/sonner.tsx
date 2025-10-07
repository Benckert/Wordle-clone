import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-md group-[.toaster]:cursor-pointer group-[.toaster]:pr-8",
          description: "group-[.toast]:text-gray-600",
          actionButton: "group-[.toast]:bg-gray-900 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900",
          closeButton:
            "!absolute !top-1/2 !-translate-y-1/2 !right-2 !left-auto !text-gray-400 hover:!text-gray-600 !bg-transparent !border-0",
          error:
            "group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-red-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
