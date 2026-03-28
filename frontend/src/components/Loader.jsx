import { motion } from 'framer-motion'

/**
 * Loading Spinner Component
 */
export const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const container = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-4 border-slate-200 border-t-primary-500 rounded-full`}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {container}
      </div>
    )
  }

  return container
}

/**
 * Loading Skeleton Component
 */
export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`shimmer rounded-lg ${className}`} />
  )
}

/**
 * Card Skeleton Component
 */
export const CardSkeleton = () => {
  return (
    <div className="card p-4 space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default Loader
