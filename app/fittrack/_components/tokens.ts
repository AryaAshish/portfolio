export const FT = {
  canvas: '#f7f7f5',
  surface: '#ffffff',
  border: '#e8e8e4',
  borderSubtle: '#f0f0ee',

  textPrimary: '#1a1a1a',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textDisabled: '#d1d5db',

  accent: '#2563eb',
  accentBg: '#eff6ff',
  success: '#16a34a',
  successBg: '#f0fdf4',
  warning: '#d97706',
  warningBg: '#fffbeb',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
} as const

export const WORKOUT_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  push:      { bg: '#dbeafe', text: '#1d4ed8', label: 'Push'      },
  pull:      { bg: '#dcfce7', text: '#15803d', label: 'Pull'      },
  legs:      { bg: '#fef3c7', text: '#b45309', label: 'Legs'      },
  rest:      { bg: '#f3f4f6', text: '#6b7280', label: 'Rest'      },
  auxiliary: { bg: '#f3e8ff', text: '#7c3aed', label: 'Auxiliary' },
  cardio:    { bg: '#ffe4e6', text: '#be123c', label: 'Cardio'    },
}

export function workoutColor(type: string) {
  return WORKOUT_COLORS[type?.toLowerCase()] ?? WORKOUT_COLORS.rest
}
