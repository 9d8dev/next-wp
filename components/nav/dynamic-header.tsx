import { Header } from './header'
import { getPrimaryMenu, buildMenuTree } from '@/lib/wordpress-menu'
import { mainMenu } from '@/menu.config'

/**
 * Server Component that fetches menu data and renders the Header
 */
export async function DynamicHeader() {
  try {
    // Fetch menu data from WordPress
    const menu = await getPrimaryMenu()
    
    // Build hierarchical menu structure
    let menuItems = menu?.items ? buildMenuTree(menu.items) : []
    
    // If no menu items from WordPress, use fallback
    if (menuItems.length === 0) {
      console.warn('No menu items from WordPress, using fallback static menu')
      menuItems = Object.entries(mainMenu).map(([key, url], index) => ({
        id: index + 1,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        url: url as string,
        target: '_self',
        classes: [],
      }))
    }

    return <Header menuItems={menuItems} />
  } catch (error) {
    console.error('Failed to fetch WordPress menu, using fallback:', error)
    
    // Fallback to static menu config if WordPress menu fails
    const fallbackItems = Object.entries(mainMenu).map(([key, url], index) => ({
      id: index + 1,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      url: url as string,
      target: '_self',
      classes: [],
    }))
    
    return <Header menuItems={fallbackItems} />
  }
}

