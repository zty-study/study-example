import type {
  LocationQueryRaw,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
  NavigationGuardNext
} from 'vue-router'

const jumpLogin = (
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
) => {
  next({
    name: 'login',
    query: {
      redirect: encodeURIComponent(to.fullPath),
      ...to.query
    } as LocationQueryRaw
  })
}

export default async function setupUserLoginInfoGuard(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
): Promise<boolean> {
  const userStore = useUserStore()

  if (userStore.hasLogin) {
    if (to.name === 'login' || to.name === 'Login') {
      next({ name: 'Home' })
      return true
    }

    return false
  } else {
    if (to.name === 'login' || to.name === 'Login') next()
    else jumpLogin(to, from, next)
    return true
  }
}
