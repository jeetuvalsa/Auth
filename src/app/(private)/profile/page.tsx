"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetUserQuery } from '@/store/services/auth'
import { toast } from 'react-hot-toast'
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Profile = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { data, isLoading } = useGetUserQuery()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container h-screen flex items-center justify-center mx-auto p-6">

<Card className="w-full max-w-md flex flex-col items-center justify-center">
  <CardHeader>
    <CardTitle>Profile</CardTitle>
    <CardDescription>Welcome to your profile</CardDescription>
  </CardHeader>
  <CardContent>
      <h4 className="text-lg font-bold mb-4"><span className="text-gray-500">Name:</span> {data?.user.name}</h4>
      <h4 className="text-lg font-bold mb-4"><span className="text-gray-500">Email:</span> {data?.user.email}</h4>
  </CardContent>
  <CardFooter>
    <Button onClick={handleLogout}>Logout</Button>
  </CardFooter>
</Card>
      
    </div>
  )
}

export default Profile