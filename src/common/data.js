import { getHistory } from '../common/localstorage.service'

export const fetchHistory = () => {
  return getHistory()
}

export const planetChartData = () => {
  const history = getHistory()

  let games = []

  if (history) {
    // get games and sort by gameNumber, return last seven games
    games = history.games.sort((a, b) => {
      return a.gameNumber - b.gameNumber
    }).slice(-7)
  }

  const labels = games.map(game => '#' + game.gameNumber)
  const scores = games.map(game => game.score)
  const highest = Math.max(...scores)
  // const lowest = Math.min(...scores)
  const stepSize = (Math.round(highest / 10) * 10) / 4
  const stepSize2 = (Math.round(stepSize / 10) * 10)

  const chart = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: scores,
          backgroundColor: 'rgba(61, 245, 80, .6)',
          borderColor: '#3df550',
          fontColor: '#222',
          borderWidth: 3,
          tension: 0,
          padding: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#222',
              padding: 5,
              stepSize: stepSize2
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#222',
              padding: 5
            }
          }
        ]
      }
    }
  }

  return chart
}

export default planetChartData
