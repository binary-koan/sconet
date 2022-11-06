import { createForm } from "@felte/solid"
import { debounce } from "@solid-primitives/scheduled"
import { useNavigate, useParams } from "@solidjs/router"
import { isArray, isEqual, isPlainObject, pickBy } from "lodash"
import { createEffect } from "solid-js"

const usePageFilter = <FilterValues extends object>({
  basePath,
  paramName,
  localStorageKey,
  initialValues
}: {
  basePath: string
  paramName: string
  localStorageKey?: string
  initialValues: FilterValues
}) => {
  const params = useParams()
  const navigate = useNavigate()

  const paramFilterValues = () => ({
    ...initialValues,
    ...JSON.parse(
      params[paramName] || (localStorageKey && localStorage.getItem(localStorageKey)) || "{}"
    )
  })

  const hasFilterValues = (value: any): boolean => {
    if (isArray(value)) {
      return value.some((value) => hasFilterValues(value))
    }

    if (isPlainObject(value)) {
      return Object.values(value).some((value) => hasFilterValues(value))
    }

    return value != null && value !== ""
  }

  const { form, data, setData } = createForm<FilterValues>({
    initialValues: paramFilterValues(),

    transform: (values: any) => pickBy(values, hasFilterValues) as FilterValues
  })

  const filterCount = () => {
    return Object.values(data()).filter(hasFilterValues).length
  }

  const updateFilters = debounce((filters: string) => {
    if (localStorageKey) localStorage.setItem(localStorageKey, filters)
    navigate([basePath, filters].join("/"))
  }, 500)

  const clearFilters = () => setData({ ...initialValues })

  createEffect(() => {
    if (!hasFilterValues(paramFilterValues()) && !hasFilterValues(data())) {
      return
    }

    if (isEqual(data(), paramFilterValues())) {
      return
    }

    updateFilters(JSON.stringify(data()))
  })

  return {
    form,
    hasFilterValues: () => hasFilterValues(data()),
    filterCount,
    clearFilters,
    setFilter: setData
  }
}

export default usePageFilter
