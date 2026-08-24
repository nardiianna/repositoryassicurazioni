import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Documento, TipoDocumento } from '../types/domain'

const GRUPPI: { titolo: string; tipi: TipoDocumento[] }[] = [
  { titolo: 'Copia di Polizza', tipi: ['polizza'] },
  { titolo: 'Fascicolo Informativo', tipi: ['dip', 'dip_aggiuntivo', 'condizioni', 'glossario'] },
  { titolo: 'Altri documenti', tipi: ['altro'] },
]

const TIPO_LABEL: Record<TipoDocumento, string> = {
  polizza: 'Contratto sottoscritto',
  dip: 'DIP',
  dip_aggiuntivo: 'DIP Aggiuntivo',
  condizioni: 'Condizioni di Assicurazione',
  glossario: 'Glossario',
  altro: 'Altro',
}

export function DocumentManager({
  societaId,
  areaId,
  userId,
  isAdmin,
}: {
  societaId: string
  areaId: string
  userId: string
  isAdmin: boolean
}) {
  const [documenti, setDocumenti] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [tipoScelto, setTipoScelto] = useState<TipoDocumento>('polizza')
  const [error, setError] = useState<string | null>(null)

  async function loadDocumenti() {
    const { data, error } = await supabase
      .from('documenti')
      .select('id, area_id, tipo, nome_file, storage_path, uploaded_by, created_at')
      .eq('area_id', areaId)
      .order('created_at', { ascending: false })
    if (!error) setDocumenti(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadDocumenti()
  }, [areaId])

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setError(null)
    for (const file of Array.from(fileList)) {
      const path = `${societaId}/${areaId}/${tipoScelto}-${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('documenti-polizze').upload(path, file)
      if (uploadError) {
        setError(uploadError.message)
        continue
      }
      const { error: insertError } = await supabase.from('documenti').insert({
        area_id: areaId,
        tipo: tipoScelto,
        nome_file: file.name,
        storage_path: path,
        uploaded_by: userId,
      })
      if (insertError) setError(insertError.message)
    }
    setUploading(false)
    loadDocumenti()
  }

  async function handleDownload(doc: Documento) {
    const { data, error } = await supabase.storage
      .from('documenti-polizze')
      .createSignedUrl(doc.storage_path, 60)
    if (!error && data) window.open(data.signedUrl, '_blank')
  }

  async function handleDelete(doc: Documento) {
    await supabase.storage.from('documenti-polizze').remove([doc.storage_path])
    await supabase.from('documenti').delete().eq('id', doc.id)
    loadDocumenti()
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-800">Documenti</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={tipoScelto}
            onChange={(e) => setTipoScelto(e.target.value as TipoDocumento)}
            className="min-w-0 rounded border border-gray-300 text-base px-2 py-1.5 sm:text-xs"
          >
            {(Object.keys(TIPO_LABEL) as TipoDocumento[]).map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_LABEL[tipo]}
              </option>
            ))}
          </select>
          <label className="rounded bg-brand-900 hover:bg-brand-700 text-white px-3 py-1.5 text-xs font-medium cursor-pointer">
            {uploading ? 'Caricamento...' : '+ Carica file'}
            <input
              type="file"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Caricamento...</p>
      ) : (
        GRUPPI.map((gruppo) => {
          const docsGruppo = documenti.filter((d) => gruppo.tipi.includes(d.tipo))
          return (
            <div key={gruppo.titolo}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                {gruppo.titolo}
              </h4>
              {docsGruppo.length === 0 ? (
                <p className="text-sm text-gray-400">Nessun documento caricato.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {docsGruppo.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between py-2 text-sm">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-brand-700 hover:underline text-left truncate max-w-xs"
                      >
                        {doc.nome_file}
                      </button>
                      {(isAdmin || doc.uploaded_by === userId) && (
                        <button onClick={() => handleDelete(doc)} className="text-xs text-red-600">
                          Elimina
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
