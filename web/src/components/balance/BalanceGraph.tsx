import * as echarts from "echarts"
import { Component, createEffect, onCleanup } from "solid-js"

export const BalanceGraph: Component<{
  currencySymbol: string
  incomes: number[]
  spendings: number[]
  balances: number[]
}> = (props) => {
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

    const colors = ["#5470C6", "#91CC75", "#EE6666"]

    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        }
      },
      color: colors,
      legend: {
        data: ["Income", "Spending", "Balance"]
      },
      xAxis: [
        {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
      ],
      yAxis: [
        {
          type: "value",
          name: props.currencySymbol,
          position: "left",
          alignTicks: true,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: `${props.currencySymbol}{value}`
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
          data: props.balances
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
    <div class="relative mx-auto mt-8 aspect-square w-screen max-w-xl lg:mx-0" ref={container} />
  )
}