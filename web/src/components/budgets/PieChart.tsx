import * as echarts from "echarts"
import { orderBy } from "lodash"
import { Component, createEffect, onCleanup } from "solid-js"
import { getCssValue } from "../../utils/getCssValue.ts"

export const PieChart: Component<{
  data: Array<{ name: string; color: string; value: number; formattedValue: string }>
}> = (props) => {
  let container: HTMLDivElement | undefined

  createEffect(() => {
    const chartData = orderBy(props.data, "value", "desc")

    const chart = echarts.init(
      container!,
      {},
      {
        renderer: "canvas",
        useDirtyRect: false
      }
    )

    const baseSeriesOptions = {
      type: "pie",
      radius: "60%",
      center: ["50%", "50%"],
      data: chartData,
      animation: false
    }

    chart.setOption({
      tooltip: {
        trigger: "item"
      },
      color: chartData.map(({ color }) => color),
      series: [
        {
          ...baseSeriesOptions,
          label: {
            fontFamily: getComputedStyle(document.body).fontFamily,
            color: getCssValue("--color-gray-800")
          },
          labelLine: {
            lineStyle: {
              color: getCssValue("--color-gray-600")
            },
            smooth: 0.2,
            length: 8,
            length2: 10
          },
          itemStyle: {
            color: "transparent"
          }
        },
        {
          ...baseSeriesOptions,
          label: {
            color: "white",
            position: "inside",
            fontFamily: getComputedStyle(document.body).fontFamily,
            formatter: ({ data }: any) => data.formattedValue
          },
          itemStyle: {
            shadowBlur: 200,
            shadowColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 5
          }
        }
      ]
    })

    const resizeListener = () => chart.resize()

    window.addEventListener("resize", resizeListener)

    onCleanup(() => {
      chart.dispose()
      window.removeEventListener("resize", resizeListener)
    })
  })

  return <div class="relative mx-auto aspect-square w-screen max-w-xl lg:mx-0" ref={container} />
}
