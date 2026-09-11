import './AppShell.css'

import { IconButton } from '../IconButton'
import { NavItem } from '../NavItem'
import { UserIdentity } from '../UserIdentity'
import type { AppShellNavigationItem, AppShellProps } from './AppShell.types'

import menuIcon from './assets/menu.svg'
import sunIcon from './assets/sun.svg'

function AssetIcon({ source }: { source: string }) {
  return <img alt="" className="signal-app-shell__asset-icon" src={source} />
}

function NavigationList({ items }: { items: AppShellNavigationItem[] }) {
  return (
    <ul className="signal-app-shell__navigation-list">
      {items.map(({ disabled, icon, label, ...item }) => {
        const content = <>{icon ? <span aria-hidden="true" className="signal-nav-item__icon">{icon}</span> : null}<span className="signal-nav-item__label">{label}</span></>
        return (
          <li key={`${item.href ?? 'disabled'}:${label}`}>
            {disabled ? (
              <button aria-disabled="true" className="signal-nav-item" disabled type="button">{content}</button>
            ) : (
              <NavItem {...item} icon={icon}>{label}</NavItem>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function AppShell({
  brandName = 'Relay',
  children,
  className,
  identity,
  menuLabel = 'Open navigation menu',
  navigation,
  navigationLabel = 'Primary',
  onMenuClick,
  onThemeToggle,
  themeDisabled = false,
  themeLabel = 'Toggle color theme',
  utilityNavigation = [],
}: AppShellProps) {
  const classes = ['signal-app-shell', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <aside className="signal-app-shell__sidebar">
        <div className="signal-app-shell__brand">
          <span aria-hidden="true" className="signal-app-shell__brand-mark" />
          <span className="signal-app-shell__brand-name">{brandName}</span>
        </div>
        <nav aria-label={navigationLabel} className="signal-app-shell__navigation">
          <NavigationList items={navigation} />
        </nav>
        <div className="signal-app-shell__sidebar-footer">
          {utilityNavigation.length ? (
            <nav aria-label="Utility"><NavigationList items={utilityNavigation} /></nav>
          ) : null}
          <button aria-disabled={themeDisabled ? 'true' : undefined} className="signal-nav-item signal-app-shell__theme-link" disabled={themeDisabled} onClick={onThemeToggle} type="button">
            <span aria-hidden="true" className="signal-nav-item__icon"><AssetIcon source={sunIcon} /></span>
            <span className="signal-nav-item__label">{themeLabel}</span>
          </button>
          <UserIdentity initials={identity.initials} name={identity.name} avatarSrc={identity.avatarSrc} />
        </div>
      </aside>

      <header className="signal-app-shell__compact-header">
        <IconButton aria-label={menuLabel} icon={<AssetIcon source={menuIcon} />} onClick={onMenuClick} size="medium" variant="ghost" />
        <div className="signal-app-shell__compact-brand">
          <span aria-hidden="true" className="signal-app-shell__compact-mark" />
          <span>{brandName}</span>
        </div>
        <IconButton aria-label={themeLabel} disabled={themeDisabled} icon={<AssetIcon source={sunIcon} />} onClick={onThemeToggle} size="medium" variant="ghost" />
      </header>

      <main className="signal-app-shell__content">{children}</main>
    </div>
  )
}
