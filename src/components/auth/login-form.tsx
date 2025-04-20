import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, GithubIcon, SparklesIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/services/authService'
import { AppDispatch, RootState } from '@/store'
import { useNavigate } from 'react-router'
import { Magnetic } from '@/components/ui/magnetic'

interface LoginFormProps {
  className?: string
  [key: string]: any
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthLoading, isAuthError } = useSelector(
    (state: RootState) => state.auth
  )

  const springOptions = { bounce: 0.2 }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(loginUser({ email, password }))

    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = () => {
    navigate('/auth/reset-password')
  }

  return (
    <motion.form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='flex flex-col items-center gap-3 text-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SparklesIcon className='h-10 w-10 text-primary' />
        <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
          Welcome Back
        </h1>
        <p className='text-balance text-sm text-slate-400'>
          Sign in to your account to continue your journey
        </p>
      </motion.div>

      <div className='grid gap-6'>
        <motion.div
          className='grid gap-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Label htmlFor='email' className='text-secondary text-sm font-medium'>
            Email
          </Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email address'
            className='h-12 rounded-lg text-secondary'
            required
          />
        </motion.div>

        <motion.div
          className='grid gap-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className='flex items-center justify-between'>
            <Label htmlFor='password' className='text-secondary text-sm font-medium'>
              Password
            </Label>
            <motion.a
              onClick={handleForgotPassword}
              className='text-xs text-secondary hover:text-secondary/80 font-medium cursor-pointer'
              whileHover={{ scale: 1.05 }}
            >
              Forgot password?
            </motion.a>
          </div>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              className='h-12 rounded-lg pr-10 text-secondary'
              required
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 cursor-pointer'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className='h-5 w-5' />
              ) : (
                <EyeIcon className='h-5 w-5' />
              )}
            </button>
          </div>

          {isAuthError && (
            <motion.p
              className='text-sm text-rose-700 mt-1'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isAuthError}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Magnetic
            intensity={0.2}
            springOptions={springOptions}
            actionArea='global'
            range={200}
          >
            <Button
              type='submit'
              className='w-full h-12 text-base rounded-lg font-medium cursor-pointer'
              disabled={isAuthLoading}
            >
              <Magnetic
                intensity={0.1}
                springOptions={springOptions}
                actionArea='global'
                range={200}
              >
                {isAuthLoading ? (
                  <div className='flex items-center gap-2'>
                    <motion.div
                      className='h-5 w-5 border-2 border-white border-t-transparent rounded-full'
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: 'linear',
                      }}
                    />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Magnetic>
            </Button>
          </Magnetic>
        </motion.div>

        {/* <motion.div
          className='relative text-center'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-slate-200 dark:border-slate-700'></div>
          </div>
          <div className='relative flex justify-center text-xs'>
            <span className='bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
              or continue with
            </span>
          </div>
        </motion.div> */}

        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className='grid grid-cols-1 gap-4'
        >
          <Button
            variant='outline'
            className='w-full h-12 rounded-lg'
            type='button'
          >
            <GithubIcon className='h-5 w-5' />
            GitHub
          </Button>
        </motion.div> */}
      </div>

      <motion.div
        className='mt-2 text-center text-sm text-slate-400'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Don't have an account?{' '}
        <motion.a
          onClick={() => navigate('/register')}
          className='font-semibold text-primary hover:text-primary/80 cursor-pointer'
          whileHover={{ scale: 1.05 }}
        >
          Create one
        </motion.a>
      </motion.div>
    </motion.form>
  )
}
