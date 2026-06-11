
export default function ForbiddenPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: 'sans-serif',
      color: 'white',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '48px',
        border: '1px solid #222',
        borderRadius: '12px',
        background: '#111',
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 8px' }}>403</h1>
        <p style={{ color: '#888', margin: '0 0 32px' }}>
          You don't have permission to access this page.
        </p>
        <a href="/" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'white',
          color: 'black',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}>
          Go back home
        </a>
      </div>
    </div>
  )
}