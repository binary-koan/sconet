import { Box } from "@hope-ui/solid"
import { Component, createEffect, onCleanup, onMount } from "solid-js"
import * as echarts from "echarts"
import { getCssValue } from "../../utils/getCssValue"
import { orderBy } from "lodash"

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
      roseType: "radius",
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
            fontFamily: getCssValue("--hope-fonts-sans"),
            color: getCssValue("--hope-colors-neutral11")
          },
          labelLine: {
            lineStyle: {
              color: getCssValue("--hope-colors-neutral9")
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
            fontFamily: getCssValue("--hope-fonts-sans"),
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

  return (
    <Box
      ref={container}
      position="relative"
      width={{ "@initial": "100vw", "@lg": "$containerSm" }}
      height={{ "@initial": "100vw", "@lg": "$containerSm" }}
      margin={{ "@initial": "0 auto", "@lg": "0" }}
    />
  )
}
