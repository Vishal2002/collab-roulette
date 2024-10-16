//@ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { supabase } from "@/utils/supabase"

export default function StreamPage() {
  const { data: session } = useSession()
  const [partnerStream, setPartnerStream] = useState(null)

  useEffect(() => {
    if (session) {
      supabase
        .from('available_streamers')
        .upsert({ user_id: session.user.id, username: session.user.name })
    }
    return () => {
     
      if (session) {
        supabase
          .from('available_streamers')
          .delete()
          .match({ user_id: session.user.id })
      }
    }
  }, [session])

  const rollForPartner = async () => {
    if (!session) return

    const { data, error } = await supabase
      .from('available_streamers')
      .select('username')
      .neq('user_id', session.user.id)
      .order('RANDOM()')
      .limit(1)
      .single()

    if (error) {
      console.error('Error finding partner:', error)
      return
    }

    if (data) {
      setPartnerStream(`https://player.twitch.tv/?channel=${data.username}&parent=localhost`)
    } else {
      alert('No available partners at the moment. Try again later!')
    }
  }


}