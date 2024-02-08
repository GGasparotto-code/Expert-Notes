// Importando o pacote React para permitir o uso de componentes e funções do React.
import React from 'react'

// Importando o pacote ReactDOM para interagir com o DOM do navegador.
import ReactDOM from 'react-dom/client'

// Importando o componente App do arquivo app.js.
import {App} from './app'

// Importando o componente Toaster da biblioteca 'sonner'.
import {Toaster} from 'sonner'

// Importando o arquivo CSS que contém os estilos globais da aplicação.
import './index.css'

// Criando uma raiz no elemento HTML com o ID 'root'.
// Renderizando o componente App e o componente Toaster dentro do React.StrictMode.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors/>
  </React.StrictMode>,
)
