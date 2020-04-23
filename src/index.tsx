import React, {
  useRef,
  useState,
  useMemo,
  CSSProperties,
  ReactNode,
  Key
} from 'react'
import { PortalWithState } from 'react-portal'
import styles from './styles.module.css'

function deepClone<T>(obj: T): T {
  if (Array.isArray(obj)) {
    const arr = []
    for (let i = 0; i < obj.length; i++) {
      arr[i] = deepClone(obj[i])
    }

    // @ts-ignore
    return arr
  }

  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      // @ts-ignore
      cloned[key] = deepClone(obj[key])
    }

    // @ts-ignore
    return cloned
  }

  return obj
}

export interface Item {
  key: Key
  title: ReactNode
  value?: boolean | ReactNode
  checked?: boolean
}

export interface Setting extends Item {
  entries?: string[] | Setting[]
  allowCustomValue?: boolean
  onOtherValueSelected?: () => ReactNode
}

interface PageItem extends Item {
  onClick: () => void
}

interface Page {
  key: Key
  title?: ReactNode
  allowCustomValue?: boolean
  onOtherValueSelected?: () => ReactNode
  multiselectable?: boolean
  items: PageItem[]
  onBackClick?: () => void
}

export interface MenuProps {
  settings: Setting[]
  // onOtherSelect?: () => ReactNode
  title?: ReactNode
  // multiselectable: boolean
  // allowCustomValue: boolean
  onChange?: (settings: Setting[]) => void
}

export interface Props extends MenuProps {
  hd?: boolean
  active?: boolean
  className?: string
  menuClassName?: string
  style?: CSSProperties
  settings: Setting[]
  onChange?: (settings: Setting[]) => void
}

const Menu = ({ settings, onChange = () => {} }: MenuProps) => {
  const [current, setCurrent] = useState<Key>('main')

  const pages = useMemo(() => {
    const _settings = deepClone(settings)

    const pages: Page[] = []

    const boolToReactNode = (value: boolean) => {
      // TODO use switch!
      return value ? 'Yep' : 'Nope'
    }

    const getMeta = (setting: Setting | undefined, key?: Key) => {
      if (!setting) return {}

      return {
        title: setting.title,
        allowCustomValue: setting.allowCustomValue,
        onOtherValueSelected: setting.onOtherValueSelected,
        multiselectable:
          setting.entries &&
          setting.entries.length > 0 &&
          typeof setting.entries[0] === 'string',
        onBackClick: () => key && setCurrent(key)
      }
    }

    const fillPage = (
      items: string[] | Setting[],
      key: Key,
      parent?: Setting,
      parentKey?: Key
    ) => {
      let _items: Setting[]
      if (items.length && typeof items[0] === 'string') {
        // @ts-ignore
        _items = items.map((str: string) => ({
          key: str,
          title: str,
          value: undefined,
          checked: str === parent?.value
        }))
      } else {
        _items = items as Setting[]
      }

      const page: Partial<Page> = {
        items: _items.map((s) => {
          if (s.entries) {
            fillPage(s.entries, s.key, s, key)
          }

          return {
            key: s.key,
            title: s.title,
            checked: s.checked,
            value:
              typeof s.value === 'boolean' ? boolToReactNode(s.value) : s.value,
            onClick: () => {
              if (s.entries) {
                setCurrent(s.key)
                return
              }

              if (typeof s.value === 'boolean') {
                s.value = !s.value
              } else {
                if (parent) {
                  parent.value = s.title
                  if (parentKey) {
                    setCurrent(parentKey)
                  }
                }
              }

              onChange(_settings)
            }
          }
        }),
        ...getMeta(parent, parentKey)
      }

      page.key = key
      pages.push(page as Page)
    }

    fillPage(_settings, 'main')
    return pages
  }, [settings])

  return (
    <React.Fragment>
      {pages.map((page) => (
        <div
          className={[
            styles.panel,
            current === page.key && styles.current
          ].join(' ')}
          key={page.key}
        >
          <React.Fragment>
            {page.title && (
              <div className={styles.header}>
                <div onClick={page.onBackClick}>{page.title}</div>
                {page.allowCustomValue && (
                  <div onClick={page.onOtherValueSelected}>Other</div>
                )}
              </div>
            )}

            <div
              aria-multiselectable={page.multiselectable}
              className={styles.menu}
            >
              {page.items.map((item) => (
                <div
                  key={item.key}
                  className={styles.item}
                  onClick={item.onClick}
                  aria-checked={item.checked}
                >
                  <div>{item.title}</div>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>
          </React.Fragment>
        </div>
      ))}
    </React.Fragment>
  )
}

const SettingButton = ({
  style,
  className,
  menuClassName,
  hd,
  settings,
  onChange
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <PortalWithState closeOnOutsideClick closeOnEsc>
      {({ openPortal, isOpen, portal }) => (
        <React.Fragment>
          <div
            ref={ref}
            className={[styles.button, className, hd && styles.hd].join(' ')}
            aria-expanded={isOpen}
            style={style}
            onClick={openPortal}
          >
            <svg height='100%' version='1.1' viewBox='0 0 36 36' width='100%'>
              <path d='m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z' />
            </svg>
          </div>

          {portal(
            <div className={styles.portal}>
              <div className={[styles.container, menuClassName].join(' ')}>
                <Menu onChange={onChange} settings={settings} />
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </PortalWithState>
  )
}

export default SettingButton
