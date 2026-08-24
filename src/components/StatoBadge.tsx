import type { StatoCopertura } from '../types/domain'

const CLASSI: Record<StatoCopertura, string> = {
  copertura_attiva: 'bg-green-100 text-green-800 border border-green-300',
  copertura_assente: 'bg-red-100 text-red-800 border border-red-300',
  in_valutazione: 'bg-amber-100 text-amber-800 border border-amber-300',
}

const LABEL: Record<StatoCopertura, string> = {
  copertura_attiva: 'Copertura attiva',
  copertura_assente: 'Copertura assente',
  in_valutazione: 'In valutazione',
}

export function StatoBadge({ stato }: { stato: StatoCopertura }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CLASSI[stato]}`}>
      {LABEL[stato]}
    </span>
  )
}
