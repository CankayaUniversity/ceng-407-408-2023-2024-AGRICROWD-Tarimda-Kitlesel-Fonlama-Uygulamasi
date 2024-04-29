import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectNameandId } = useParams();
  const [name, pid] = projectNameandId.split("-pid-");

  console.log('Encoded Project Name:', name); 
  console.log('Project Id:', pid); 
  //projeIdsi parametreden otomatik olarak alınmaktadır. bu Idye bağlı olarak projenin bilgileri getirilmeli ve blokchain işlemleri tamamlanmalıdır.

  return (
    <div>
      <h2>Project Detail</h2>
    </div>
  );
};

export default ProjectDetail;
