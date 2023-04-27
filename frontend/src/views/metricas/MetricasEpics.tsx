import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { ChartCards, DropdownEpics } from '../../components';
import { ComposedChart, PieChart } from '../../components/charts/';
import StackedBarChart from '../../components/charts/StackedBarchart';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/metricas`;

interface dataType {
  status: string;
  total_story_points: number | null;
}

const MetricasEpics: FC = ({}) => {
  const [epicsSeleccionadas, setEpicsSeleccionadas] =
    useState<any>(null);
  const handleEpicsSeleccionados = (epics: string[]) => {
    setEpicsSeleccionadas(epics);
  };

  const [chartData, setChartData] = useState<any[]>([]);
  const [chart2Data, setChart2Data] = useState<any[]>([]);
  const [chart3Data, setChart3Data] = useState<any[]>([]);
  const [chart4Data, setChart4Data] = useState<any[]>([]);
  const [chart5Data, setChart5Data] = useState<any[]>([]);
  const [chart6Data, setChart6Data] = useState<any[]>([]);

  const getData = async () => {
    if (epicsSeleccionadas === null) {
      setChartData([]);
      setChart2Data([]);
      return;
    }

    const response = await fetch(
      `${URI}/epic/${epicsSeleccionadas.value}`
    );
    const data = await response.json();
    const response2 = await fetch(
      `${URI}/epic/storypoints/${epicsSeleccionadas.value}`
    );
    const data2 = await response2.json();

    const updatedData = data.issues[0].map((item: dataType) => ({
      ...item,
      total_story_points:
        item.total_story_points === null
          ? 0
          : item.total_story_points,
    }));

    const updatedData2 = data2.issues[0].map((item: dataType) => ({
      ...item,
      total_story_points:
        item.total_story_points === null
          ? 0
          : item.total_story_points,
    }));

    setChartData(updatedData);
    setChart2Data(updatedData2);
  };

  const getEpicsDoneGlobal = async () => {
    try {
      const response = await axios.get(`${URI}/epicsdoneglobal`);
      const data = response.data.sprints[0];
      setChart3Data(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getToDoEpicsDoneGlobal = async () => {
    try {
      const response = await axios.get(`${URI}/epicstodoglobal`);
      const data = response.data.sprints[0];
      setChart4Data(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getEpicsDone = async () => {
    try {
      const response = await axios.get(`${URI}/epicsSUMdoneglobal`);
      const data = response.data.sprints[0];
      setChart5Data(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getToDoEpicsDone = async () => {
    try {
      const response = await axios.get(`${URI}/epicsSUMtodoglobal`);
      const data = response.data.sprints[0];
      setChart6Data(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    getEpicsDoneGlobal();
    getToDoEpicsDoneGlobal();
    getEpicsDone();
    getToDoEpicsDone();
  }, [epicsSeleccionadas]);

  return (
    <div className="flex flex-col gap-5">
      <div className="gap-4 flex flex-col justify-left p-7 w-full rounded border border-gray-200 bg-white items-center">
        <h2 className="flex-nowrap w-full font-medium text-sm text-information">
          Métricas generales por epic
        </h2>
        <div className="flex flex-col items-baseline gap-1 w-full">
          <p className="font-semibold text-xs text-label">Epics</p>
          <DropdownEpics
            onEpicsSeleccionadasChange={handleEpicsSeleccionados}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 justify-center gap-7 w-full h-auto md:h-[70rem]">
        <div className="md:col-span-2 ">
          <ChartCards title="Story points del epic">
            {chart2Data && chart2Data.length > 0 ? (
              <StackedBarChart data={chart2Data} />
            ) : (
              <p className="text-xs">
                No hay datos para graficar con el epic elegido
              </p>
            )}
          </ChartCards>
        </div>

        <ChartCards title="Comparación de sprints">
          {chartData && chartData.length > 0 ? (
            <PieChart data={chartData} />
          ) : (
            <p className="text-xs">
              No hay datos para graficar con el epic elegido
            </p>
          )}
        </ChartCards>
        <div className="md:col-span-3 flex flex-col md:flex-row gap-7">
          <ChartCards title="Story points en Done acumulados por epic">
            <ComposedChart data={chart5Data} isSprint={false} />
          </ChartCards>
          <ChartCards title="Story points en To Do acumulados por epic">
            <ComposedChart
              data={chart6Data}
              barColor="#8838ff"
              lineColor="#388bff"
              isSprint={false}
            />
          </ChartCards>
        </div>

        <div className="md:col-span-3 flex flex-col md:flex-row gap-7">
          <ChartCards title="Story points en Done por epic">
            <ComposedChart
              data={chart3Data}
              barColor="#8838ff"
              lineColor="#388bff"
              isSprint={false}
            />
          </ChartCards>

          <ChartCards title="Story points en To Do por epic">
            <ComposedChart data={chart4Data} isSprint={false} />
          </ChartCards>
        </div>
      </div>
    </div>
  );
};

export default MetricasEpics;
