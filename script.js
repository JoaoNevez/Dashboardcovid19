const fetchBtn = document.getElementById("fetchBtn");
const countryInput = document.getElementById("country");
const ctx = document.getElementById('covidChart').getContext('2d');
let covidChart;

fetchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (!country) return alert("Digite um país!");
    fetchCovidData(country);
});

async function fetchCovidData(country) {
    try {
        const res = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`);
        const data = await res.json();

        if (data.message) {
            alert("País não encontrado!");
            return;
        }

        const cases = data.timeline.cases;
        const deaths = data.timeline.deaths;

        const labels = Object.keys(cases);
        const casesData = Object.values(cases);
        const deathsData = Object.values(deaths);

        if (covidChart) covidChart.destroy();

        covidChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Casos',
                        data: casesData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Mortes',
                        data: deathsData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao buscar dados da COVID-19.");
    }
}
