import { PartialValues, createForm, getValues, reset, setValue } from "@modular-forms/solid"
import { debounce } from "@solid-primitives/scheduled"
import { useNavigate, useParams } from "@solidjs/router"
import { isArray, isEqual, isPlainObject, pickBy } from "lodash"
import { createEffect } from "solid-js"

const usePageFilter = <FilterValues extends { [key: string]: any }>({
  basePath,
  paramName,
  localStorageKey,
  initialValues,
  parse,
  serialize
}: {
  basePath: string
  paramName: string
  localStorageKey?: string
  initialValues: PartialValues<FilterValues>
  serialize: (values: PartialValues<FilterValues>) => string
  parse: (value: string) => FilterValues
}) => {
  const params = useParams()
  const navigate = useNavigate()

  const paramFilterValues = () => ({
    ...(initialValues as any),
    ...parse(
      (params[paramName] && decodeURIComponent(params[paramName])) ||
        (localStorageKey && localStorage.getItem(localStorageKey)) ||
        "{}"
    )
  })

  const hasFilterValues = (value: any): boolean => {
    if (isArray(value)) {
      return value.length > 0
    }

    if (isPlainObject(value)) {
      return Object.values(value).some((value) => hasFilterValues(value))
    }

    return value != null && value !== ""
  }

  const [form] = createForm<FilterValues>({
    initialValues: paramFilterValues()
  })

  const data = () => pickBy(getValues(form), hasFilterValues)

  const filterCount = () => {
    return Object.values(data()).filter(hasFilterValues).length
  }

  const updateFilters = debounce((filters: string) => {
    if (localStorageKey) localStorage.setItem(localStorageKey, filters)
    navigate([basePath, filters].join("/"))
  }, 500)

  const clearFilters = () => {
    reset(form, { initialValues })
  }

  createEffect(() => {
    if (!hasFilterValues(paramFilterValues()) && !hasFilterValues(data())) {
      return
    }

    if (isEqual(data(), paramFilterValues())) {
      return
    }

    updateFilters(serialize(data() as PartialValues<FilterValues>))
  })

  return {
    form,
    hasFilterValues: () => hasFilterValues(data()),
    filterCount,
    clearFilters,
    setFilterValue: (name: keyof FilterValues, value: any) => setValue(form, name as any, value)
  }
}

export default usePageFilter
