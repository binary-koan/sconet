import { useLocation, useNavigate, useParams } from "@solidjs/router"
import { createMemo, createSignal } from "solid-js"
import { isEmpty, isEqual } from "lodash"
import { debounce } from "@solid-primitives/scheduled"

const usePageFilter = <FilterValues extends object>({
  initialValues,
  serialize = (values) => JSON.stringify(values),
  deserialize = (param) => JSON.parse(param),
  route
}: {
  initialValues: FilterValues
  serialize?: (values: FilterValues) => string
  deserialize?: (param: string) => FilterValues
  route: string
}) => {
  const { pathname } = useLocation()
  const { filters = "{}" } = useParams()
  const navigate = useNavigate()

  const activeFilterValues = createMemo<Partial<FilterValues>>(() => {
    try {
      return deserialize(filters)
    } catch (e) {
      console.error(e)
      return {}
    }
  })

  const [filterValues, setFilterValues] = createSignal<FilterValues>({
    ...initialValues,
    ...activeFilterValues
  })

  const hasFilterValues = () =>
    Object.values(filterValues()).some((value) => {
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

    if (isEqual(filterValues(), activeFilterValues())) {
      return
    }

    navigate(`${route}?filters=${encodeURIComponent(serialize(filterValues()))}`)
  })

  return {
    activeFilterValues,
    filterValues,
    hasFilterValues,
    setFilterValues: (values: Partial<FilterValues>) => {
      setFilterValues(() => ({ ...initialValues, ...values }))
      updateFilters()
    }
  }
}

export default usePageFilter
