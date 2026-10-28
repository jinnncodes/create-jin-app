import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ModalProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose?: () => void
  /** When false, hide the top-right X and ignore backdrop/Escape close. Default true. */
  closeable?: boolean
  className?: string
  contentClassName?: string
}

/**
 * Shared create/add modal. Closeable modals always show a top-right X;
 * header uses pe-12 so the title does not sit under the control.
 */
export function Modal({
  open,
  title,
  children,
  onClose,
  closeable = true,
  className,
  contentClassName,
}: ModalProps) {
  if (!open) return null

  const handleClose = () => {
    if (closeable && onClose) onClose()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        className
      )}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={handleClose}
        disabled={!closeable}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-border bg-background text-foreground shadow-lg dark:border-border dark:bg-card dark:text-card-foreground',
          contentClassName
        )}
        onKeyDown={(event) => {
          if (event.key === 'Escape') handleClose()
        }}
      >
        <div className="relative border-b border-border px-4 py-3 pe-12 dark:border-border">
          <h2 id="modal-title" className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h2>
          {closeable ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 size-8 text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
