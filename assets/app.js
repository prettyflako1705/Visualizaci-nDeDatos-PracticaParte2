const DATA = window.VG_DATA;

const palette = {
  blue: "#246a91",
  cyan: "#36a9c9",
  green: "#5bbf95",
  red: "#d85c5c",
  yellow: "#f0b84d",
  purple: "#7c6bd6",
  navy: "#173b57",
  gray: "#94a3b8"
};

Chart.defaults.font.family = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
Chart.defaults.color = "#334155";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 12;

function fmtM(value) {
  return `${Number(value).toLocaleString("es-ES", { maximumFractionDigits: 1 })} M`;
}

function labelsFrom(arr, key) { return arr.map(d => d[key]); }
function valuesFrom(arr, key) { return arr.map(d => d[key]); }

document.getElementById("heroSales").textContent = `${Math.round(DATA.summary.totalSales).toLocaleString("es-ES")} M`;
document.getElementById("metricRecords").textContent = DATA.summary.records.toLocaleString("es-ES");
document.getElementById("metricColumns").textContent = DATA.summary.columns;
document.getElementById("metricPlatforms").textContent = DATA.summary.platforms;
document.getElementById("metricPeriod").textContent = `${DATA.summary.periodStart}–${DATA.summary.periodEnd}`;

let rankingChart;
function buildRankingChart(type = "platforms") {
  const cfg = {
    platforms: {
      rows: DATA.topPlatforms.slice(0, 10),
      labelKey: "platform",
      title: "Ventas globales por plataforma",
      datasetLabel: "Millones vendidos",
      color: palette.blue
    },
    genres: {
      rows: DATA.topGenres,
      labelKey: "genre",
      title: "Ventas globales por género",
      datasetLabel: "Millones vendidos",
      color: palette.green
    },
    publishers: {
      rows: DATA.topPublishers.slice(0, 10),
      labelKey: "publisher",
      title: "Ventas globales por publisher",
      datasetLabel: "Millones vendidos",
      color: palette.purple
    }
  }[type];

  const data = {
    labels: labelsFrom(cfg.rows, cfg.labelKey),
    datasets: [{
      label: cfg.datasetLabel,
      data: valuesFrom(cfg.rows, "sales"),
      backgroundColor: cfg.color,
      borderRadius: 10
    }]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: cfg.title, font: { size: 18, weight: "700" } },
      tooltip: { callbacks: { label: ctx => ` ${fmtM(ctx.raw)}` } },
      legend: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Ventas globales (millones)" },
        grid: { color: "rgba(148,163,184,.18)" }
      },
      y: { grid: { display: false } }
    }
  };

  if (rankingChart) {
    rankingChart.data = data;
    rankingChart.options = options;
    rankingChart.update();
  } else {
    rankingChart = new Chart(document.getElementById("rankingChart"), {
      type: "bar",
      data,
      options
    });
  }
}

document.querySelectorAll("[data-ranking]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-ranking]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    buildRankingChart(btn.dataset.ranking);
  });
});

let timelineChart;
function buildTimeline(mode = "total") {
  if (timelineChart) timelineChart.destroy();

  if (mode === "total") {
    timelineChart = new Chart(document.getElementById("timelineChart"), {
      type: "line",
      data: {
        labels: DATA.timeline.map(d => d.year),
        datasets: [{
          label: "Ventas globales",
          data: DATA.timeline.map(d => d.sales),
          borderColor: palette.cyan,
          backgroundColor: "rgba(54,169,201,.12)",
          pointRadius: 2,
          tension: .35,
          fill: true
        }]
      },
      options: timelineOptions("Ventas globales por año", true)
    });
  } else {
    const families = ["Nintendo", "PlayStation", "Xbox", "PC", "Sega", "Atari"];
    const colors = [palette.green, palette.blue, palette.red, palette.yellow, palette.purple, palette.gray];
    timelineChart = new Chart(document.getElementById("timelineChart"), {
      type: "line",
      data: {
        labels: DATA.familyTimeline.map(d => d.year),
        datasets: families.map((family, i) => ({
          label: family,
          data: DATA.familyTimeline.map(d => d[family]),
          borderColor: colors[i],
          backgroundColor: colors[i],
          pointRadius: 1.8,
          tension: .32
        }))
      },
      options: timelineOptions("Ventas por familias de plataformas", false)
    });
  }
}

function timelineOptions(title, fill) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      title: { display: true, text: title, font: { size: 18, weight: "700" } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtM(ctx.raw)}` } }
    },
    scales: {
      x: { title: { display: true, text: "Año" }, grid: { color: "rgba(148,163,184,.14)" } },
      y: { title: { display: true, text: "Ventas (millones)" }, grid: { color: "rgba(148,163,184,.14)" } }
    }
  };
}

document.querySelectorAll("[data-timeline]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-timeline]").forEach(b => {
      b.classList.remove("active");
      b.classList.toggle("btn-light", b === btn);
      b.classList.toggle("btn-outline-light", b !== btn);
    });
    buildTimeline(btn.dataset.timeline);
  });
});

let regionTotalsChart = new Chart(document.getElementById("regionTotalsChart"), {
  type: "doughnut",
  data: {
    labels: DATA.regionalTotals.map(d => d.region),
    datasets: [{
      data: DATA.regionalTotals.map(d => d.sales),
      backgroundColor: [palette.blue, palette.green, palette.yellow, palette.gray],
      borderWidth: 3,
      borderColor: "#fff"
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmtM(ctx.raw)}` } }
    }
  }
});

const genreSelect = document.getElementById("genreSelect");
DATA.genreRegion.forEach(g => {
  const opt = document.createElement("option");
  opt.value = g.genre;
  opt.textContent = g.genre;
  genreSelect.appendChild(opt);
});

let genreRegionChart;
function buildGenreRegion(genre = DATA.genreRegion[0].genre) {
  const row = DATA.genreRegion.find(g => g.genre === genre);
  const chartData = {
    labels: ["Norteamérica", "Europa", "Japón", "Otros"],
    datasets: [{
      label: `Ventas de ${genre}`,
      data: [row.NA, row.EU, row.JP, row.Other],
      backgroundColor: [palette.blue, palette.green, palette.yellow, palette.gray],
      borderRadius: 10
    }]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: `Distribución regional del género ${genre}`, font: { size: 17, weight: "700" } },
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${fmtM(ctx.raw)}` } }
    },
    scales: {
      x: { grid: { display: false } },
      y: { title: { display: true, text: "Ventas (millones)" }, grid: { color: "rgba(148,163,184,.18)" } }
    }
  };
  if (genreRegionChart) {
    genreRegionChart.data = chartData;
    genreRegionChart.options = options;
    genreRegionChart.update();
  } else {
    genreRegionChart = new Chart(document.getElementById("genreRegionChart"), {
      type: "bar",
      data: chartData,
      options
    });
  }
}
genreSelect.addEventListener("change", () => buildGenreRegion(genreSelect.value));

const bubbleSelect = document.getElementById("bubbleGenre");
["Todos", ...DATA.topGenres.map(g => g.genre)].forEach(g => {
  const opt = document.createElement("option");
  opt.value = g;
  opt.textContent = g;
  bubbleSelect.appendChild(opt);
});

let bubbleChart;
function buildBubbleChart(genre = "Todos") {
  const rows = genre === "Todos" ? DATA.bubbleGames : DATA.bubbleGames.filter(d => d.genre === genre);
  const data = rows.map(d => ({
    x: d.year,
    y: d.global,
    r: d.r,
    name: d.name,
    platform: d.platform,
    genre: d.genre,
    publisher: d.publisher
  }));

  const config = {
    type: "bubble",
    data: {
      datasets: [{
        label: genre === "Todos" ? "Top videojuegos" : genre,
        data,
        backgroundColor: "rgba(36,106,145,.65)",
        borderColor: palette.blue,
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Casos excepcionales: ventas globales por año", font: { size: 18, weight: "700" } },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const d = ctx.raw;
              return ` ${d.name} (${d.platform}) · ${fmtM(d.y)} · ${d.genre}`;
            }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: "Año de lanzamiento" }, grid: { color: "rgba(148,163,184,.18)" } },
        y: { title: { display: true, text: "Ventas globales (millones)" }, grid: { color: "rgba(148,163,184,.18)" } }
      }
    }
  };

  if (bubbleChart) {
    bubbleChart.destroy();
  }
  bubbleChart = new Chart(document.getElementById("bubbleChart"), config);
}
bubbleSelect.addEventListener("change", () => buildBubbleChart(bubbleSelect.value));

let topGamesChart = new Chart(document.getElementById("topGamesChart"), {
  type: "bar",
  data: {
    labels: DATA.topGames.slice(0, 12).map(d => `${d.name} (${d.platform})`),
    datasets: [{
      label: "Ventas globales",
      data: DATA.topGames.slice(0, 12).map(d => d.global),
      backgroundColor: palette.navy,
      borderRadius: 10
    }]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Top videojuegos por ventas globales", font: { size: 18, weight: "700" } },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const row = DATA.topGames[ctx.dataIndex];
            return ` ${fmtM(row.global)} · ${row.genre} · ${row.publisher}`;
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: "Ventas globales (millones)" }, grid: { color: "rgba(148,163,184,.18)" } },
      y: { ticks: { autoSkip: false }, grid: { display: false } }
    }
  }
});

buildRankingChart("platforms");
buildTimeline("total");
buildGenreRegion();
buildBubbleChart();
