import React from 'react';

interface NutritionTableProps {
  patientUuid: string;
}

const NutritionTable: React.FC<NutritionTableProps> = ({ patientUuid }) => {
  return <div>Nutrition Table</div>;
};

export default NutritionTable;
