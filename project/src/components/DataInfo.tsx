import React from 'react';

interface DataInfoProps {
  dataInfo: string;
}

const DataInfo: React.FC<DataInfoProps> = ({ dataInfo }) => {
  return (
    <div>
      <h2>Data Info</h2>
      <pre>{dataInfo}</pre>
    </div>
  );
};

export default DataInfo;