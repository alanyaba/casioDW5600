class Watch {
  constructor(
    hours1El,
    hours2El,
    minutes1El,
    minutes2El,
    seconds1El,
    seconds2El,
    dayOfWeek1El,
    dayOfWeek2El,
    month1El,
    month2El,
    dayOfMonth1El,
    dayOfMonth2El,
    sepMonthAndDayEl,
    backgroundEl,
    alarmEl,
    sigEl,
    pmEl,
    format24hrEl,
    autoEl,
    flashEl,
  ) {
    this.hours1El = hours1El
    this.hours2El = hours2El
    this.minutes1El = minutes1El
    this.minutes2El = minutes2El
    this.seconds1El = seconds1El
    this.seconds2El = seconds2El
    this.dayOfWeek1El = dayOfWeek1El
    this.dayOfWeek2El = dayOfWeek2El
    this.month1El = month1El
    this.month2El = month2El
    this.dayOfMonth1El = dayOfMonth1El
    this.dayOfMonth2El = dayOfMonth2El
    this.sepMonthAndDayEl = sepMonthAndDayEl
    this.backgroundEl = backgroundEl
    this.alarmEl = alarmEl
    this.sigEl = sigEl
    this.pmEl = pmEl
    this.format24hrEl = format24hrEl
    this.autoEl = autoEl
    this.flashEl = flashEl

    this.hours = 23
    this.minutes = 59
    this.seconds = 56
    this.year = 2000
    this.month = 2
    this.dayOfMonth = 29
    this.dayOfWeek = this.getDayOfWeek(
      this.year,
      this.month,
      this.dayOfMonth
    )

    this.mode = 'time'
    this.format24hr = false

    this.displayScreen()
    this.idUpdateTime = setInterval(() => {
      this.updateTime()
    }, 1000)
    this.idDisplayScreen = setInterval(() => {
      this.displayScreen()
    }, 1000)
  }

  isLeapYear(year) {
    if (year % 4 === 0) {
      if (year % 10 === 0) {
        if (year % 400 === 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    } else {
      return false
    }
  }

  getMaxDaysOnMonth(month, year) {
    const maxDaysPerMonth = {
      1: 31,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31
    }
    if (month === 2) {
      return (this.isLeapYear(year))? 29 : 28
    } else {
      return maxDaysPerMonth[month]
    }
  }

  updateTime() {
    ++this.seconds
    if (this.seconds > 59) {
      this.seconds = 0
      ++this.minutes
    }
    if (this.minutes > 59) {
      this.minutes = 0
      ++this.hours
    }
    if (this.hours > 23) {
      this.hours = 0
      ++this.dayOfMonth
      this.dayOfWeek = this.getDayOfWeek(
        this.year,
        this.month,
        this.dayOfMonth
      )
    }
    if (this.dayOfMonth > this.getMaxDaysOnMonth(this.month, this.year)) {
      this.dayOfMonth = 1
      ++this.month
    }
    if (this.month > 12) {
      this.month = 1
      ++this.year
    }
  }

  getDayOfWeek(year, monthOfYear, dayOfMonth) {
    const firstDayOfYear = (year) => {
      let yearsSince2000 = year - 2000
      let daysMore = (yearsSince2000 + Math.ceil(yearsSince2000 / 4)) % 7
      let day = 6 + daysMore
      return (day % 7) || 7
    }
    let day = firstDayOfYear(year)
    for (let month = 1; month <= 12; month++) {
      if (month !== monthOfYear) {
        day += this.getMaxDaysOnMonth(month, year)
      } else {
        day += dayOfMonth - 1
        break
      }
    }
    day = (day % 7) || 7
    const shortNameOfDayOfWeek = {
      1: 'MO',
      2: 'TU',
      3: 'WE',
      4: 'TH',
      5: 'FR',
      6: 'SA',
      7: 'SU'
    }
    return shortNameOfDayOfWeek[day]
  }

  toString(number) {
    if (number < 10) {
      return `0${number}`
    } else {
      return number.toString()
    }
  }

  displayScreen() {
    const modes = {
      'time': () => {
        this.pmEl.classList.add('disable')
        this.format24hrEl.classList.add('disable')
        this.hours1El.classList.remove('disable')
        this.hours2El.classList.remove('disable')
        this.seconds1El.innerText = this.toString(this.seconds)[0]
        this.seconds2El.innerText = this.toString(this.seconds)[1]
        this.minutes1El.innerText = this.toString(this.minutes)[0]
        this.minutes2El.innerText = this.toString(this.minutes)[1]
        if (this.format24hr) {
          this.format24hrEl.classList.remove('disable')
          this.hours1El.innerText = this.toString(this.hours)[0]
          this.hours2El.innerText = this.toString(this.hours)[1]
        } else {
          if (this.hours === 0) {
            this.hours1El.innerText = '1'
            this.hours2El.innerText = '2'
          } else if (this.hours < 13) {
            this.hours1El.innerText = this.toString(this.hours)[0]
            this.hours2El.innerText = this.toString(this.hours)[1]
          } else if (this.hours >= 13) {
            this.hours1El.innerText = this.toString(this.hours - 12)[0]
            this.hours2El.innerText = this.toString(this.hours - 12)[1]
          }
          if (this.hours1El.innerText === '0') {
            this.hours1El.classList.add('disable')
          }
          if (this.hours >= 12) {
            this.pmEl.classList.remove('disable')
          }
        }
        this.dayOfWeek1El.innerText = this.dayOfWeek[0]
        this.dayOfWeek2El.innerText = this.dayOfWeek[1]
        this.month1El.innerText = this.toString(this.month)[0]
        this.month2El.innerText = this.toString(this.month)[1]
        this.dayOfMonth1El.innerText = this.toString(this.dayOfMonth)[0]
        this.dayOfMonth2El.innerText = this.toString(this.dayOfMonth)[1]
      }
    }
    modes[this.mode]()
  }
}

// DOM
const hours1 = document.querySelector('.hoursD1')
const hours2 = document.querySelector('.hoursD2')

const minutes1 = document.querySelector('.minutesD1')
const minutes2 = document.querySelector('.minutesD2')

const seconds1 = document.querySelector('.secondsD1')
const seconds2 = document.querySelector('.secondsD2')

const dayOfWeek1 = document.querySelector('.dayD1')
const dayOfWeek2 = document.querySelector('.dayD2')

const month1 = document.querySelector('.monthD1')
const month2 = document.querySelector('.monthD2')

const dayOfMonth1 = document.querySelector('.dateD1')
const dayOfMonth2 = document.querySelector('.dateD2')

const sepMonthAndDay = document.querySelector('.sep-date')
const background = document.querySelector('.watch')
const alarm = document.querySelector('.alarm')
const sig = document.querySelector('.hour-signal')
const pm = document.querySelector('.pm')
const format24hr = document.querySelector('.hour-24hr')
const auto = document.querySelector('.auto')
const flash = document.querySelector('.flash')

const buttonA = document.querySelector('.A')
const buttonB = document.querySelector('.B')
const buttonC = document.querySelector('.C')
const buttonD = document.querySelector('.D')

// new Watch
const watch = new Watch(
  hours1,
  hours2,
  minutes1,
  minutes2,
  seconds1,
  seconds2,
  dayOfWeek1,
  dayOfWeek2,
  month1,
  month2,
  dayOfMonth1,
  dayOfMonth2,
  sepMonthAndDay,
  background,
  alarm,
  sig,
  pm,
  format24hr,
  auto,
  flash
)

buttonA.addEventListener('click', () => {
  watch.adjust()
})

buttonB.addEventListener('click', () => {
  watch.start()
})

buttonC.addEventListener('click', () => {
  watch.cmode()
})

buttonD.addEventListener('click', () => {
  watch.reset()
})
