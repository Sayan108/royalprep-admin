import { useEffect, useState } from 'react'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Challenge = { date: string; kind: 'quiz' | 'mock'; questionIds: string[]; durationMinutes: number }
export function DailyChallengesEditor() {
  const [items, setItems] = useState<Challenge[]>()
  const [error, setError] = useState('')
  useEffect(() => { void api<Challenge[]>('/admin/daily-challenges', {}, true).then(setItems).catch(e => setError((e as Error).message)) }, [])
  async function save(item: Challenge) { await api('/admin/daily-challenges', { method: 'PUT', body: JSON.stringify(item) }, true) }
  return <ScreenLayout admin><p className="screen-kicker">ASSESSMENTS</p><h1>Daily challenges</h1><p>Set the question IDs and duration used by each daily quiz or mock.</p><ErrorMessage text={error}/>{!items && !error ? <LoadingState label="Loading daily challenges..."/> : items && items.map((item, index) => <form className="screen-card" key={item.kind + item.date} onSubmit={event => { event.preventDefault(); void save(item) }}><label>Date<input type="date" value={item.date} onChange={event => setItems(items.map((value, i) => i === index ? { ...value, date: event.target.value } : value))}/></label><p>Type: {item.kind}</p><label>Duration (minutes)<input type="number" min="1" value={item.durationMinutes} onChange={event => setItems(items.map((value, i) => i === index ? { ...value, durationMinutes: Number(event.target.value) } : value))}/></label><label>Question IDs<textarea value={item.questionIds.join('\n')} onChange={event => setItems(items.map((value, i) => i === index ? { ...value, questionIds: event.target.value.split(/\r?\n/).map(id => id.trim()).filter(Boolean) } : value))}/></label><button className="screen-button">Save challenge</button></form>)}</ScreenLayout>
}
