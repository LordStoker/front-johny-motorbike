import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  return (
    <div className={isHomePage ? '' : 'pt-16'}>
      {children}
    </div>
  )
}