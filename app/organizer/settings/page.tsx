'use client'

import { motion } from 'framer-motion'
import { Bell, Lock, Users, Save } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

interface SettingsState {
  notifications: {
    email: boolean
    sms: boolean
    tournamentUpdates: boolean
    paymentReminders: boolean
  }
  security: {
    twoFactor: boolean
  }
  privacy: {
 