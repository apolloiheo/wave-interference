function generateSinCurve (lambda, omega, phi, t) {
  return [...Array(200).keys()]
      .map((x) => Math.sin(2*Math.PI/lambda*x - omega*t + phi));
}

const asyncSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function addArrays (...arr) {
  if (arr.length == 1) {
    return arr[0];
  }

  new_arr = arr[0];
  for (var i=0; i<arr[1].length; i++) {
    new_arr[i] += arr[1][i];
  }

  return addArrays(...arr.slice(2, arr.length - 1),
    new_arr
  );
}

const graphsNum = 2;
var charts = [];
for (var i=0; i<graphsNum; i++) {
  charts.push(new Chart(document.getElementById(`graph${i+1}`), {
    type: 'line',
    data: {
        labels: [...Array(200).keys()],
        datasets: [{
            label: `Wave ${i+1}`,
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            y: {
              max: 1,
              min: -1
            }
        },
        cubicInterpolationMode: 'monotone',
        animation: {
            duration: 0
        }
    }
  }));
}

var chartsTotal = new Chart(document.getElementById('graphTotal'), {
  type: 'line',
  data: {
      labels: [...Array(200).keys()],
      datasets: [{
          label: 'Wave Superposition',
          borderWidth: 1,
          pointRadius: 0
      }]
  },
  options: {
      scales: {
          y: {
            max: graphsNum,
            min: -1 * graphsNum
          }
      },
      cubicInterpolationMode: 'monotone',
      animation: {
          duration: 0
      }
  }
});

var chartsValues = [...Array(graphsNum).keys()]
  .map((i) => [
    100,   // lambda
    0.3,  // omega
    0     // phi
  ]);

var time = 0;

var chartProperties = [...Array(graphsNum).keys()]
  .map((i) => [
    document.getElementById(`slider__chart${i+1}_wave`),
    document.getElementById(`slider__chart${i+1}_freq`),
    document.getElementById(`slider__chart${i+1}_offs`)
  ]);

function analyzeChartProperties(arr) {
  return [
    15 + arr[0]._value * 85 / 100,
    (arr[1]._value - 50) / 100 / 2,
    arr[2]._value / 100 * 2 * Math.PI
  ];
}

(async function () {
  while (true) {
    for (var i=0; i<graphsNum; i++) {
      charts[i].data.datasets[0]['data'] = generateSinCurve(...analyzeChartProperties(chartProperties[i]), time);
      charts[i].update();
    }

    chartsTotal.data.datasets[0]['data'] = addArrays(
      ...charts.map((chart) => chart.data.datasets[0]['data'])
    );
    chartsTotal.update();

    await asyncSleep(15);
    time++;
  }
})();
