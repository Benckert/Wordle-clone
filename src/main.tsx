import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { toast } from "sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Watch for toasts being added to the DOM and make them clickable
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        const toasts = node.querySelectorAll ? node.querySelectorAll('[data-sonner-toast]') : []
        const isToast = node.hasAttribute && node.hasAttribute('data-sonner-toast')
        
        const allToasts = isToast ? [node] : Array.from(toasts)
        
        allToasts.forEach((toastEl) => {
          toastEl.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            // Only dismiss if not clicking the close button
            if (!target.closest('[data-close-button]')) {
              toast.dismiss()
            }
          })
        })
      }
    })
  })
})

// Start observing after a brief delay to ensure React has mounted
setTimeout(() => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}, 100)
