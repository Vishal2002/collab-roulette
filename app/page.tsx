import { auth } from '@clerk/nextjs/server'
import HomeClient from '@/components/HomeClient'

export default function Home() {
  const { userId } = auth()
  
  return <HomeClient userId={userId} />
}