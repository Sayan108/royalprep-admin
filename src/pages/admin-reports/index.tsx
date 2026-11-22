import { LoadingState } from '../../shared/ui/loading-state'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import type { QuestionReport } from '../../entities/question'
import { api } from '../../shared/api/index'
import '../../shared/styles/mocks.css'

export function AdminReports() {
  const [reports, setReports] = useState<QuestionReport[]>()
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setError(''); setReports(undefined)
    try { setReports(await api<QuestionReport[]>('/admin/question-reports', {}, true)) }
    catch (e) { setError((e as Error).message) }
  }, [])
  useEffect(() => { void load() }, [load])
  return <ScreenLayout admin><p className="screen-kicker">COMMUNICATIONS</p><h1>Question reports</h1><p>Reports include the question text and version at the time of submission. Replies and broadcasts are not available yet.</p>
    <ErrorMessage text={error}/>{error && <button className="outline-button" type="button" onClick={load}>Try again</button>}
    {!reports && !error ? <LoadingState label="Loading reports..."/> : reports && (reports.length ? <ul className="attempt-list">{reports.map(report => <li className="screen-card" key={report.id}><div><strong>{report.questionStem}</strong><p>{report.message}</p><small>Question version {report.questionVersion} · {new Date(report.createdAt).toLocaleString()}</small></div><Link className="outline-button" to="/admin/questions">Question bank</Link></li>)}</ul> : <section className="screen-card"><p>No reports have been submitted.</p></section>)}
  </ScreenLayout>
}
