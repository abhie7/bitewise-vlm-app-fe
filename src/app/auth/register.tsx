import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RegisterForm } from '@/components/auth/register-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useNavigate } from 'react-router'
import { PageTitle } from '@/components/ui/page-title'

export function RegisterPage() {
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthSuccess } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    setMounted(true)

    // Redirect if already logged in
    if (user && isAuthSuccess) {
      navigate('/dashboard')
    }
  }, [user, isAuthSuccess, navigate])

  if (!mounted) return null

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800'>
      <PageTitle title='Register' />
      <div className='grid min-h-screen lg:grid-cols-2'>
        {/* Left Side: Hero Image */}
        <div className='relative hidden overflow-hidden lg:block'>
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className='absolute inset-0'
          >
            <div className='absolute inset-0 bg-slate-800/40 z-10' />
            <div className='relative h-full w-full'>
              <div className='absolute inset-0 ' />
              <img
                src='https://images.unsplash.com/vector-1744384271002-ed577f272ed0?q=80&w=2496&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Healthy food'
                className='h-full w-full object-cover'
              />
            </div>
            <motion.div
              className='absolute bottom-10 left-10 z-20 max-w-md'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <h2 className='text-3xl font-bold text-white mb-4'>
                Start your nutrition journey
              </h2>
              <p className='text-lg text-white/90'>
                Create an account to track your meals and gain valuable insights
                about your diet.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Register Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col justify-between p-6 md:p-10 relative'
        >
          <div className='flex flex-1 items-center justify-center py-12 relative z-10'>
            <motion.div
              className='w-full max-w-md rounded-2xl p-8 backdrop-blur-sm shadow-xl bg-slate-800/80'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <RegisterForm />
            </motion.div>
          </div>

          <footer className='text-center text-sm text-slate-400 relative z-10'>
            <p>© 2025 Bitewise Inc. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}
