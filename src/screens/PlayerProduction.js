import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './PlayerProduction.css';

export default function PlayerProduction({ companyName, selectedRegion, setSelectedRegion, setScreen, lobbyCode }) {
  const regionData = {
    A: { minWage: 15.96, energyPrice: 0.187, warehouseRent: 5.77, factoryRent: 5.77, HDI: 0.944, madeInImpact: 1 },
    B: { minWage: 15.45, energyPrice: 0.083, warehouseRent: 8.16, factoryRent: 8.16, HDI: 0.963, madeInImpact: 0.8 },
    C: { minWage: 14.07, energyPrice: 0.106, warehouseRent: 36.32, factoryRent: 36.32, HDI: 0.943, madeInImpact: 0.65 },
    D: { minWage: 6.62, energyPrice: 0.138, warehouseRent: 5, factoryRent: 5, HDI: 0.944, madeInImpact: 0.65 },
    E: { minWage: 5.04, energyPrice: 0.141, warehouseRent: 3.96, factoryRent: 3.96, HDI: 0.866, madeInImpact: 0.65 },
    F: { minWage: 11.31, energyPrice: 0.110, warehouseRent: 10, factoryRent: 10, HDI: 0.95, madeInImpact: 0.95 },
    G: { minWage: 8.39, energyPrice: 0.117, warehouseRent: 5.8, factoryRent: 5.8, HDI: 0.929, madeInImpact: 0.9 },
    H: { minWage: 1.35, energyPrice: 0.096, warehouseRent: 4, factoryRent: 4, HDI: 0.797, madeInImpact: 0.3 },
    I: { minWage: 1.18, energyPrice: 0.078, warehouseRent: 1.18, factoryRent: 1.18, HDI: 0.74, madeInImpact: 0.25 },
    J: { minWage: 4.15, energyPrice: 0.036, warehouseRent: 3.24, factoryRent: 3.24, HDI: 0.8, madeInImpact: 0.5 },
    K: { minWage: 2.35, energyPrice: 0.094, warehouseRent: 5.7, factoryRent: 5.7, HDI: 0.81, madeInImpact: 0.3 }
  };

  // per-unit constants (hidden from player)
  const LABOR_PER_UNIT = 0.02;
  const FACTORY_M2_PER_UNIT = 0.05;
  const WAREHOUSE_M2_PER_UNIT = 0.03;
  const ENERGY_KWH_PER_UNIT = 1.2;

  const [regionStats, setRegionStats] = useState(regionData[selectedRegion] || {});
  const [productName, setProductName] = useState('Product Name');
  const [salary, setSalary] = useState(regionStats.minWage);
  const [productQuantity, setProductQuantity] = useState(1000);
  const [pricePerUnit, setPricePerUnit] = useState(50);
  const [sustainability, setSustainability] = useState('High');

  const [productionCalculated, setProductionCalculated] = useState(false);
  const [productionConfirmed, setProductionConfirmed] = useState(false);
  const [productionCosts, setProductionCosts] = useState([]);

  const headerStats = [
    `Min Wage: $${regionStats.minWage}`,
    `Energy: $${regionStats.energyPrice}/kWh`,
    `Warehouse Rent: $${regionStats.warehouseRent}/m²`,
    `Factory Rent: $${regionStats.factoryRent}/m²`,
    `HDI: ${regionStats.HDI}`,
    `Made-in-Impact: ${regionStats.madeInImpact}`
  ];

  useEffect(() => {
    if (selectedRegion) {
      setRegionStats(regionData[selectedRegion]);
      setSalary(regionData[selectedRegion].minWage);
    }
  }, [selectedRegion]);

  const sustainabilityModifier =
    sustainability === 'Very High' ? 1.9 :
    sustainability === 'High' ? 1.4 :
    1;

  const handleCalculateProduction = () => {
    const laborCost =
      productQuantity * LABOR_PER_UNIT * salary;

    const energyCost =
      productQuantity * ENERGY_KWH_PER_UNIT * regionStats.energyPrice;

    const factoryCost =
      productQuantity * FACTORY_M2_PER_UNIT * regionStats.factoryRent;

    const warehouseCost =
      productQuantity * WAREHOUSE_M2_PER_UNIT * regionStats.warehouseRent;

    const baseCost =
      laborCost + energyCost + factoryCost + warehouseCost;

    const totalCost =
      baseCost * sustainabilityModifier;

    const costPerUnit =
      totalCost / productQuantity;

    setProductionCosts([
      { category: 'Labor Cost', value: laborCost.toFixed(2) },
      { category: 'Energy Cost', value: energyCost.toFixed(2) },
      { category: 'Factory Rent', value: factoryCost.toFixed(2) },
      { category: 'Warehouse Rent', value: warehouseCost.toFixed(2) },
      { category: 'Sustainability Modifier', value: `${((sustainabilityModifier - 1) * 100).toFixed(0)}%` },
      { category: 'Cost per Unit', value: costPerUnit.toFixed(2) },
      { category: 'Total Production Cost', value: totalCost.toFixed(2) }
    ]);

    setProductionCalculated(true);
  };

 const handleConfirmProduction = async () => {
  setProductionConfirmed(true);

  const productionData = {
  lobbyCode,
  companyName,
  production: {
    productName,
    quantity: productQuantity,
    pricePerUnit,
    sustainability,
    region: selectedRegion
  }
};


  try {
    await axios.post('https://the-art-of-selling-nonsense-backend.onrender.com/confirm-production', productionData);
    console.log('Production confirmed on backend');
  } catch (err) {
    console.error('Failed to confirm production:', err);
  }
};

  const handleChangeRegion = () => {
    setScreen('worldMap');
  };

  return (
    <div className="production-screen">
      <header className="production-header">
        <div className="company-name">{companyName}</div>
        <div className="header-stats">
          {headerStats.join(' • ')}
        </div>
        <div className="current-category">Production</div>
      </header>

      <div className="production-content">
        <div className="menu-left">
          <button className="back-button" onClick={() => setScreen('playerMenu')}>
            Back to Main
          </button>
        </div>

        <div className="region-box">
          <h3>Region: {selectedRegion}</h3>
          <p>Min Wage: ${regionStats.minWage}</p>
          <p>Energy Price: ${regionStats.energyPrice} per kWh</p>
          <p>Warehouse Rent: ${regionStats.warehouseRent} per m²</p>
          <p>Factory Rent: ${regionStats.factoryRent} per m²</p>
          <p>HDI: {regionStats.HDI}</p>
          <p>Made-in-Impact: {regionStats.madeInImpact}</p>
          <button className="change-region-button" onClick={handleChangeRegion} disabled={productionConfirmed}>
            Change Region
          </button>
        </div>

        <div className="product-box">
          <h3>{productName}</h3>

          <label>
            Salary per Worker ($):
            <input
              type="number"
              value={salary}
              min={regionStats.minWage}
              disabled={productionConfirmed}
              onChange={(e) => setSalary(Math.max(Number(e.target.value), regionStats.minWage))}
            />
          </label>

          <label>
            Products to Produce:
            <input
              type="number"
              value={productQuantity}
              disabled={productionConfirmed}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
            />
          </label>

          <label>
            Price per Unit ($):
            <input
              type="number"
              value={pricePerUnit}
              disabled={productionConfirmed}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
            />
          </label>

          <label>
            Sustainability Level:
            <select
              value={sustainability}
              disabled={productionConfirmed}
              onChange={(e) => setSustainability(e.target.value)}
            >
              <option>Very High</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
              <option>No Specific Focus</option>
            </select>
          </label>

          <button className="calculate-production-button" onClick={handleCalculateProduction} disabled={productionConfirmed}>
            Calculate Production Cost
          </button>

          {productionCalculated && !productionConfirmed && (
            <button className="calculate-production-button" onClick={handleConfirmProduction}>
              Confirm Production
            </button>
          )}
        </div>
      </div>

      {productionCalculated && (
        <div className="production-results">
          <h3>Production Cost Results</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {productionCosts.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.category}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
