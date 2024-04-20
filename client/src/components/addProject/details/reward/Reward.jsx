import React, { useState } from 'react';

const Reward = ({ onRewardDataChange }) => {
  const [rewardType, setRewardType] = useState('profitShare');
  const [profitSharePercentage, setProfitSharePercentage] = useState('');

  // Handle changes in reward type
  const handleRewardTypeChange = (e) => {
    const selectedRewardType = e.target.value;
    setRewardType(selectedRewardType);

    // Pass the updated reward type and percentage (if applicable) to the parent component
    onRewardDataChange({
      rewardType: selectedRewardType,
      profitSharePercentage:
        selectedRewardType === 'profitShare' ? profitSharePercentage : null,
    });
  };

  // Handle changes in profit share percentage
  const handleProfitSharePercentageChange = (e) => {
    const percentage = e.target.value;
    setProfitSharePercentage(percentage);

    // Pass the updated profit share percentage to the parent component
    onRewardDataChange({
      rewardType,
      profitSharePercentage: percentage,
    });
  };

  return (
    <div>
      <h2>Reward Details</h2>
      <label>
        Reward Type:
        <select value={rewardType} onChange={handleRewardTypeChange}>
          <option value='profitShare'>Profit Share</option>
          <option value='product'>Product</option>
        </select>
      </label>

      {rewardType === 'profitShare' && (
        <div>
          <label>
            Profit Share Percentage:
            <input
              type='number'
              value={profitSharePercentage}
              onChange={handleProfitSharePercentageChange}
              min='0'
              max='100'
              placeholder='Enter profit share percentage'
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default Reward;
