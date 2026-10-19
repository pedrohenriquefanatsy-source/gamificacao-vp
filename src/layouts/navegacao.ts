import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Gauge,
  LayoutGrid,
  Map,
  Settings,
  Swords,
  Target,
  Trophy,
  User,
  UserCheck,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export interface ItemNav {
  rotulo: string
  icone: LucideIcon
  base?: string // prefixo de rota usado para marcar o item ativo
  para?: string
  outroSistema?: boolean
}

// Itens do sistema atual: aparecem esmaecidos e sem clique.
export const ITENS_SISTEMA: ItemNav[] = [
  { rotulo: 'Dashboard', icone: LayoutGrid },
  { rotulo: 'Análise SWOT', icone: Map },
  { rotulo: 'Objetivos Estratégicos', icone: Target },
  { rotulo: 'Batalhas', icone: Swords },
  { rotulo: 'Planejamento Operacional', icone: ClipboardList },
  { rotulo: 'Núcleos', icone: Users },
  { rotulo: 'Acompanhamento', icone: UserCheck },
  { rotulo: 'Indicadores', icone: BarChart3 },
  { rotulo: 'Configurações', icone: Settings },
]

export const ITENS_GAMIFICACAO: ItemNav[] = [
  { rotulo: 'Como funciona', icone: Workflow, base: '/como-funciona', para: '/como-funciona' },
  { rotulo: 'Ranking', icone: Trophy, base: '/ranking', para: '/ranking' },
  { rotulo: 'Núcleos', icone: Users, base: '/nucleos', para: '/nucleos/presidencia' },
  { rotulo: 'Membros', icone: User, base: '/membros', para: '/membros/joao-pedro' },
  { rotulo: 'Indicadores', icone: Gauge, base: '/indicadores', para: '/indicadores' },
  { rotulo: 'Regras', icone: BookOpen, base: '/regras', para: '/regras' },
  {
    rotulo: 'Área do Membro · PIPJ',
    icone: Wallet,
    base: '/area-do-membro',
    para: '/area-do-membro/joao-pedro',
    outroSistema: true,
  },
]

export const TITULOS: Record<string, string> = {
  '/como-funciona': 'Como funciona',
  '/ranking': 'Ranking',
  '/nucleos': 'Núcleos',
  '/membros': 'Membros',
  '/indicadores': 'Indicadores da gamificação',
  '/regras': 'Regras',
}
