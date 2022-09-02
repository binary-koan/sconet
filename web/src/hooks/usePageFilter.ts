import { debounce } from "@solid-primitives/scheduled"
import { useLocation, useSearchParams } from "@solidjs/router"
import { isEmpty, isEqual } from "lodash"
import { createMemo } from "solid-js"
import { createStore } from "solid-js/store"

const usePageFilter = <FilterValues extends object>({
  initialValues,
  serialize = (values) => JSON.stringify(values),
  deserialize = (param) => JSON.parse(param)
}: {
  initialValues: Partial<FilterValues>
  serialize?: (values: Partial<FilterValues>) => string
  deserialize?: (param: string) => Partial<FilterValues>
}) => {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFilterValues = createMemo<Partial<FilterValues>>(() => {
    try {
      return deserialize(searchParams.filters || "{}")
    } catch (e) {
      console.error(e)
      return {}
    }
  })

  const [filterValues, setFilterValues] = createStore<Partial<FilterValues>>({
    ...initialValues,
    ...activeFilterValues
  })

  const hasFilterValues = () =>
    Object.values(filterValues).some((value) => {
      if (Array.isArray(value)) {
        return Boolean(value.length)
      }

      return Boolean(value)
    })

  const updateFilters = debounce(() => {
    if (!pathname) return

    if (isEmpty(activeFilterValues()) && !hasFilterValues()) {
      return
    }

    if (isEqual(filterValues, activeFilterValues())) {
      return
    }

    setSearchParams({ filters: serialize(filterValues) })
  }, 500)

  return {
    activeFilterValues,
    filterValues,
    hasFilterValues,
    setFilterValues: (values: Partial<FilterValues>) => {
      setFilterValues(values)
      updateFilters()
    }
  }
}

export default usePageFilter
