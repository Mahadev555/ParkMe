import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, MapPin, DollarSign } from 'lucide-react'
import { Button, Modal, Input, CardSkeleton, Loader } from '../components'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'

/**
 * Owner Parking Management Page
 * Create, read, update, delete parking spaces
 */
const OwnerParkingPage = () => {
  const { user } = useAuth()
  const toast = useToastContext()
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    pricePerHour: '',
    spacesAvailable: '',
    availability: [
      { dayOfWeek: 0, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 1, startTime: '06:00', endTime: '23:00' },
      { dayOfWeek: 2, startTime: '06:00', endTime: '23:00' },
      { dayOfWeek: 3, startTime: '06:00', endTime: '23:00' },
      { dayOfWeek: 4, startTime: '06:00', endTime: '23:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '20:00' },
    ],
  })

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    fetchParkings()
  }, [])

  const fetchParkings = async () => {
    try {
      setLoading(true)
      const response = await API.get('/parking/owner?page=1&limit=20')
      setParkings(response.data.data.items || [])
    } catch (err) {
      const msg = 'Failed to fetch parking spaces'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSubmitLoading(true)
      setError('')

      if (editingId) {
        // Update
        await API.put(`/parking/${editingId}`, {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          pricePerHour: parseFloat(formData.pricePerHour),
          spacesAvailable: parseInt(formData.spacesAvailable),
        })
        toast.success('Parking space updated successfully!')
      } else {
        // Create
        await API.post('/parking', {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          pricePerHour: parseFloat(formData.pricePerHour),
          spacesAvailable: parseInt(formData.spacesAvailable),
        })
        toast.success('Parking space created successfully!')
      }

      fetchParkings()
      setShowModal(false)
      resetForm()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save parking'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (parkingId) => {
    if (!window.confirm('Are you sure you want to delete this parking space?')) return

    try {
      await API.delete(`/parking/${parkingId}`)
      toast.success('Parking space deleted successfully!')
      fetchParkings()
    } catch (err) {
      const msg = 'Failed to delete parking'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleEdit = (parking) => {
    setFormData({
      title: parking.title,
      description: parking.description,
      address: parking.address,
      latitude: parking.location.coordinates[1],
      longitude: parking.location.coordinates[0],
      pricePerHour: parking.pricePerHour,
      spacesAvailable: parking.spacesAvailable,
      availability: parking.availability,
    })
    setEditingId(parking._id)
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      latitude: '',
      longitude: '',
      pricePerHour: '',
      spacesAvailable: '',
      availability: [
        { dayOfWeek: 0, startTime: '06:00', endTime: '22:00' },
        { dayOfWeek: 1, startTime: '06:00', endTime: '23:00' },
        { dayOfWeek: 2, startTime: '06:00', endTime: '23:00' },
        { dayOfWeek: 3, startTime: '06:00', endTime: '23:00' },
        { dayOfWeek: 4, startTime: '06:00', endTime: '23:00' },
        { dayOfWeek: 5, startTime: '07:00', endTime: '21:00' },
        { dayOfWeek: 6, startTime: '08:00', endTime: '20:00' },
      ],
    })
    setEditingId(null)
  }

  const handleClose = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Parking Spaces</h1>
            <p className="text-slate-600">Manage your parking listings</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus size={20} className="mr-2" /> Add Parking
          </Button>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Parking List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : parkings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {parkings.map((parking) => (
              <motion.div
                key={parking._id}
                whileHover={{ y: -4 }}
                className="card overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-primary-400 to-secondary-400" />

                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                    {parking.title}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin size={16} />
                      <span className="line-clamp-1">{parking.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <DollarSign size={16} />
                      <span>${parking.pricePerHour}/hour</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Available Spaces</p>
                    <p className="font-bold text-slate-900">{parking.spacesAvailable} spaces</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(parking)}
                      fullWidth
                    >
                      <Edit2 size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(parking._id)}
                      fullWidth
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-slate-600 text-lg mb-4">No parking spaces yet</p>
            <Button onClick={() => setShowModal(true)}>Create Your First Listing</Button>
          </motion.div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingId ? 'Edit Parking Space' : 'Create Parking Space'}
        size="lg"
      >
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Input
            label="Title"
            placeholder="Downtown Premium Garage"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your parking space..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="input-primary resize-none"
            />
          </div>

          <Input
            label="Address"
            placeholder="123 Main St, Downtown"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="0.0001"
              placeholder="40.7128"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              type="number"
              step="0.0001"
              placeholder="-74.0060"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price Per Hour ($)"
              type="number"
              step="0.5"
              placeholder="5.99"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
              required
            />
            <Input
              label="Available Spaces"
              type="number"
              placeholder="10"
              value={formData.spacesAvailable}
              onChange={(e) => setFormData({ ...formData, spacesAvailable: e.target.value })}
              required
            />
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Weekly Availability</h3>
            <div className="space-y-2">
              {formData.availability.map((av, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 w-24">
                    {dayNames[av.dayOfWeek]}
                  </span>
                  <input
                    type="time"
                    value={av.startTime}
                    onChange={(e) => {
                      const newAvail = [...formData.availability]
                      newAvail[idx].startTime = e.target.value
                      setFormData({ ...formData, availability: newAvail })
                    }}
                    className="input-primary text-sm"
                  />
                  <span className="text-slate-600">to</span>
                  <input
                    type="time"
                    value={av.endTime}
                    onChange={(e) => {
                      const newAvail = [...formData.availability]
                      newAvail[idx].endTime = e.target.value
                      setFormData({ ...formData, availability: newAvail })
                    }}
                    className="input-primary text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={handleClose} fullWidth>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              fullWidth
              loading={submitLoading}
              disabled={submitLoading}
            >
              {editingId ? 'Update' : 'Create'} Parking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OwnerParkingPage
