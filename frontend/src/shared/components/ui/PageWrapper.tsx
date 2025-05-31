interface PageWrapperProps {
  title?: string | null
  children: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  children
}) => {
  const pageTitle = title ?? "Todo App"

  return (
    <>
      <h1 className="sr-only">{pageTitle}</h1>
      {children}
    </>
  )
}
