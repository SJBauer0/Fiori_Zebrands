import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { format, utcToZonedTime } from 'date-fns-tz';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { FC, useEffect, useRef, useState } from 'react';
import { ComposedChart } from '../charts';
import { Spinner } from '../index';
import Reporte from './Reporte';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/metricas`;

export interface chartArrayType {
  name: string;
  url: string;
  type: number;
  data: { nombre: string; total_story_points: number }[];
}

type DataPropertyType = chartArrayType['data'][0];

interface ModalReporteProps {
  setIsOpen: (isOpen: boolean) => void;
}

const ModalReporte: FC<ModalReporteProps> = ({ setIsOpen }) => {
  const chartDoneSRef = useRef<HTMLDivElement>(null);
  const chartToDoSRef = useRef<HTMLDivElement>(null);
  const chartDoneERef = useRef<HTMLDivElement>(null);
  const chartToDoERef = useRef<HTMLDivElement>(null);
  const [charts, setCharts] = useState<chartArrayType[]>([]);

  const [dataDoneAcumS, setDataDoneAcumS] = useState<
    DataPropertyType[]
  >([]);
  const [dataToDoAcumS, setDataToDoAcumS] = useState<
    DataPropertyType[]
  >([]);

  const [dataDoneAcumE, setDataDoneAcumE] = useState<
    DataPropertyType[]
  >([]);
  const [dataToDoAcumE, setDataToDoAcumE] = useState<
    DataPropertyType[]
  >([]);

  const date = new Date();
  const userTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = utcToZonedTime(date, userTimeZone);
  const today = format(localDate, 'dd/MM/yyyy');

  const getCanvasURL = async (
    node: HTMLElement | null
  ): Promise<string | undefined> => {
    if (!node) return;
    const canvasTemp = await html2canvas(node);
    const newChartImageUrl = canvasTemp.toDataURL('image/jpeg', 1.0);
    return newChartImageUrl;
  };

  const createChartArrayItem = async (
    data: DataPropertyType[],
    name: string,
    type: number,
    ref: React.RefObject<HTMLDivElement>
  ): Promise<chartArrayType | null> => {
    if (data && data.length > 0) {
      const url = await getCanvasURL(ref.current);
      if (url) {
        return { name, url, type, data };
      }
    }
    return null;
  };

  const getAllData = async () => {
    try {
      const { data: dataDoneAcumS } = await axios.get(
        `${URI}/SUMdoneglobal`
      );
      const { data: dataToDoAcumS } = await axios.get(
        `${URI}/SUMtodoglobal`
      );
      const { data: dataDoneAcumE } = await axios.get(
        `${URI}/epicsSUMdoneglobal`
      );
      const { data: dataToDoAcumE } = await axios.get(
        `${URI}/epicsSUMtodoglobal`
      );
      if (dataDoneAcumS)
        setDataDoneAcumS(dataDoneAcumS.sprints[0].reverse());
      if (dataToDoAcumS)
        setDataToDoAcumS(dataToDoAcumS.sprints[0].reverse());
      if (dataDoneAcumE) setDataDoneAcumE(dataDoneAcumE.sprints[0]);
      if (dataToDoAcumE) setDataToDoAcumE(dataToDoAcumE.sprints[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      const chartDoneSPromise = createChartArrayItem(
        dataDoneAcumS,
        'Story points en Done acumulados en los últimos 5 sprints',
        1,
        chartDoneSRef
      );

      const chartToDoSPromise = createChartArrayItem(
        dataToDoAcumS,
        'Story points en To Do acumulados en los últimos 5 sprints',
        1,
        chartToDoSRef
      );

      const chartDoneEPromise = createChartArrayItem(
        dataDoneAcumE,
        'Story points en Done acumulados en los últimos 5 epics',
        2,
        chartDoneERef
      );

      const chartToDoEPromise = createChartArrayItem(
        dataToDoAcumE,
        'Story points en To Do acumulados en los últimos 5 epics',
        2,
        chartToDoERef
      );

      const fetchedCharts = await Promise.all([
        chartDoneSPromise,
        chartToDoSPromise,
        chartDoneEPromise,
        chartToDoEPromise,
      ]);

      setCharts(
        fetchedCharts.filter(
          (chart) => chart !== null
        ) as chartArrayType[]
      );
    };

    fetchCharts();
  }, [dataDoneAcumS, dataToDoAcumS, dataDoneAcumE, dataToDoAcumE]);

  const canvasSprints = charts.filter((chart) => chart.type === 1);
  const canvasEpics = charts.filter((chart) => chart.type === 2);

  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <>
      <Blanket isTinted={true}>
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col w-full h-full items-center justify-center opacity-0"
        >
          <div className="flex flex-col bg-white rounded p-10 gap-4 lg:gap-7 items-center justify-center drop-shadow-lg h-[32vh] w-[90vw] lg:w-[70vw] lg:h-[85vh]">
            <div className="flex w-full justify-between items-center">
              <p className="text-textNormal font-semibold text-base">
                Reporte
              </p>
              <div
                className="flex items-center justify-center cursor-pointer p-1"
                onClick={() => setIsOpen(false)}
              >
                <CrossIcon label="cerrar modal" size="small" />
              </div>
            </div>
            <div className="w-full h-0 lg:h-full overflow-hidden lg:border-[0.7rem] border-0 border-slate-300 rounded">
              {canvasSprints.length > 0 && canvasEpics.length > 0 ? (
                <PDFViewer width="100%" height="100%">
                  <Reporte
                    canvasSprints={canvasSprints}
                    canvasEpics={canvasEpics}
                  />
                </PDFViewer>
              ) : (
                <Spinner
                  message="Cargando previsualización del reporte..."
                  height="70%"
                />
              )}
              <div
                className="w-[40rem] h-[27rem]"
                ref={chartDoneSRef}
              >
                <ComposedChart
                  showHeights
                  data={dataDoneAcumS}
                  animation={false}
                />
              </div>

              <div
                className="w-[40rem] h-[27rem]"
                ref={chartToDoSRef}
              >
                <ComposedChart
                  showHeights
                  animation={false}
                  data={dataToDoAcumS}
                  barColor="#8838ff"
                  lineColor="#388bff"
                />
              </div>

              <div
                className="w-[40rem] h-[27rem]"
                ref={chartDoneERef}
              >
                <ComposedChart
                  showHeights
                  data={dataDoneAcumE}
                  animation={false}
                />
              </div>

              <div
                className="w-[40rem] h-[27rem]"
                ref={chartToDoERef}
              >
                <ComposedChart
                  showHeights
                  data={dataToDoAcumE}
                  animation={false}
                  barColor="#8838ff"
                  lineColor="#388bff"
                />
              </div>
            </div>
            <div
              className="flex items-center justify-end
            w-full gap-10 lg:flex-row flex-col"
            >
              <Button
                className="order-2 lg:order-1"
                appearance="default"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              {canvasSprints.length > 0 && canvasEpics.length > 0 ? (
                <Button
                  appearance="primary"
                  className="order-1 lg:order-2"
                >
                  <PDFDownloadLink
                    document={
                      <Reporte
                        canvasSprints={canvasSprints}
                        canvasEpics={canvasEpics}
                      />
                    }
                    fileName={`RetroZeb_${today}.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      loading
                        ? 'Cargando el reporte...'
                        : 'Descargar reporte'
                    }
                  </PDFDownloadLink>
                </Button>
              ) : (
                <Button
                  appearance="primary"
                  isDisabled
                  className="order-1 lg:order-2"
                >
                  Cargando el reporte...
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </Blanket>
    </>
  );
};

export default ModalReporte;
