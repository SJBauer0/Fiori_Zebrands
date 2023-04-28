import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { FC, useState, useEffect, memo } from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';
import type { chartArrayType } from './ModalReporte';
import InterRegular from '@/assets/fonts/Inter-Regular.ttf';
import InterMedium from '@/assets/fonts/Inter-Medium.ttf';
import InterSemiBold from '@/assets/fonts/Inter-SemiBold.ttf';
import InterBold from '@/assets/fonts/Inter-Bold.ttf';
import {
  calculateAverage,
  calculatePercentageChange,
  calculateRateOfChange,
} from './calculations';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: InterRegular,
      fontWeight: 400,
    },
    {
      src: InterMedium,
      fontWeight: 500,
    },
    {
      src: InterSemiBold,
      fontWeight: 700,
    },
    {
      src: InterBold,
      fontWeight: 800,
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    flexDirection: 'column',
    gap: 17,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  section: {
    flexDirection: 'column',
    gap: 5,
  },
  fecha: {
    marginTop: 3,
    fontSize: 8,
    fontFamily: 'Inter',
    lineHeight: 1.5,
    color: '#626f86',
  },
  text: {
    fontSize: 10,
    fontFamily: 'Inter',
    lineHeight: 1.5,
    color: '#44546f',
  },
  h1: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 800,
    color: '#0055CC',
  },
  h2: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 700,
    color: '#1A3B6A',
  },
  h3: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#0B6CFF',
  },
  chartTitle: {
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#424242',
  },
  chartView: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
  },
  chart: {
    marginTop: 10,
    width: '50%',
    height: '100%',
  },
  chartsWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 400,
    marginTop: 10,
    gap: 18,
  },
  number: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#5E4DB2',
  },
});
interface ReporteProps {
  canvasSprints: chartArrayType[];
  canvasEpics: chartArrayType[];
}

export type DataPropertyType = chartArrayType['data'][0];

const Reporte: FC<ReporteProps> = ({
  canvasSprints,
  canvasEpics,
}) => {
  const [sprintDoneData, setSprintDoneData] = useState<
    DataPropertyType[]
  >([]);
  const [sprintToDoData, setSprintToDoData] = useState<
    DataPropertyType[]
  >([]);
  const [epicDoneData, setEpicDoneData] = useState<
    DataPropertyType[]
  >([]);
  const [epicToDoData, setEpicToDoData] = useState<
    DataPropertyType[]
  >([]);
  const date = new Date();
  const userTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = utcToZonedTime(date, userTimeZone);
  const today = format(localDate, 'dd/MM/yyyy HH:mm');

  useEffect(() => {
    if (canvasSprints.length > 0) {
      setSprintDoneData(canvasSprints[0].data);
      setSprintToDoData(canvasSprints[1].data);
    }
  }, [canvasSprints]);

  useEffect(() => {
    if (canvasEpics.length > 0) {
      setEpicDoneData(canvasEpics[0].data.reverse());
      setEpicToDoData(canvasEpics[1].data.reverse());
    }
  }, [canvasEpics]);

  const lastSprint = sprintDoneData[sprintDoneData.length - 1];

  const sprintDoneRateOfChange = sprintDoneData
    ? calculateRateOfChange(sprintDoneData)
    : 0;
  const sprintToDoRateOfChange = sprintToDoData
    ? calculateRateOfChange(sprintToDoData)
    : 0;
  const sprintDoneAverage = sprintDoneData
    ? calculateAverage(sprintDoneData)
    : 0;
  const sprintToDoAverage = sprintToDoData
    ? calculateAverage(sprintToDoData)
    : 0;
  const epicDoneAverage = epicDoneData
    ? calculateAverage(epicDoneData)
    : 0;
  const epicToDoAverage = epicToDoData
    ? calculateAverage(epicToDoData)
    : 0;
  const sprintDonePercentageChange = sprintDoneData
    ? calculatePercentageChange(sprintDoneData)
    : 0;
  const sprintToDoPercentageChange = sprintToDoData
    ? calculatePercentageChange(sprintToDoData)
    : 0;
  return (
    <Document>
      <Page size={'A4'} style={styles.body}>
        <View style={styles.section}>
          <View>
            <Text style={styles.h1}>
              Reporte de métricas | RetroZeb
            </Text>
            <Text style={styles.fecha}>
              Fecha de generación de reporte: {today}
            </Text>
          </View>
          <Text style={styles.text}>
            Este informe te proporcionará una visión general de cómo
            ha estado progresando el equipo en términos de rendimiento
            y eficacia en los últimos sprints. El reporte tiene como
            objetivo ayudar a entender mejor cómo se ha estado
            trabajando juntos para alcanzar las metas propuestas.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Métricas</Text>
          <Text style={styles.text}>
            A continuación se muestran las métricas de los sprints y
            epics del proyecto. Se presentarán gráficos con
            información relevante sobre el progreso del equipo, el
            rendimiento y la eficiencia en cada sprint y epic,
            respectivamente.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h3}>Métricas por sprint</Text>
          <Text style={styles.text}>
            En esta sección se presentan las métricas para los sprint.
            Cada barra de las gráficas representa a un sprint, y se
            ordenan de la fecha de inicio más antigua (extremo
            izquierdo) a la más reciente (extremo derecho).
          </Text>
          <View style={styles.chartsWrapper}>
            {canvasSprints.map((chart, index) => (
              <View style={styles.chartView} key={index}>
                <Text style={styles.chartTitle}>{chart.name}</Text>
                <Image
                  key={index}
                  style={styles.chart}
                  src={chart.url}
                />
              </View>
            ))}
          </View>
          <Text style={{ ...styles.text, marginTop: 10 }}>
            En el primer gráfico "Story points en Done acumulados en
            los últimos sprints" se muestra la comparación de los
            story points que, en el último Sprint{' '}
            {sprintDoneData.length > 0 && (
              <Text style={styles.text}>"{lastSprint.nombre}"</Text>
            )}
            , se alcanzó un total de story points en Done acumulados
            de{' '}
            {sprintDoneData.length > 0 && (
              <Text style={styles.number}>
                {lastSprint.total_story_points}
              </Text>
            )}
            . La tasa de cambio en los story points en Done entre los
            dos últimos sprints es de{' '}
            <Text style={styles.number}>
              {sprintDoneRateOfChange}
            </Text>{' '}
            y en To Do es de{' '}
            <Text style={styles.number}>
              {sprintToDoRateOfChange}
            </Text>
            . Además, el promedio de story points en Done por sprint
            es de{' '}
            <Text style={styles.number}>{sprintDoneAverage}</Text>,
            mientras que en To Do es de{' '}
            <Text style={styles.number}>{sprintToDoAverage}</Text>. La
            variación porcentual en los story points en Done entre los
            dos últimos sprints es del{' '}
            <Text style={styles.number}>
              {sprintDonePercentageChange}
            </Text>
            %, mientras que en To Do es del{' '}
            <Text style={styles.number}>
              {sprintToDoPercentageChange}
            </Text>
            %.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h3}>Métricas por epic</Text>
          <Text style={styles.text}>
            En esta sección se presentan las métricas para los epic.
            Cada barra de las gráficas representa a un epic, y se
            ordenan de la fecha de inicio más antigua (extremo
            izquierdo) a la más reciente (extremo derecho). Los epics
            (por orden de aparición) son los siguientes:{' '}
            {epicDoneData.map((epic, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    ...styles.text,
                    fontWeight: 500,
                    color: '#8938ff',
                  }}
                >
                  {index === epicDoneData.length - 1 && (
                    <Text style={{ ...styles.text, fontWeight: 400 }}>
                      {' '}
                      y{' '}
                    </Text>
                  )}
                  {epic.nombre}
                  {index < epicDoneData.length - 2 && (
                    <Text style={{ ...styles.text, fontWeight: 400 }}>
                      ,{' '}
                    </Text>
                  )}
                </Text>
              );
            })}
            .
          </Text>
          <View style={styles.chartsWrapper}>
            {canvasEpics.map((chart, index) => (
              <View style={styles.chartView} key={index}>
                <Text style={styles.chartTitle}>{chart.name}</Text>
                <Image
                  key={index}
                  style={styles.chart}
                  src={chart.url}
                />
              </View>
            ))}
          </View>
          <Text style={styles.text}>
            Para los epics, el promedio de story points en Done por
            epic es de{' '}
            <Text style={styles.number}>{epicDoneAverage}</Text>,
            mientras que en To Do es de{' '}
            <Text style={styles.number}>{epicToDoAverage}</Text>.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Este reporte brinda una visión del desempeño del equipo en
            sprints y epics recientes. Usando esta información, se
            puede ajustar la planificación y metas a corto, mediano y
            largo plazo, buscando siempre la mejora continua del
            rendimiento y eficiencia del equipo.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default memo(Reporte);
