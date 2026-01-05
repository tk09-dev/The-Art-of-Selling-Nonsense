import React, { useState } from 'react';
import './WorldMap.css';

export default function WorldMap({ lobbyCode, onSelectRegion }) {
  const [selectedKey, setSelectedKey] = useState(null);

  const regions = [
    { key: 'A', name: 'Germany, Netherlands, Belgium, France, Austria, Ireland', data: ['5,77','10,14','5,77','10,14','0,187','0,291','0,944','15,96','1'] },
    { key: 'B', name: 'Denmark, Norway, Sweden, Finland, Iceland', data: ['8,16','23,31','8,16','23,31','0,083','0,232','0,963','15,45','0,8'] },
    { key: 'C', name: 'United-Kingdom, United States, Canada, Australia, New Zealand', data: ['36,32','36,32','36,32','36,32','0,106','0,442','0,943','14,07','0,65'] },
    { key: 'D', name: 'Italy, Spain, Portugal, Greece, Turkey', data: ['5','10','5','10','0,138','0,291','0,944','6,62','0,65'] },
    { key: 'E', name: 'Estonia, Latvia, Lithuania, Poland, Hungary, Serbia, Bosnia, Kosovo, Czechia, Slovenia, Slovak Republic', data: ['3,96','7,34','3,96','7,34','0,141','0,376','0,866','5,04','0,65'] },
    { key: 'F', name: 'Switzerland, Hong Kong, UAE, Monaco, Singapore, Liechtenstein', data: ['10','16,6','10','16,6','0,11','0,285','0,95','11,31','0,95'] },
    { key: 'G', name: 'Japan, South Korea, Taiwan', data: ['5,8','15,48','5,8','15,48','0,117','0,206','0,929','8,39','0,9'] },
    { key: 'H', name: 'China', data: ['4','13','4','13','0,096','0,096','0,797','1,45','0,3'] },
    { key: 'I', name: 'India, Indonesia, Vietnam, Malaysia, Bangladesh, Philippines, Thailand', data: ['1,18','7,97','1,18','7,97','0,078','0,275','0,74','1,2','0,25'] },
    { key: 'J', name: 'Saudi Arabia, Qatar, Israel, Egypt, Morocco', data: ['3,24','8,57','3,24','8,57','0,036','0,112','0,8','4,15','0,5'] },
    { key: 'K', name: 'Brazil, Mexico, Chile, Argentina, Columbia, Peru', data: ['5,7','18,29','5,7','18,29','0,094','0,212','0,81','2,35','0,3'] },
    { key: 'L', name: 'Russia and surrounding', data: [] },
    { key: 'M', name: 'Pakistan, Syria, Afghanistan', data: [] },
  ];

  const handleClick = (region) => {
    if (region.data.length === 0) return;
    setSelectedKey(region.key);
    onSelectRegion(region.key);
  };

  return (
    <div className="world-map-screen">
      <h1 className="title">Choose the region of your production</h1>
      <div className="regions-container">
        {regions.map((region) => (
          <div
            key={region.key}
            className={`region-box 
                        ${region.data.length === 0 ? 'locked' : ''} 
                        ${selectedKey === region.key ? 'selected' : ''}`}
            onClick={() => handleClick(region)}
          >
            <h2>{region.key}: {region.name}</h2>
            {region.data.length === 0 ? (
              <p className="locked-text">Locked / Not Available</p>
            ) : (
              <ul>
                <li>Minimum Wage: {region.data[7]}</li>
                <li>Minimum Energy Price: {region.data[4]}</li>
                <li>Minimum Warehouse Rent: {region.data[2]}</li>
                <li>Minimum Factory Rent: {region.data[0]}</li>
                <li>Impact of Made-in Label: {region.data[8]}</li>
                <li>HDI: {region.data[6]}</li>
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
