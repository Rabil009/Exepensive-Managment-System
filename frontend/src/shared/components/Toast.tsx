type ToastProps = {
  message: string;
  onDismiss: () => void;
  dismissLabel?: string;
};
export function Toast({
  message,
  onDismiss,
  dismissLabel = "Dismiss",
}: ToastProps) {
  if (!message) return null;
  return (
    <div className="aura-toast" role="status">
      {message}
      <button type="button" aria-label={dismissLabel} onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}
