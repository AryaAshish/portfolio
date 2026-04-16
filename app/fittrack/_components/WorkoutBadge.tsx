const WORKOUT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  push:      { bg: '#dbeafe', text: '#1d4ed8', label: 'Push'      },
  pull:      { bg: '#dcfce7', text: '#15803d', label: 'Pull'      },
  legs:      { bg: '#fef3c7', text: '#b45309', label: 'Legs'      },
  rest:      { bg: '#f3f4f6', text: '#6b7280', label: 'Rest'      },
  auxiliary: { bg: '#f3e8ff', text: '#7c3aed', label: 'Auxiliary' },
  cardio:    { bg: '#ffe4e6', text: '#be123c', label: 'Cardio'    },
}

export function WorkoutBadge({
  type,
  size = 'md',
}: {
  type: string
  size?: 'sm' | 'md'
}) {
  const style = WORKOUT_STYLES[type?.toLowerCase()] ?? WORKOUT_STYLES.rest
  const padding = size === 'sm' ? '2px 7px' : '3px 10px'
  const fontSize = size === 'sm' ? '10px' : '11px'

  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: 5,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        display: 'inline-block',
        lineHeight: 1.4,
      }}
    >
      {style.label}
    </span>
  )
}

export { WORKOUT_STYLES }
