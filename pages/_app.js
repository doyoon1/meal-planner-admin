import '@/styles/globals.css'
import './App.css'
import { SessionProvider } from "next-auth/react"

export default function App({Component, pageProps: { session, ...pageProps }}) 
  {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
    </SessionProvider>
  )
}