import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Shield, Zap } from 'lucide-react'
import { Button } from '../components'
import { useAuth } from '../context/AuthContext'

/**
 * Landing Page
 * Hero section with CTA buttons
 */
const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby Parking',
      description: 'Discover available parking spaces within seconds',
    },
    {
      icon: Clock,
      title: 'Book Instantly',
      description: 'Reserve your spot in real-time with just a few clicks',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Trust our secure payment system for peace of mind',
    },
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'User-friendly interface designed for convenience',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Main Title with Premium Styling */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                ✨ Your Parking Solution Starts Here
              </span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black gradient-text leading-tight">
              Find & Book Parking Instantly
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop wasting time searching for parking. ParkMe helps you find, reserve, and pay for parking spaces in seconds. Smart. Fast. Reliable.
            </p>
          </motion.div>

          {/* CTA Buttons with Enhanced Styling */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'driver' ? (
                  <Link to="/search">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="shadow-lg hover:shadow-xl">
                        🔍 Find Parking Now
                      </Button>
                    </motion.div>
                  </Link>
                ) : (
                  <Link to="/owner/parking">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="shadow-lg hover:shadow-xl">
                        📍 Manage Parking Spaces
                      </Button>
                    </motion.div>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register?role=driver">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="shadow-lg hover:shadow-xl">
                      🔍 Find Parking
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/register?role=owner">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl">
                      📍 List Parking
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </motion.div>

          {/* Call to Register */}
          {!isAuthenticated && (
            <motion.div variants={itemVariants} className="text-slate-600 pt-2">
              <p>Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Elements (Decorative) */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </section>

      {/* Features Section with Premium Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
              Why Choose ParkMe?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of parking with our smart, user-friendly platform
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="group card-premium p-6 text-center cursor-pointer hover:border-primary-200"
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 mb-4 group-hover:from-primary-600 group-hover:to-primary-500 group-hover:text-white transition-all duration-300"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                  >
                    <Icon size={24} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-5xl font-bold gradient-text">2000+</p>
            <p className="text-slate-600">Parking Spaces</p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-5xl font-bold gradient-text">10K+</p>
            <p className="text-slate-600">Happy Users</p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-5xl font-bold gradient-text">99%</p>
            <p className="text-slate-600">Satisfaction Rate</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section with Premium Styling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          whileInView={{ y: 0, opacity: 1 }}
          initial={{ y: 20, opacity: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-8 sm:p-12 md:p-16 text-center text-white space-y-6"
        >
          {/* Background Decorative Elements */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to Simplify Your Parking?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of drivers and property owners who are already using ParkMe to save time and money.
            </p>
            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="font-bold shadow-xl">
                    Get Started Free →
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage
