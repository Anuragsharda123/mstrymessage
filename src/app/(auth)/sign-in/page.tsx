'use client'
import { useSession, signOut, signIn } from 'next-auth/react'
import React from 'react'

const Component:React.FC = () => {
    const {data: session} = useSession();
    if (session) {
        return(
            <>
                Signed in as { session.user.email }
                <br />
                <button onClick={()=> signOut()}> Sign out</button>
            </>
        )
    }
  return (
    <>
        Not Signed in
        <br />
        <button className='bg-orange-500 px-3 py-1 m-4 rounded' onClick={()=> signIn()} >Sign in</button>
    </>
  )
}

export default Component;