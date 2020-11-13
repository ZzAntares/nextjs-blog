import { parseISO, format } from 'date-fns'

// Component to render dates
export default function Date({ dateString }) {
  const date = parseISO(dateString)

  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
