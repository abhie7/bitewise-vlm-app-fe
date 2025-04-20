import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, GithubIcon, SparklesIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from '@/services/authService'
import { AppDispatch, RootState } from '@/store'
import { useNavigate } from 'react-router'
import { Magnetic } from '@/components/ui/magnetic'

interface RegisterFormProps {
  className?: string
  [key: string]: any
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthLoading, isAuthError } = useSelector(
    (state: RootState) => state.auth
  )

  const springOptions = { bounce: 0.2 }

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(createUser({ email, password, userName }))

    if (createUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
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
        <motion.a
          href='/'
          className='flex items-center gap-3 font-medium text-white'
          whileHover={{ scale: 1.05 }}
        >
          <Magnetic
            intensity={0.5}
            springOptions={springOptions}
            actionArea='global'
            range={200}
          >
            <div className='h-12 w-12 flex items-center justify-center '>
              <img
                src='/favBlur.svg'
                alt='Logo'
              />
            </div>
          </Magnetic>
        </motion.a>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
          Bitewise Inc.
        </h1>
        <p className='text-balance text-sm text-slate-400'>
          Join us and start your nutrition journey today
        </p>
      </motion.div>

      <div className='grid gap-5'>
        <motion.div
          className='grid gap-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Label htmlFor='userName' className='text-sm font-medium text-secondary'>
            Username
          </Label>
          <Input
            id='userName'
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Choose a username'
            className='h-12 rounded-lg text-secondary'
            required
          />
        </motion.div>

        <motion.div
          className='grid gap-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Label htmlFor='email' className='text-sm font-medium text-secondary'>
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
          <Label htmlFor='password' className='text-sm font-medium text-secondary'>
            Password
          </Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder='Create a strong password'
              onChange={(e) => setPassword(e.target.value)}
              className='h-12 rounded-lg pr-10 text-secondary'
              required
              minLength={6}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer'
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
              className='text-sm text-rose-500 mt-1'
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
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
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
              or sign up with
            </span>
          </div>
        </motion.div>

        <motion.div
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
            <GithubIcon className='h-5 w-5 mr-2' />
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
        Already have an account?{' '}
        <motion.a
          onClick={() => navigate('/login')}
          className='font-semibold text-primary hover:text-primary/80 cursor-pointer'
          whileHover={{ scale: 1.05 }}
        >
          Sign in
        </motion.a>
      </motion.div>
    </motion.form>
  )
}
