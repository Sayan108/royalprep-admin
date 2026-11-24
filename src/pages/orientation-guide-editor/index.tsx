import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { SnackbarMessage } from '../../shared/ui/snackbar'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import { SandboxedDocument } from '../../shared/ui/sandboxed-document'

type Section = { id: string; title: string; body: string }
type Content = { title: string; intro: string; sections: Section[]; documentHtml?: string }
type State = { currentRevision: number; draftRevision: number | null; publishedRevision: number | null; draft: { content: Content } | null; history: { revision: number; content: Content; createdAt: string }[] }
const empty: Content = { title: 'RoyalPrep orientation guide', intro: '', sections: [{ id: crypto.randomUUID(), title: '', body: '' }] }

export function OrientationGuideEditor() {
  const [state, setState] = useState<State>()
  const [content, setContent] = useState(empty)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const load = useCallback(async () => {
    const result = await api<State>('/admin/content/orientation-guide', {}, true)
    setState(result); setContent(result.draft?.content ?? empty)
  }, [])
  useEffect(() => { void load().catch(e => setError((e as Error).message)) }, [load])
  const dirty = JSON.stringify(content) !== JSON.stringify(state?.draft?.content ?? empty)
  async function mutate(path: string, method: 'PUT' | 'POST', body: object, success: string) {
    if (!state) return
    setBusy(true); setError(''); setMessage('')
    try { await api(path, { method, body: JSON.stringify(body) }, true); await load(); setMessage(success) }
    catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  function updateSection(index: number, patch: Partial<Section>) {
    setContent({ ...content, sections: content.sections.map((section, i) => i === index ? { ...section, ...patch } : section) })
  }
  return <ScreenLayout admin><div className="hero-editor-heading"><div><p className="screen-kicker">CONTENT MANAGER</p><h1>Orientation guide</h1><p>Manage the published preparation orientation guide.</p></div><Link className="outline-button" to="/admin/content/hero">Homepage hero</Link></div>
    <ErrorMessage text={error}/><SnackbarMessage message={message}/>{state ? <><p>Current revision: {state.currentRevision} · Published: {state.publishedRevision ?? 'Not published'}</p>
      <form className="screen-card" onSubmit={event => { event.preventDefault(); void mutate('/admin/content/orientation-guide/draft', 'PUT', { expectedRevision: state.currentRevision, content }, 'Draft saved.') }}>
        <label>Title<input required maxLength={160} value={content.title} onChange={event => setContent({ ...content, title: event.target.value })}/></label>
        {content.documentHtml !== undefined ? <>
        <details><summary>Edit imported HTML</summary><p>Changes are saved as a new draft. Scripts and embedded frames are not allowed.</p><label>Guide HTML<textarea maxLength={1000000} rows={16} value={content.documentHtml} onChange={event => setContent({ ...content, documentHtml: event.target.value })}/></label></details>
        <details><summary>Preview guide</summary><SandboxedDocument title="Orientation guide preview" documentHtml={content.documentHtml}/></details>
        {!content.documentHtml.trim() && <p>Guide HTML cannot be empty.</p>}
        </> : <>
        <label>Introduction<textarea required maxLength={1000} value={content.intro} onChange={event => setContent({ ...content, intro: event.target.value })}/></label>
        <h2>Sections</h2>{content.sections.map((section, index) => <fieldset key={section.id}><legend>Section {index + 1}</legend><label>Heading<input required maxLength={160} value={section.title} onChange={event => updateSection(index, { title: event.target.value })}/></label><label>Content<textarea required maxLength={4000} value={section.body} onChange={event => updateSection(index, { body: event.target.value })}/></label><button className="outline-button" type="button" onClick={() => setContent({ ...content, sections: content.sections.filter((_, i) => i !== index) })} disabled={content.sections.length === 1}>Remove section</button></fieldset>)}
        <button className="outline-button" type="button" onClick={() => setContent({ ...content, sections: [...content.sections, { id: crypto.randomUUID(), title: '', body: '' }] })}>Add section</button>
        </>}
        <div className="hero-editor-actions"><button className="screen-button" disabled={busy || (content.documentHtml !== undefined && !content.documentHtml.trim())}>Save draft</button><button className="outline-button" type="button" disabled={busy || dirty || state.draftRevision === null} onClick={() => void mutate('/admin/content/orientation-guide/publish', 'POST', { expectedRevision: state.currentRevision }, 'Guide published.')}>Publish saved draft</button></div>
        {dirty && <p>Save your changes before publishing.</p>}
      </form>
      <section className="screen-card"><h2>Publication history</h2>{state.history.length ? <ul>{state.history.map(item => <li key={item.revision}>Revision {item.revision}: {item.content.title} ({new Date(item.createdAt).toLocaleString()}) <button className="outline-button" type="button" disabled={busy} onClick={() => { if (window.confirm(`Restore revision ${item.revision}?`)) void mutate('/admin/content/orientation-guide/restore', 'POST', { expectedRevision: state.currentRevision, sourceRevision: item.revision }, 'Previous guide restored.') }}>Restore</button></li>)}</ul> : <p>No published revisions yet.</p>}</section>
    </> : <LoadingState label="Loading orientation guide..."/>}</ScreenLayout>
}
