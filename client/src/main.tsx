import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import "@navikt/ds-css";
import { Button } from '@navikt/ds-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Button variant="primary">Test</Button>
    <App />
  </StrictMode>,
)
