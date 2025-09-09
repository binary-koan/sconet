import { useNavigate } from "@solidjs/router"
import * as echarts from "echarts"
import { Component, createEffect, onCleanup } from "solid-js"
import { getCssValue } from "../../utils/getCssValue.ts"

export const BalanceGraph: Component<{
  year: string
  currencySymbol: string
  incomes: number[]
  spendings: number[]
  balances: number[]
}> = (props) => {
  const navigate = useNavigate()

  let container: HTMLDivElement | undefined

  createEffect(() => {
    const chart = echarts.init(
      container!,
      {},
      {
        renderer: "canvas",
        useDirtyRect: false
      }
    )

    const colors = [
      getCssValue("--color-green-400"),
      getCssValue("--color-red-400"),
      getCssValue("--color-gray-800")
    ]

    chart.setOption({
      grid: {
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: number) => `${props.currencySymbol}${value.toFixed(2)}`,
        axisPointer: {
          type: "cross"
        },
        textStyle: {
          fontFamily: getComputedStyle(document.body).fontFamily
        }
      },
      color: colors,
      legend: {
        data: ["Income", "Spending", "Balance"],
        textStyle: {
          fontFamily: getComputedStyle(document.body).fontFamily
        }
      },
      xAxis: [
        {
          type: "category",
          data: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          axisLabel: {
            fontFamily: getComputedStyle(document.body).fontFamily
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          position: "left",
          alignTicks: true,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: (value: number) => `${props.currencySymbol}${value.toFixed(2)}`,
            fontFamily: getComputedStyle(document.body).fontFamily
          }
        }
      ],
      series: [
        {
          name: "Income",
          type: "bar",
          stack: "one",
          data: props.incomes
        },
        {
          name: "Spending",
          type: "bar",
          stack: "one",
          data: props.spendings
        },
        {
          name: "Balance",
          type: "line",
          data: props.balances,
          symbol: "circle",
          symbolSize: 8
        }
      ]
    })

    // eslint-disable-next-line solid/reactivity
    chart.on("click", (params) => {
      if (params.componentType === "series") {
        navigate(
          `/graphs/budgets/${props.year}-${(params.dataIndex + 1).toString().padStart(2, "0")}`
        )
      }
    })

    const resizeListener = () => chart.resize()

    window.addEventListener("resize", resizeListener)

    onCleanup(() => {
      chart.dispose()
      window.removeEventListener("resize", resizeListener)
    })
  })

  return <div class="relative mt-8 h-[60vh] w-full" ref={container} />
}
