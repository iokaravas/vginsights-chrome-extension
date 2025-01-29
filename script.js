// Extract Steam AppID from URL
const appId = window.location.pathname.split('/')[2];

// Send message to background script
chrome.runtime.sendMessage({ action: 'fetchData', appId: appId }, (response) => {
  if (response.data) {

    const formatNumber = (number, currency = 'USD') => {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number);
    };

    const formattedUnitsSold = new Intl.NumberFormat().format(response.data.units_sold_vgi)
    const formattedRevenue = formatNumber(response.data.revenue_vgi);
    const formattedNetRevenue = formatNumber(response.data.revenue_vgi - (response.data.revenue_vgi*0.3));

    // Display the VG Insights data
    const statsOverlay = document.createElement('div');
    statsOverlay.style.position = 'fixed';
    statsOverlay.style.bottom = '10px';
    statsOverlay.style.right = '10px';
    statsOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    statsOverlay.style.color = '#fff';
    statsOverlay.style.padding = '10px';
    statsOverlay.style.borderRadius = '5px';

    statsOverlay.style.cursor = 'pointer';

    // Click handler to open VG Insights page
    statsOverlay.addEventListener('click', () => {
      window.open(`https://vginsights.com/game/${appId}`, '_blank');
    });

    statsOverlay.innerHTML = `
      <strong>VG Insights Data</strong><br>
      Units Sold: ${formattedUnitsSold}<br>
      Gross Revenue: ${formattedRevenue}<br>
      Net Revenue (-30%): ${formattedNetRevenue}<br>
    `;

      document.body.appendChild(statsOverlay);
  } else {
    console.error('Failed to retrieve VGInsights data.');
  }
});
