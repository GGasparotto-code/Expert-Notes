// Importação dos componentes necessários
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

// Interface para definir as propriedades do componente
interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

// Variável para armazenar a instância da API de reconhecimento de voz
let speechRecognition: SpeechRecognition | null = null

// Componente funcional para criar uma nova nota
export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {

    // Estados para controlar a exibição do onboarding e a gravação de voz
    const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    // Função para iniciar o editor de notas
    function handleStartEditor() {
        setShouldShowOnBoarding(false)
    }

    // Função para lidar com mudanças no conteúdo da nota
    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        // Se o campo estiver vazio, mostra o onboarding novamente
        if (event.target.value === '') {
            setShouldShowOnBoarding(true)
        }
    }

    // Função para salvar a nota
    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        // Verifica se há conteúdo antes de prosseguir
        if (content === '') {
            return
        }

        // Chama a função passada por prop para criar a nota
        onNoteCreated(content)

        // Limpa o estado e volta ao onboarding após salvar a nota criada
        setContent('')
        setShouldShowOnBoarding(true)

        // Exibe um toast informando sobre o sucesso na criação da nota
        toast.success('Nota criada com sucesso!')
    }

    // Função para iniciar a gravação da nota
    function handleStartRecording() {

        // Verifica se a API de reconhecimento de voz está disponível
        const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window
            || 'webkitSpeechRecognition' in window

        // Caso não esteja disponível, exibe um alerta
        if (!isSpeechRecognitionAPIAvaliable) {
            alert('Infelizmente seu navegador não suporta a API de gravação!')
            return
        }

        // Configura o estado para começar a gravação
        setIsRecording(true)
        setShouldShowOnBoarding(false)

        // Inicializa a API de reconhecimento de voz
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        speechRecognition = new SpeechRecognitionAPI()

        // Configurações para a API de reconhecimento de voz
        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        // Manipula os resultados da transcrição
        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        // Trata erros da API de reconhecimento de voz
        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        // Inicia a gravação
        speechRecognition.start()
    }

    // Função para parar a gravação da nota
    function handleStopRecording() {
        setIsRecording(false)
        
        if (speechRecognition != null) {
            speechRecognition.stop()
        }
    }

    // Renderização do componente
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-blue-400'>
                <span className='text-sm font-medium text-slate-200'>Adicionar Nota</span>

                <p className='text-sm leading-6 text-slate-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>

            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>

                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>
                                Adicionar Nota
                            </span>

                            {shouldShowOnBoarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                    Comece <button type='button' onClick={handleStartRecording} className='font-medium text-blue-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-blue-400 hover:underline'>utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                    onChange={handleContentChanged}
                                    value={content}
                                />
                            )}

                        </div>

                        {isRecording ? (
                            <button type='button' onClick={handleStopRecording} className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravando! (clique para interromper)
                            </button>
                        ) : (
                            <button type='button' onClick={handleSaveNote} className='w-full bg-blue-400 py-4 text-center text-sm text-blue-950 outline-none font-medium hover:bg-blue-500'>
                                Salvar Nota
                            </button>
                        )}

                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}