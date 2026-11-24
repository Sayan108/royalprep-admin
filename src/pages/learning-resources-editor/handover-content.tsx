import { useEffect, useState } from 'react'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { SandboxedDocument } from '../../shared/ui/sandboxed-document'

type PackSummary = { chapterCode: string; title: string }
type Pack = { title: string; documentHtml: string }
type Recall = { id: string; stem: string; options: string[]; correct: number; explanation: string; topic: string; sitting: string; pearl: string; trick: string; keyCheck: string; alsoIn: string[] }
type Page = { items: Recall[]; total: number; offset: number; limit: number }

export function HandoverContent() {
  const [packs, setPacks] = useState<PackSummary[]>()
  const [selectedPack, setSelectedPack] = useState('')
  const [pack, setPack] = useState<Pack>()
  const [packError, setPackError] = useState('')
  const [source, setSource] = useState<'recall' | 'fawzia'>('recall')
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState<Page>()
  const [recallError, setRecallError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    api<PackSummary[]>('/admin/handover/revision-packs', { signal: controller.signal }, true)
      .then(setPacks).catch((e: unknown) => { if (!controller.signal.aborted) setPackError(e instanceof Error ? e.message : 'Unable to load revision packs.') })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    setPack(undefined); setPackError('')
    if (!selectedPack) return
    const controller = new AbortController()
    api<Pack>('/admin/handover/revision-packs/' + encodeURIComponent(selectedPack), { signal: controller.signal }, true)
      .then(setPack).catch((e: unknown) => { if (!controller.signal.aborted) setPackError(e instanceof Error ? e.message : 'Unable to load this revision pack.') })
    return () => controller.abort()
  }, [selectedPack])
  useEffect(() => {
    const controller = new AbortController()
    setPage(undefined); setRecallError('')
    api<Page>(`/admin/handover/recalls?source=${source}&offset=${offset}`, { signal: controller.signal }, true)
      .then(setPage).catch((e: unknown) => { if (!controller.signal.aborted) setRecallError(e instanceof Error ? e.message : 'Unable to load recall questions.') })
    return () => controller.abort()
  }, [source, offset])
  return <section className="screen-card">
    <h2>Imported handover content</h2><p>Revision packs and recall questions are read-only here.</p>
    <h3>Revision packs</h3><ErrorMessage text={packError}/>
    {!packs && !packError ? <LoadingState label="Loading revision packs..."/> : packs && <>
      <label>Chapter<select value={selectedPack} onChange={event => setSelectedPack(event.target.value)}><option value="">Choose a chapter</option>{packs.map(item => <option key={item.chapterCode} value={item.chapterCode}>{item.title}</option>)}</select></label>
      {selectedPack && !pack && !packError ? <LoadingState label="Loading revision pack..."/> : pack && <SandboxedDocument title={`${pack.title} revision pack`} documentHtml={pack.documentHtml} allowScripts/>}
    </>}
    <h3>Recall questions</h3>
    <label>Bank<select value={source} onChange={event => { setSource(event.target.value === 'fawzia' ? 'fawzia' : 'recall'); setOffset(0) }}><option value="recall">Recall</option><option value="fawzia">Fawzia</option></select></label>
    <ErrorMessage text={recallError}/>
    {!page && !recallError ? <LoadingState label="Loading questions..."/> : page && <>
      <p>{page.total ? `${page.offset + 1}–${Math.min(page.offset + page.items.length, page.total)} of ${page.total}` : 'No questions are available.'}</p>
      {page.items.map(item => <details key={item.id}><summary>{item.topic}: {item.stem}</summary>
        <p>{item.sitting}</p><ol type="A">{item.options.map((option, index) => <li key={index}>{option}</li>)}</ol>
        <p><strong>Answer: {String.fromCharCode(65 + item.correct)}</strong> {item.explanation}</p>
        {item.pearl && <p>Pearl: {item.pearl}</p>}{item.trick && <p>Trick: {item.trick}</p>}{item.keyCheck && <p>Key check: {item.keyCheck}</p>}{item.alsoIn.length > 0 && <p>Also in: {item.alsoIn.join(', ')}</p>}
      </details>)}
      <p><button className="outline-button" type="button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - page.limit))}>Previous</button>{' '}<button className="outline-button" type="button" disabled={offset + page.limit >= page.total} onClick={() => setOffset(offset + page.limit)}>Next</button></p>
    </>}
  </section>
}
