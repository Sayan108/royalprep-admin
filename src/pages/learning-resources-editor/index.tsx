import { useCallback, useEffect, useState } from 'react'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Resource = { id: string; kind: string; title: string; summary: string; body: string; published: boolean }
const kinds = ['revision-pack', 'radio', 'masterclass', 'mixed-bag', 'fawzia-sheet', 'last-week', 'exam-eve']
export function LearningResourcesEditor() {
  const [items, setItems] = useState<Resource[]>()
  const [error, setError] = useState('')
  const load = useCallback(async () => { try { setItems(await api<Resource[]>('/admin/learning-resources', {}, true)) } catch (e) { setError((e as Error).message) } }, [])
  useEffect(() => { void load() }, [load])
  async function save(item: Resource) { await api(`/admin/learning-resources/${item.id}`, { method: 'PUT', body: JSON.stringify({ kind: item.kind, title: item.title, summary: item.summary, body: item.body, published: item.published }) }, true); await load() }
  return <ScreenLayout admin><p className="screen-kicker">CONTENT MANAGER</p><h1>Learning resources</h1><p>Publish revision packs, radio notes, masterclasses and recall resources.</p><ErrorMessage text={error}/>{!items && !error ? <LoadingState label="Loading resources..."/> : items && <div className="dashboard-grid">{items.map(item => <form className="screen-card" key={item.id} onSubmit={event => { event.preventDefault(); void save(item) }}><label>Type<select value={item.kind} onChange={event => setItems(items.map(value => value.id === item.id ? { ...value, kind: event.target.value } : value))}>{kinds.map(kind => <option key={kind}>{kind}</option>)}</select></label><label>Title<input value={item.title} onChange={event => setItems(items.map(value => value.id === item.id ? { ...value, title: event.target.value } : value))}/></label><label>Summary<input value={item.summary} onChange={event => setItems(items.map(value => value.id === item.id ? { ...value, summary: event.target.value } : value))}/></label><label>Body<textarea value={item.body} onChange={event => setItems(items.map(value => value.id === item.id ? { ...value, body: event.target.value } : value))}/></label><label><input type="checkbox" checked={item.published} onChange={event => setItems(items.map(value => value.id === item.id ? { ...value, published: event.target.checked } : value))}/> Published</label><button className="screen-button">Save resource</button></form>)}</div>}</ScreenLayout>
}
