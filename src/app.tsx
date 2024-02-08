import { ChangeEvent, useState } from 'react'
import logo from './assets/expert-notes.png'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

// Interface que define a estrutura de uma nota
interface Note {
  id: string
  date: Date
  content: string
}

// Função principal do componente
export function App() {

  // Define um estado inicial para a busca
  const [search, setSearch] = useState('')

  // Estado inicial para as notas
  const [notes, setNotes] = useState<Note[]>(() => {

    // Verifica se há notas salvas no localStorage
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      // Retorna as notas salvas
      return JSON.parse(notesOnStorage)
    }

    // Se não houver notas salvas, retorna um array vazio
    return []
  })

  // Função para criar uma nova nota
  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    // Atualizando o estado das notas com a nova nota
    const notesArray = [newNote, ...notes]
    setNotes(notesArray)

    // Salvando as notas atualizadas no localStorage
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  // Função para deletar uma nota
  function onNoteDeleted(id: string) {

    // Filtrando as notas para remover a que será deletada
    const notesArray = notes.filter(note => {
      return note.id != id
    })

    // Atualizando o estado das notas sem a nota deletada
    setNotes(notesArray)

    // Salvando as notas atualizadas no localStorage
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  // Função para manipular a busca de notas
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    // Atualiza o estado da busca
    setSearch(query)
  }

  // Filtrando as notas com base na busca
  const filteredNotes = search != ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  // Renderização do componente
  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>

      <img src={logo} alt='NLW Expert' />

      <form className='w-full'>
        <input
          type="text"
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>

        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}

      </div>
    </div>

  )
}
