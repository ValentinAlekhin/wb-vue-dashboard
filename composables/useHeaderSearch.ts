import { toReadonly } from '@vue/reactivity'

export const useHeaderSearch = createSharedComposable(() => {
  const name = useLocalStorage('header-search', '')

  const setName = (value: string) => name.value = value

  return { name: toReadonly(name), setName }
})
