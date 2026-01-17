export interface AppBarStyle {
  showBackButton?: boolean
  showMypageButton?: boolean
}

export interface PageConfig {
  title: string
  showAppBar: boolean
  appBarStyle?: AppBarStyle
  pageName?: string
  isFloating?: boolean
}
