import React, { FC, useState } from 'react';
import Piechart from '../../components/charts/Piechart';
import DropdownSprints from '../../components/charts/DropdownSprints';
import StackedBarChart from '../../components/charts/StackedBarchart';

interface MetricasSprintProps {}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  }
];

const MetricasSprint: FC<MetricasSprintProps> = ({}) => {
  const [sprintsSeleccionadas, setSprintsSeleccionadas] =
    useState<any>([]);
  const handleSprintSeleccionados = (sprints: string[]) => {
    setSprintsSeleccionadas(sprints);
  };

  return (
    <div className="w-full">
      <div className="py-5 flex justify-left gap-6 border-b-2 border-zinc-200">
        <div className="flex items-center">
          <label className="text-lg pr-4">Sprint:</label>
          <DropdownSprints
            sprintsActuales={[]}
            onSprintsSeleccionadasChange={handleSprintSeleccionados}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 justify-center">
        <div className="grid justify-items-center">
          <div className="">
            <label className="text-2xl">
              {' '}
              Storypoints Totales y Completados
            </label>
          </div>
          <div className="">
            <StackedBarChart data={data} />
          </div>
        </div>
        <div className="grid justify-items-center">
          <div>
            <label className="text-2xl">
              {' '}
              Issues Totales y Completados
            </label>
          </div>
          <div className="pl-20 pt-12">
            <Piechart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasSprint;
