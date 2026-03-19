'use client'

import { useState } from 'react'
import { RecordingsTable } from '@/components/recordings-table'
import { UsersStatsTable } from '@/components/users-stats-table'
import { Mic, Users, FileAudio } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackofficePage() {
  const [activeTab, setActiveTab] = useState<'recordings' | 'users'>('users')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Backoffice de Grabaciones</h1>
              <p className="text-sm text-muted-foreground">Gestion de transcripciones de voz</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs de navegacion */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Usuarios
          </Button>
          <Button
            variant={activeTab === 'recordings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('recordings')}
            className="gap-2"
          >
            <FileAudio className="h-4 w-4" />
            Grabaciones
          </Button>
        </div>

        {/* Contenido del tab */}
        {activeTab === 'users' ? (
          <UsersStatsTable />
        ) : (
          <RecordingsTable />
        )}
      </div>
    </div>
  )
}
