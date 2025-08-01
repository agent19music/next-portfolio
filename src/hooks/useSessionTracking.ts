import { useState, useEffect } from 'react'

interface SessionData {
  sessionId: string
  startTime: number
  userAgent: string
  location: {
    country?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  timezone: string
  language: string
  screenResolution: string
}

interface LocationData {
  country?: string
  city?: string
  latitude?: number
  longitude?: number
}

export function useSessionTracking() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate session ID
  const generateSessionId = (): string => {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
  }

  // Get browser location if user grants permission
  const getBrowserLocation = (): Promise<LocationData> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({})
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          // If geolocation fails, resolve with empty object
          resolve({})
        },
        { timeout: 10000, enableHighAccuracy: false }
      )
    })
  }

  // Get IP-based location
  const getIPLocation = async (): Promise<LocationData> => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        return {
          country: data.country_name,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude
        }
      }
    } catch (error) {
      console.log('IP location detection failed:', error)
    }
    return {}
  }

  // Initialize session tracking
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check if session already exists in localStorage
        const existingSession = localStorage.getItem('anonMessageSession')
        let sessionId: string

        if (existingSession) {
          const parsed = JSON.parse(existingSession)
          // Check if session is less than 24 hours old
          if (Date.now() - parsed.startTime < 24 * 60 * 60 * 1000) {
            sessionId = parsed.sessionId
          } else {
            sessionId = generateSessionId()
          }
        } else {
          sessionId = generateSessionId()
        }

        // Get location data
        const [browserLocation, ipLocation] = await Promise.all([
          getBrowserLocation(),
          getIPLocation()
        ])

        // Prefer browser location if available, fallback to IP location
        const location = {
          ...ipLocation,
          ...(browserLocation.latitude && browserLocation.longitude ? browserLocation : {})
        }

        const session: SessionData = {
          sessionId,
          startTime: Date.now(),
          userAgent: navigator.userAgent,
          location,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`
        }

        // Store session in localStorage
        localStorage.setItem('anonMessageSession', JSON.stringify(session))
        setSessionData(session)

        console.log('📊 Session initialized:', {
          sessionId: session.sessionId,
          location: session.location,
          timezone: session.timezone
        })

      } catch (error) {
        console.error('Failed to initialize session:', error)
        // Fallback session without location
        const fallbackSession: SessionData = {
          sessionId: generateSessionId(),
          startTime: Date.now(),
          userAgent: navigator.userAgent,
          location: {},
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`
        }
        setSessionData(fallbackSession)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [])

  // Function to track an event
  const trackEvent = async (eventName: string, eventData: any = {}) => {
    if (!sessionData) return

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          session_id: sessionData.sessionId,
          user_agent: sessionData.userAgent,
          parameters: {
            ...eventData,
            timezone: sessionData.timezone,
            language: sessionData.language,
            screen_resolution: sessionData.screenResolution,
            location: sessionData.location
          },
          page_url: window.location.href,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  return {
    sessionData,
    isLoading,
    trackEvent
  }
}