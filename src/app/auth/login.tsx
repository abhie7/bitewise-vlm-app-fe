import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from '@/components/auth/login-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useNavigate } from 'react-router'
import { Magnetic } from '@/components/ui/magnetic'

export function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthSuccess } = useSelector((state: RootState) => state.auth)

  const springOptions = { bounce: 0.2 }

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
      <AnimatePresence mode="wait">
        <div className='grid min-h-screen lg:grid-cols-2'>
          {/* Left Side: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, x: -20 }}
            className='flex flex-col justify-between p-6 md:p-10 relative'
          >
            <nav className='relative z-10'>
              <motion.a
                href='/'
                className='flex items-center gap-3 font-medium text-white'
                whileHover={{ scale: 1.05 }}
                // transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Magnetic
                  intensity={0.5}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center gap-4'>
                      <img
                        src='/favBlur.svg'
                        alt='Logo'
                        className='h-full w-full shadow-md'
                      />
                    </div>
                    <span className='text-lg font-bold'>Bitewise Inc.</span>
                  </div>
                </Magnetic>
              </motion.a>
            </nav>

            <div className='flex flex-1 items-center justify-center py-12 relative z-10'>
              <motion.div
                className='w-full max-w-md rounded-2xl p-8 backdrop-blur-sm shadow-xl bg-slate-800/80'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <LoginForm />
              </motion.div>
            </div>

            <footer className='text-center text-sm  text-slate-400 relative z-10'>
              <p>© 2025 Bitewise Inc. All rights reserved.</p>
            </footer>
          </motion.div>

          {/* Right Side: Hero Image */}
          <div className='relative hidden overflow-hidden lg:block'>
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className='absolute inset-0'
            >
              <div className='absolute inset-0 bg-black/40 z-10' />
              <div className='relative h-full w-full'>
                <div className='absolute inset-0 ' />
                <img
                  src='https://images.unsplash.com/photo-1732055351205-e40508e62bdd?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  alt='Workspace with laptop and coffee'
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
                  Transform your workflow
                </h2>
                <p className='text-lg text-white/90'>
                  Join thousands of teams building better products with Bitewise
                  tools.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </div>
  )
}
