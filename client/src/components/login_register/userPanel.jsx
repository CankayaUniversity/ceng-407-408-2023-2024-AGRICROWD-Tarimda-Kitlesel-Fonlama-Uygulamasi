import React from 'react';
import { useParams } from 'react-router-dom';

function UserPanel() {
  const userId = "123";
  console.log("userpanele erişiyon dayı sıkıntı yok ");
  return (
    <div>
      <h1>Merhaba, userId: {userId}</h1>
    </div>
  );
}

export default UserPanel;
