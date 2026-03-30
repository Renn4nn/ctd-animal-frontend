import { useEffect } from "react"

interface Props {
  title: string
}

export function PageTitle({ title }: Props) {
  useEffect(() => {
    document.title = `CTD - ${title}`
  }, [title])

  return null // Não renderiza nada visualmente
}