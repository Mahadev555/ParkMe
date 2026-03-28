import { motion } from 'framer-motion'
import { MapPin, Clock, Star, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Parking Card Component
 * Displays parking space info with hover effects
 */
export const ParkingCard = ({ 
  parking, 
  distance,
  onBook 
}) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  }

  const hoverVariants = {
    scale: 1.02,
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={hoverVariants}
      className="card card-hover"
    >
      {/* Header with Rating */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern" />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-slate-900">
            {parking.rating || 0}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
          {parking.title}
        </h3>

        {/* Address */}
        <div className="flex items-start space-x-2 text-slate-600">
          <MapPin size={18} className="flex-shrink-0 mt-0.5 text-primary-500" />
          <p className="text-sm line-clamp-2">{parking.address}</p>
        </div>

        {/* Distance and Price */}
        <div className="grid grid-cols-2 gap-3">
          {distance && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Distance</p>
              <p className="text-base font-bold text-slate-900">
                {distance < 1000 
                  ? `${Math.round(distance)}m` 
                  : `${(distance / 1000).toFixed(1)}km`
                }
              </p>
            </div>
          )}
          
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Price/Hour</p>
            <div className="flex items-center space-x-1">
              <DollarSign size={16} className="text-primary-600" />
              <p className="text-base font-bold text-slate-900">
                {parking.pricePerHour}
              </p>
            </div>
          </div>
        </div>

        {/* Spaces Available */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-slate-600">
            {parking.spacesAvailable} spaces available
          </span>
        </div>

        {/* Available Hours */}
        {parking.availability && parking.availability.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Clock size={16} className="text-primary-500" />
            <span>Open daily</span>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBook}
          className="w-full mt-4 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          View & Book
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ParkingCard
