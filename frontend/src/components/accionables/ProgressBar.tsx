import React, { FC } from 'react';

interface ProgressBarProps {
  createdAt: string;
  fechaLimite: string;
}

const ProgressBar: FC<ProgressBarProps> = ({
  createdAt,
  fechaLimite,
}) => {
  const today = new Date();
  const fechaInicio = new Date(createdAt);
  const fechaFin = new Date(fechaLimite);

  const totalDuration = Math.ceil(
    (fechaFin.getTime() - fechaInicio.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const progressDuration = Math.ceil(
    (today.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage = Math.min(
    (progressDuration / totalDuration) * 100,
    100
  );

  const isOverdue = today > fechaFin;

  return (
    <div className="w-full h-1.5 bg-gray-300 rounded">
      <div
        className={`h-1.5 rounded ${
          isOverdue ? 'bg-red-500' : 'bg-blue-500'
        }`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
