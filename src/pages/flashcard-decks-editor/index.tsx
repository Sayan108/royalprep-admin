import { useEffect, useState } from 'react'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Deck = { id: string; title: string; description: string; published: boolean; cards: { id: string; front: string; back: string }[] }
export function FlashcardDecksEditor() {
  const [decks, setDecks] = useState<Deck[]>()
  const [error, setError] = useState('')
  useEffect(() => { void api<Deck[]>('/admin/flashcard-decks', {}, true).then(setDecks).catch(e => setError((e as Error).message)) }, [])
  async function save(deck: Deck) { await api('/admin/flashcard-decks', { method: 'PUT', body: JSON.stringify(deck) }, true) }
  function updateCard(deckId: string, cardId: string, patch: Partial<Deck['cards'][number]>) {
    setDecks(current => current?.map(deck => deck.id === deckId ? { ...deck, cards: deck.cards.map(card => card.id === cardId ? { ...card, ...patch } : card) } : deck))
  }
  return <ScreenLayout admin><p className="screen-kicker">CONTENT MANAGER</p><h1>Shared flashcard decks</h1><p>Manage reusable flashcard decks available to students.</p><ErrorMessage text={error}/>{!decks && !error ? <LoadingState label="Loading decks..."/> : decks && decks.map(deck => <form className="screen-card" key={deck.id} onSubmit={event => { event.preventDefault(); void save(deck) }}><label>Title<input value={deck.title} onChange={event => setDecks(decks.map(item => item.id === deck.id ? { ...item, title: event.target.value } : item))}/></label><label>Description<textarea value={deck.description} onChange={event => setDecks(decks.map(item => item.id === deck.id ? { ...item, description: event.target.value } : item))}/></label><label><input type="checkbox" checked={deck.published} onChange={event => setDecks(decks.map(item => item.id === deck.id ? { ...item, published: event.target.checked } : item))}/> Published</label><h2>Cards</h2>{deck.cards.map(card => <fieldset key={card.id}><label>Front<input value={card.front} onChange={event => updateCard(deck.id, card.id, { front: event.target.value })}/></label><label>Back<textarea value={card.back} onChange={event => updateCard(deck.id, card.id, { back: event.target.value })}/></label></fieldset>)}<button className="screen-button">Save deck</button></form>)}</ScreenLayout>
}
