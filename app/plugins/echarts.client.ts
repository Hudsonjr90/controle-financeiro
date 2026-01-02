import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent,
  GridComponent 
} from "echarts/components";

export default defineNuxtPlugin(() => {
  // Registrar componentes do ECharts
  use([
    CanvasRenderer,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  ]);
});