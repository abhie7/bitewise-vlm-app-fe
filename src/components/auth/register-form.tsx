import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, ArrowRight, CheckCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { createUser } from '@/services/authService'
import { useNavigate } from 'react-router'
import { Magnetic } from '@/components/ui/magnetic'
import AvatarPicker from '@/components/ui/avatar-picker'
import { useAppDispatch, RootState } from '@/services/store'

interface RegisterFormProps {
  className?: string
  [key: string]: any
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthLoading, isAuthError } = useSelector(
    (state: RootState) => state.auth
  )

  const springOptions = { bounce: 0.2 }

  // Form state
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Add state for selected avatar
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null)

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    userName: '',
    email: '',
    password: '',
  })

  // Carousel state
  const [currentStep, setCurrentStep] = useState(1)
  const [isFirstStepValid, setIsFirstStepValid] = useState(false)

  // Validate first step fields
  useEffect(() => {
    const isUserNameValid = userName.trim().length >= 3
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email)
    const isPasswordValid = password.length >= 6

    setIsFirstStepValid(isUserNameValid && isEmailValid && isPasswordValid)

    // Update form errors
    setFormErrors({
      userName: isUserNameValid ? '' : 'Username must be at least 3 characters',
      email: isEmailValid ? '' : 'Please enter a valid email address',
      password: isPasswordValid ? '' : 'Password must be at least 6 characters',
    })
  }, [userName, email, password])

  const handleNextStep = () => {
    if (isFirstStepValid) {
      setCurrentStep(2)
    } else {
      // Force display validation errors
      const newErrors = {
        userName:
          userName.trim().length < 3
            ? 'Username must be at least 3 characters'
            : '',
        email: !/^\S+@\S+\.\S+$/.test(email)
          ? 'Please enter a valid email address'
          : '',
        password:
          password.length < 6 ? 'Password must be at least 6 characters' : '',
      }
      setFormErrors(newErrors)
    }
  }

  const handleBackStep = () => {
    setCurrentStep(1)
  }

  // Handle avatar selection
  const handleAvatarChange = (avatar: any) => {
    setSelectedAvatar(avatar)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Extract avatar data for submission
    const avatarData = selectedAvatar
      ? {
          id: selectedAvatar.id,
          avatarData: selectedAvatar.avatarData,
        }
      : null

    // Include avatar data in user creation
    const result = await dispatch(
      createUser({
        email,
        password,
        userName,
        avatar: avatarData,
      })
    )

    if (createUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  // Animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
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
      <div className='grid gap-5 relative overflow-hidden'>
        <AnimatePresence custom={currentStep === 1 ? 1 : -1} initial={false}>
          {currentStep === 1 && (
            <motion.div
              className='grid gap-5'
              key='step1'
              custom={1}
              variants={pageVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={pageTransition}
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
                      <img src='/favicon.svg' alt='Logo' />
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

              <motion.div
                className='grid gap-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Label
                  htmlFor='userName'
                  className='text-sm font-medium text-secondary'
                >
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
                {formErrors.userName && (
                  <motion.p
                    className='text-xs text-rose-500 mt-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formErrors.userName}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className='grid gap-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-secondary'
                >
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
                {formErrors.email && (
                  <motion.p
                    className='text-xs text-rose-500 mt-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className='grid gap-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-secondary'
                >
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
                {formErrors.password && (
                  <motion.p
                    className='text-xs text-rose-500 mt-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formErrors.password}
                  </motion.p>
                )}

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
                    type='button'
                    onClick={handleNextStep}
                    className='w-full h-12 text-base rounded-lg font-medium cursor-pointer'
                    disabled={!isFirstStepValid}
                  >
                    <Magnetic
                      intensity={0.1}
                      springOptions={springOptions}
                      actionArea='global'
                      range={200}
                    >
                      <div className='flex items-center gap-2'>
                        Next <ArrowRight className='h-4 w-4' />
                      </div>
                    </Magnetic>
                  </Button>
                </Magnetic>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              className='grid gap-5'
              key='step2'
              custom={-1}
              variants={pageVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={pageTransition}
            >
              <motion.div
                className='text-center mb-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <motion.div
                  className='inline-flex items-center justify-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-primary/20 text-primary'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  <CheckCircle className='h-4 w-4' />
                  <span className='text-xs font-medium'>Almost there!</span>
                </motion.div>
                <h2 className='text-xl font-bold text-white mb-1'>
                  Welcome, <span className='text-primary'>{userName}</span>!
                </h2>
                <p className='text-sm text-slate-400'>
                  Choose your avatar to complete your profile
                </p>
              </motion.div>

              <motion.div
                className='grid gap-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Pass the onAvatarChange prop to capture selection */}
                <AvatarPicker
                  username={userName}
                  onAvatarChange={handleAvatarChange}
                />
              </motion.div>

              <div className='flex gap-2 mt-2'>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className='w-1/3'
                >
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleBackStep}
                    className='w-full h-12 text-base rounded-lg font-medium cursor-pointer'
                  >
                    Back
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className='w-2/3'
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
                      disabled={isAuthLoading || !selectedAvatar} // Disable if no avatar selected
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
              </div>

              {/* Optional: Show a message if no avatar is selected */}
              {!selectedAvatar && (
                <motion.p
                  className='text-xs text-amber-500 text-center mt-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Please select an avatar to continue
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
