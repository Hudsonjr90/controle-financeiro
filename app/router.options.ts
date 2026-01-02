import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Se houver uma posição salva (navegação de volta), use-a
    if (savedPosition) {
      return savedPosition
    }
    
    // Se houver um hash na URL (âncora), role para esse elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    
    // Sempre role para o topo ao navegar para uma nova página
    return { top: 0 }
  },
}

