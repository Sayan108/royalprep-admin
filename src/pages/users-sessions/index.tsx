import { useEffect, useState } from 'react'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type User = { email: string; createdAt: string; status: string }
type Session = { token: string; email: string; expiresAt: string; revokedAt: string | null }
export function UsersSessions() {
  const [users, setUsers] = useState<User[]>()
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState('')
  useEffect(() => { void Promise.all([api<User[]>('/admin/users', {}, true), api<Session[]>('/admin/sessions', {}, true)]).then(([accounts, activeSessions]) => { setUsers(accounts); setSessions(activeSessions) }).catch(e => setError((e as Error).message)) }, [])
  async function revoke(email: string) { await api('/admin/sessions/revoke', { method: 'POST', body: JSON.stringify({ email }) }, true); setSessions(sessions.map(session => session.email === email ? { ...session, revokedAt: new Date().toISOString() } : session)) }
  return <ScreenLayout admin><p className="screen-kicker">OPERATIONS</p><h1>Users and sessions</h1><p>Review registered student accounts and revoke all sessions for an account when needed.</p><ErrorMessage text={error}/>{!users && !error ? <LoadingState label="Loading users..."/> : users && <><h2>Accounts</h2><ul className="attempt-list">{users.map(user => <li className="screen-card" key={user.email}><strong>{user.email}</strong><p>{user.status} · joined {new Date(user.createdAt).toLocaleString()}</p><button className="outline-button" type="button" onClick={() => void revoke(user.email)}>Revoke sessions</button></li>)}</ul><h2>Sessions</h2><ul className="attempt-list">{sessions.map(session => <li className="screen-card" key={session.token}><strong>{session.email}</strong><p>{session.token} · expires {new Date(session.expiresAt).toLocaleString()} · {session.revokedAt ? 'revoked' : 'active'}</p></li>)}</ul></>}</ScreenLayout>
}
