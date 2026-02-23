/**
 * Icon setup — Configure Iconify to load icons from bundled @iconify/json
 * 
 * This ensures icons work offline in the Electron app.
 * Remote API fetching is disabled to avoid CSP violations in Electron.
 */
import { addCollection, _api } from '@iconify/vue'

// Disable remote API — all icons must come from the bundle.
// This prevents CSP violations in Electron when an icon isn't found locally.
_api.setFetch(() => {
  return Promise.resolve(new Response('{}', { status: 404 }))
})

// Import MDI icon set (most commonly used)
import mdiIcons from '@iconify/json/json/mdi.json'

// Add the collection to Iconify
addCollection(mdiIcons)

console.log('[Icons] MDI icon set loaded:', Object.keys(mdiIcons.icons).length, 'icons')
