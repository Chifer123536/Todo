// frontend/src/app/head.tsx
export default function Head() {
  return (
    <>
      {/* Основные мета */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" sizes="32x32" />

      {/* Title и описание */}
      <title>Todo App – Manage Your Tasks</title>
      <meta name="description" content="Todo App on React/Next.js." />
      <link rel="canonical" href="https://yourdomain.com/" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Todo App – Manage Your Tasks" />
      <meta property="og:description" content="Todo App on React/Next.js" />
      <meta property="og:url" content="https://yourdomain.com/" />
      <meta
        property="og:image"
        content="https://yourdomain.com/og-default.png"
      />
    </>
  )
}
