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

    this.hours = 0
    this.minutes = 50
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
    this.format24hr = true

    this.adjusting = false
    this.idAdjusting = null
    this.adjustData = null

    this.auto = true
    this.flash = true

    this.alarm = true
    this.sig = true

    this.alarmHours = 0
    this.alarmMinutes = 0
    this.alarmMonth = null
    this.alarmDayOfMonth = null
    this.idAlarm = null

    this.firstFlashingAlarm = false
    this.alarmStop = false
    
    this.timerSetSeconds = 0
    this.timerSetMinutes = 0
    this.timerSetHours = 0
    this.timerSeconds = 0
    this.timerMinutes = 0
    this.timerHours = 0

    this.timerActive = false
    this.timerPause = false
    this.idTimer = null

    this.stopwatchHours = 0
    this.stopwatchMinutes = 0
    this.stopwatchSeconds = 0
    this.stopwatchHundredthsOfSeconds = 0
    this.stopwatchSplitHours = 0
    this.stopwatchSplitMinutes = 0
    this.stopwatchSplitSeconds = 0
    this.stopwatchSplitHundredthsOfSeconds = 0

    this.stopwatchActive = false
    this.stopwatchPause = null
    this.stopwatchSplit = null
    this.idStopwatch = null

    this.idSepMonthAndDay = null

    this.displayScreen()
    this.idUpdateTime = setInterval(() => {
      if (this.mode !== 'time') {
        this.updateTime()
      } else {
        if (this.adjusting) {
          this.updateOnlySeconds()
        } else {
          this.updateTime()
        }
      }
    }, 1000)
    this.idDisplayScreen = setInterval(() => {
      this.displayScreen()
    }, 10)
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

  updateOnlySeconds() {
    ++this.seconds
    if (this.seconds > 59) this.seconds = 0
  }

  updateTimer() {
    if (!(this.timerPause)) {
      --this.timerSeconds
    }
    if (this.timerSeconds === 0
      && this.timerMinutes === 0
      && this.timerHours === 0
    ) {
      if (!this.auto) {
        clearInterval(this.idTimer)
        this.idTimer = null
        this.timerActive = false
        this.timerPause = false
      } else {
        this.timerHours = this.timerSetHours
        this.timerMinutes = this.timerSetMinutes
        this.timerSeconds = this.timerSetSeconds
      }
      if (this.flash) this.flashingAlarm()
    }
    if (this.timerSeconds < 0) {
      this.timerSeconds = 59
      --this.timerMinutes
    }
    if (this.timerMinutes < 0) {
      this.timerMinutes = 59
      --this.timerHours
    }
    this.displayScreen()
  }

  updateStopwatch() {
    if (!(this.stopwatchPause)) {
      ++this.stopwatchHundredthsOfSeconds
    }
    if (this.stopwatchHundredthsOfSeconds > 99) {
      this.stopwatchHundredthsOfSeconds = 0
      ++this.stopwatchSeconds
    }
    if (this.stopwatchSeconds > 59) {
      this.stopwatchSeconds = 0
      ++this.stopwatchMinutes
    }
    if (this.stopwatchMinutes > 59) {
      this.stopwatchMinutes = 0
      ++this.stopwatchHours
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

  activeElementsOnModeTime() {
    if (this.format24hr) {
      this.format24hrEl.classList.remove('disable')
      this.pmEl.classList.add('disable')
    } else {
      this.format24hrEl.classList.add('disable')
      if (this.hours >= 12) {
        this.pmEl.classList.remove('disable')
      } else {
        this.pmEl.classList.add('disable')
      }
    }
    if (this.adjustData !== 'seconds') {
      this.seconds1El.classList.remove('disable')
      this.seconds2El.classList.remove('disable')
    }
    if (this.adjustData !== 'hours') {
      if (this.format24hr) {
        this.hours1El.classList.remove('disable')
        this.hours2El.classList.remove('disable')
      } else {
        if (this.hours === 0) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        } else if (0 < this.hours && this.hours <= 9) {
          this.hours1El.classList.add('disable')
          this.hours2El.classList.remove('disable')
        } else if (9 < this.hours && this.hours <= 12) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        } else if (12 < this.hours && this.hours <= 21) {
          this.hours1El.classList.add('disable')
          this.hours2El.classList.remove('disable')
        } else if (21 < this.hours) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        }
      }
    }
    if (this.adjustData !== 'minutes') {
      this.minutes1El.classList.remove('disable')
      this.minutes2El.classList.remove('disable')
    }
    if (this.adjustData !== 'year') {
      this.dayOfWeek1El.classList.remove('disable')
      this.dayOfWeek2El.classList.remove('disable')
    }
    if (this.adjustData !== 'month') {
      if (this.month < 10) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      }
    }
    if (this.adjustData !== 'dayOfMonth') {
      if (this.dayOfMonth < 10) {
        this.dayOfMonth1El.classList.add('disable')
        this.dayOfMonth2El.classList.remove('disable')
      } else {
        this.dayOfMonth1El.classList.remove('disable')
        this.dayOfMonth2El.classList.remove('disable')
      }
    }
  }

  displayModeTime() {
    this.activeElementsOnModeTime()
    this.seconds1El.innerText = this.toString(this.seconds)[0]
    this.seconds2El.innerText = this.toString(this.seconds)[1]
    this.minutes1El.innerText = this.toString(this.minutes)[0]
    this.minutes2El.innerText = this.toString(this.minutes)[1]
    if (this.format24hr) {
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
    }
    if (!this.adjusting) {
      this.dayOfWeek1El.innerText = this.dayOfWeek[0]
      this.dayOfWeek2El.innerText = this.dayOfWeek[1]
    } else {
      this.dayOfWeek1El.innerText = this.toString(this.year)[2]
      this.dayOfWeek2El.innerText = this.toString(this.year)[3]
    }
    this.month1El.innerText = this.toString(this.month)[0]
    this.month2El.innerText = this.toString(this.month)[1]
    this.sepMonthAndDayEl.innerText = '-'
    this.dayOfMonth1El.innerText = this.toString(this.dayOfMonth)[0]
    this.dayOfMonth2El.innerText = this.toString(this.dayOfMonth)[1]
  }

  activeElementsOnModeAlarm() {
    if (this.format24hr) {
      this.format24hrEl.classList.remove('disable')
      this.pmEl.classList.add('disable')
    } else {
      this.format24hrEl.classList.add('disable')
      if (this.alarmHours >= 12) {
        this.pmEl.classList.remove('disable')
      } else {
        this.pmEl.classList.add('disable')
      }
    }
    if (this.adjustData !== 'alarmHours') {
      if (this.format24hr) {
        this.hours1El.classList.remove('disable')
        this.hours2El.classList.remove('disable')
      } else {
        if (this.alarmHours === 0) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        } else if (0 < this.alarmHours && this.alarmHours <= 9) {
          this.hours1El.classList.add('disable')
          this.hours2El.classList.remove('disable')
        } else if (9 < this.alarmHours && this.alarmHours <= 12) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        } else if (12 < this.alarmHours && this.alarmHours <= 21) {
          this.hours1El.classList.add('disable')
          this.hours2El.classList.remove('disable')
        } else if (21 < this.alarmHours) {
          this.hours1El.classList.remove('disable')
          this.hours2El.classList.remove('disable')
        }
      }
    }
    if (this.adjustData !== 'alarmMinutes') {
      this.minutes1El.classList.remove('disable')
      this.minutes2El.classList.remove('disable')
    }
    if (this.adjustData !== 'alarmMonth') {
      if (this.alarmMonth === null) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else if (this.alarmMonth < 10) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      }
    }
    if (this.adjustData !== 'alarmDayOfMonth') {
      if (this.alarmDayOfMonth === null) {
        this.dayOfMonth1El.classList.remove('disable')
        this.dayOfMonth2El.classList.remove('disable')
      }else if (this.alarmDayOfMonth < 10) {
        this.dayOfMonth1El.classList.add('disable')
        this.dayOfMonth2El.classList.remove('disable')
      } else {
        this.dayOfMonth1El.classList.remove('disable')
        this.dayOfMonth2El.classList.remove('disable')
      }
    }
  }

  displayModeAlarm() {
    this.activeElementsOnModeAlarm()
    this.seconds1El.innerText = '0'
    this.seconds2El.innerText = '0'
    this.seconds1El.classList.add('disable')
    this.seconds2El.classList.add('disable')
    if (this.format24hr) {
      this.hours1El.innerText = this.toString(this.alarmHours)[0]
      this.hours2El.innerText = this.toString(this.alarmHours)[1]
    } else {
      if (this.alarmHours === 0) {
        this.hours1El.innerText = '1'
        this.hours2El.innerText = '2'
      } else if (this.alarmHours < 13) {
        this.hours1El.innerText = this.toString(this.alarmHours)[0]
        this.hours2El.innerText = this.toString(this.alarmHours)[1]
      } else if (this.alarmHours >= 13) {
        this.hours1El.innerText = this.toString(this.alarmHours - 12)[0]
        this.hours2El.innerText = this.toString(this.alarmHours - 12)[1]
      }
    }
    this.minutes1El.innerText = this.toString(this.alarmMinutes)[0]
    this.minutes2El.innerText = this.toString(this.alarmMinutes)[1]
    this.dayOfWeek1El.innerText = 'A'
    this.dayOfWeek2El.innerText = 'L'
    if (!(this.alarmMonth === null)) {
      this.month1El.innerText = this.toString(this.alarmMonth)[0]
      this.month2El.innerText = this.toString(this.alarmMonth)[1]
    } else {
      this.month1El.innerText = '-'
      this.month2El.innerText = '-'
    }
    this.sepMonthAndDayEl.innerText = '-'
    if (!(this.alarmDayOfMonth === null)) {
      this.dayOfMonth1El.innerText = this.toString(this.alarmDayOfMonth)[0]
      this.dayOfMonth2El.innerText = this.toString(this.alarmDayOfMonth)[1]
    } else {
      this.dayOfMonth1El.innerText = '-'
      this.dayOfMonth2El.innerText = '-'
    }
  }

  activateElementsOnModeTimer() {
    if (this.format24hr) {
      this.format24hrEl.classList.remove('disable')
      this.pmEl.classList.add('disable')
    } else {
      this.format24hrEl.classList.add('disable')
      if (this.hours >= 12) {
        this.pmEl.classList.remove('disable')
      } else {
        this.pmEl.classList.add('disable')
      }
    }
    if (this.adjustData !== 'timerHours') {
      this.hours1El.classList.remove('disable')
      this.hours2El.classList.remove('disable')
    }
    if (this.adjustData !== 'timerMinutes') {
      this.minutes1El.classList.remove('disable')
      this.minutes2El.classList.remove('disable')
    }
    if (this.adjustData !== 'timerSeconds') {
      this.seconds1El.classList.remove('disable')
      this.seconds2El.classList.remove('disable')
    }
  }

  displayModeTimer() {
    this.activateElementsOnModeTimer()
    this.hours1El.innerText = this.toString(this.timerHours)[0]
    this.hours2El.innerText = this.toString(this.timerHours)[1]
    this.minutes1El.innerText = this.toString(this.timerMinutes)[0]
    this.minutes2El.innerText = this.toString(this.timerMinutes)[1]
    this.seconds1El.innerText = this.toString(this.timerSeconds)[0]
    this.seconds2El.innerText = this.toString(this.timerSeconds)[1]
    this.dayOfWeek1El.innerText = 'T'
    this.dayOfWeek2El.innerText = 'R'
    if (this.format24hr) {
      this.month1El.innerText = this.toString(this.hours)[0]
      this.month2El.innerText = this.toString(this.hours)[1]
      this.month1El.classList.remove('disable')
      this.month2El.classList.remove('disable')
    } else {
      if (this.hours === 0) {
        this.month1El.innerText = '1'
        this.month2El.innerText = '2'
      } else if (this.hours < 13) {
        this.month1El.innerText = this.toString(this.hours)[0]
        this.month2El.innerText = this.toString(this.hours)[1]
      } else if (this.hours >= 13) {
        this.month1El.innerText = this.toString(this.hours - 12)[0]
        this.month2El.innerText = this.toString(this.hours - 12)[1]
      }
      if (this.hours === 0) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      } else if (0 < this.hours && this.hours <= 9) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else if (9 < this.hours && this.hours <= 12) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      } else if (12 < this.hours && this.hours <= 21) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else if (21 < this.hours) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      }
    }
    this.sepMonthAndDayEl.innerText = ':'
    this.dayOfMonth1El.innerText = this.toString(this.minutes)[0]
    this.dayOfMonth2El.innerText = this.toString(this.minutes)[1]
  }

  activateElemenstOnModeStopwatch() {
    if (this.format24hr) {
      this.format24hrEl.classList.remove('disable')
      this.pmEl.classList.add('disable')
    } else {
      this.format24hrEl.classList.add('disable')
      if (this.hours >= 12) {
        this.pmEl.classList.remove('disable')
      } else {
        this.pmEl.classList.add('disable')
      }
    }
  }

  displayModeStopwatch() {
    this.activateElemenstOnModeStopwatch()
    if (this.stopwatchSplit === true) {
      if (this.stopwatchHours < 1) {
        this.hours1El.innerText = this.toString(this.stopwatchSplitMinutes)[0]
        this.hours2El.innerText = this.toString(this.stopwatchSplitMinutes)[1]
        this.minutes1El.innerText = this.toString(this.stopwatchSplitSeconds)[0]
        this.minutes2El.innerText = this.toString(this.stopwatchSplitSeconds)[1]
        this.seconds1El.innerText = this.toString(
          this.stopwatchSplitHundredthsOfSeconds
        )[0]
        this.seconds2El.innerText = this.toString(
          this.stopwatchSplitHundredthsOfSeconds
        )[1]
      } else {
        this.hours1El.innerText = this.toString(this.stopwatchSplitHours)[0]
        this.hours2El.innerText = this.toString(this.stopwatchSplitHours)[1]
        this.minutes1El.innerText = this.toString(this.stopwatchSplitMinutes)[0]
        this.minutes2El.innerText = this.toString(this.stopwatchSplitMinutes)[1]
        this.seconds1El.innerText = this.toString(this.stopwatchSplitSeconds)[0]
        this.seconds2El.innerText = this.toString(this.stopwatchSplitSeconds)[1]
      }
    } else {
      if (this.stopwatchHours < 1) {
        this.hours1El.innerText = this.toString(this.stopwatchMinutes)[0]
        this.hours2El.innerText = this.toString(this.stopwatchMinutes)[1]
        this.minutes1El.innerText = this.toString(this.stopwatchSeconds)[0]
        this.minutes2El.innerText = this.toString(this.stopwatchSeconds)[1]
        this.seconds1El.innerText = this.toString(
          this.stopwatchHundredthsOfSeconds
        )[0]
        this.seconds2El.innerText = this.toString(
          this.stopwatchHundredthsOfSeconds
        )[1]
      } else {
        this.hours1El.innerText = this.toString(this.stopwatchHours)[0]
        this.hours2El.innerText = this.toString(this.stopwatchHours)[1]
        this.minutes1El.innerText = this.toString(this.stopwatchMinutes)[0]
        this.minutes2El.innerText = this.toString(this.stopwatchMinutes)[1]
        this.seconds1El.innerText = this.toString(this.stopwatchSeconds)[0]
        this.seconds2El.innerText = this.toString(this.stopwatchSeconds)[1]
      }
    }
    this.dayOfWeek1El.innerText = 'S'
    this.dayOfWeek2El.innerText = 'T'
    if (this.format24hr) {
      this.month1El.innerText = this.toString(this.hours)[0]
      this.month2El.innerText = this.toString(this.hours)[1]
      this.month1El.classList.remove('disable')
      this.month2El.classList.remove('disable')
    } else {
      if (this.hours === 0) {
        this.month1El.innerText = '1'
        this.month2El.innerText = '2'
      } else if (this.hours < 13) {
        this.month1El.innerText = this.toString(this.hours)[0]
        this.month2El.innerText = this.toString(this.hours)[1]
      } else if (this.hours >= 13) {
        this.month1El.innerText = this.toString(this.hours - 12)[0]
        this.month2El.innerText = this.toString(this.hours - 12)[1]
      }
      if (this.hours === 0) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      } else if (0 < this.hours && this.hours <= 9) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else if (9 < this.hours && this.hours <= 12) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      } else if (12 < this.hours && this.hours <= 21) {
        this.month1El.classList.add('disable')
        this.month2El.classList.remove('disable')
      } else if (21 < this.hours) {
        this.month1El.classList.remove('disable')
        this.month2El.classList.remove('disable')
      }
    }
    this.sepMonthAndDayEl.innerText = ':'
    this.dayOfMonth1El.innerText = this.toString(this.minutes)[0]
    this.dayOfMonth2El.innerText = this.toString(this.minutes)[1]
  }

  flashingAlarm() {
    let count = 0
    if (this.idAlarm === null) {
      this.idAlarm = setInterval(() => {
        ++count
        if (count > 9) {
          clearInterval(this.idAlarm)
          this.idAlarm = null
        }
        this.backgroundEl.classList.toggle('lightOn')
      }, 100)
    }
  }

  checkSignal() {
    if (this.minutes === 0
      && this.seconds === 0
      && !this.adjusting
    ) {
      if (this.sig) {
        if (this.flash) {
          if (!this.firstFlashingAlarm) {
            this.firstFlashingAlarm = true
            setTimeout(() => {
              this.firstFlashingAlarm = false
            }, 60100)
            this.flashingAlarm()
          }
        }
      }
    }
  }

  checkAlarm() {
    if (this.hours === this.alarmHours
      && this.minutes === this.alarmMinutes
      && !this.adjusting
      && !this.alarmStop
    ) {
      if (this.alarmMonth === null && this.alarmDayOfMonth === null) {
        if (this.alarm) {
          if (this.flash) this.flashingAlarm()
            this.alarmActiveNow = true
        }
      } else if (this.alarmMonth && this.alarmDayOfMonth === null) {
        if (this.alarmMonth === this.month) {
          if (this.alarm) {
            if (this.flash) this.flashingAlarm()
            this.alarmActiveNow = true
          }
        }
      } else if (this.alarmMonth === null && this.alarmDayOfMonth) {
        if (this.alarmDayOfMonth === this.dayOfMonth) {
          if (this.alarm) {
            if (this.flash) this.flashingAlarm()
            this.alarmActiveNow = true
          }
        }
      } else if (this.alarmMonth && this.alarmDayOfMonth) {
        if (this.alarmMonth === this.month
          && this.alarmDayOfMonth === this.dayOfMonth
        ) {
          if (this.alarm) {
            if (this.flash) this.flashingAlarm()
            this.alarmActiveNow = true
          }
        }
      }
      if (this.alarmStop) setTimeout(() => {
        this.alarmStop = false
      }, 60100)
    } else {
      this.alarmActiveNow = false
    }
  }

  flashingSepMonthAndDay() {
    if (this.mode === 'timer' || this.mode === 'stopwatch') {
      if (this.idSepMonthAndDay === null) {
        this.idSepMonthAndDay = setInterval(() => {
          this.sepMonthAndDayEl.classList.toggle('disable')
        }, 1000)
      }
    } else {
      if (this.idSepMonthAndDay) {
        clearInterval(this.idSepMonthAndDay)
        this.idSepMonthAndDay = null
        this.sepMonthAndDayEl.classList.remove('disable')
      }
    }
  }

  displayScreen() {
    const modes = {
      'time': () => {
        this.displayModeTime()
      },
      'alarm': () => {
        this.displayModeAlarm()
      },
      'timer': () => {
        this.displayModeTimer()
      },
      'stopwatch': () => {
        this.displayModeStopwatch()
      }
    }
    this.checkSignal()
    this.checkAlarm()
    this.flashingSepMonthAndDay()
    modes[this.mode]()
  }

  checkToStopAlarm() {
    if (this.alarmActiveNow) this.alarmStop = true
  }

  changeNextAdjust() {
    const next = {
      'time': {
        'seconds': 'hours',
        'hours': 'minutes',
        'minutes': 'year',
        'year': 'month',
        'month': 'dayOfMonth',
        'dayOfMonth': 'seconds'
      },
      'alarm': {
        'alarmHours': 'alarmMinutes',
        'alarmMinutes': 'alarmMonth',
        'alarmMonth': 'alarmDayOfMonth',
        'alarmDayOfMonth': 'alarmHours'
      },
      'timer': {
        'timerHours': 'timerMinutes',
        'timerMinutes': 'timerSeconds',
        'timerSeconds': 'timerHours'
      }
    }
    const defaultInitialData = {
      'time': 'seconds',
      'alarm': 'alarmHours',
      'timer': 'timerHours'
    }
    if (!this.adjustData) {
      this.adjustData = defaultInitialData[this.mode]
    } else {
      this.adjustData = next[this.mode][this.adjustData]
    }
  }

  flashingAdjustData() {
    const flashingData = {
      'time': {
        'seconds': () => {
          this.seconds1El.classList.toggle('disable')
          this.seconds2El.classList.toggle('disable')
        },
        'hours': () => {
          if (this.format24hr) {
            if (this.hours1El.classList.contains('disable')) {
              this.hours1El.classList.remove('disable')
              this.hours2El.classList.remove('disable')
            } else {
              this.hours1El.classList.add('disable')
              this.hours2El.classList.add('disable')
            }
          } else {
            if (this.hours1El.innerText === '0') {
              this.hours1El.classList.add('disable')
              this.hours2El.classList.toggle('disable')
            } else {
              if (this.hours2El.classList.contains('disable')) {
                this.hours1El.classList.remove('disable')
                this.hours2El.classList.remove('disable')
              } else {
                this.hours1El.classList.add('disable')
                this.hours2El.classList.add('disable')
              }
            }
          }
        },
        'minutes': () => {
          this.minutes1El.classList.toggle('disable')
          this.minutes2El.classList.toggle('disable')
        },
        'year': () => {
          this.dayOfWeek1El.classList.toggle('disable')
          this.dayOfWeek2El.classList.toggle('disable')
        },
        'month': () => {
          if (this.month1El.innerText === '0') {
            this.month1El.classList.add('disable')
            this.month2El.classList.toggle('disable')
          } else {
            if (this.month2El.classList.contains('disable')) {
              this.month1El.classList.remove('disable')
              this.month2El.classList.remove('disable')
            } else {
              this.month1El.classList.add('disable')
              this.month2El.classList.add('disable')
            }
          }
        },
        'dayOfMonth': () => {
          if (this.dayOfMonth1El.innerText === '0') {
            this.dayOfMonth1El.classList.add('disable')
            this.dayOfMonth2El.classList.toggle('disable')
          } else {
            if (this.dayOfMonth2El.classList.contains('disable')) {
              this.dayOfMonth1El.classList.remove('disable')
              this.dayOfMonth2El.classList.remove('disable')
            } else {
              this.dayOfMonth1El.classList.add('disable')
              this.dayOfMonth2El.classList.add('disable')
            }
          }
        }
      },
      'alarm': {
        'alarmHours': () => {
          if (this.format24hr) {
            if (this.hours1El.classList.contains('disable')) {
              this.hours1El.classList.remove('disable')
              this.hours2El.classList.remove('disable')
            } else {
              this.hours1El.classList.add('disable')
              this.hours2El.classList.add('disable')
            }
          } else {
            if (this.hours1El.innerText === '0') {
              this.hours1El.classList.add('disable')
              this.hours2El.classList.toggle('disable')
            } else {
              if (this.hours2El.classList.contains('disable')) {
                this.hours1El.classList.remove('disable')
                this.hours2El.classList.remove('disable')
              } else {
                this.hours1El.classList.add('disable')
                this.hours2El.classList.add('disable')
              }
            }
          }
        },
        'alarmMinutes': () => {
          this.minutes1El.classList.toggle('disable')
          this.minutes2El.classList.toggle('disable')
        },
        'alarmMonth': () => {
          if (this.month1El.innerText === '-'
            || this.month1El.innerText === '0'
          ) {
            this.month1El.classList.add('disable')
            this.month2El.classList.toggle('disable')
          } else {
            if (this.month2El.classList.contains('disable')) {
              this.month1El.classList.remove('disable')
              this.month2El.classList.remove('disable')
            } else {
              this.month1El.classList.add('disable')
              this.month2El.classList.add('disable')
            }
          }
        },
        'alarmDayOfMonth': () => {
          if (this.dayOfMonth1El.innerText === '0') {
            this.dayOfMonth1El.classList.add('disable')
            this.dayOfMonth2El.classList.toggle('disable')
          } else {
            if (this.dayOfMonth2El.classList.contains('disable')) {
              this.dayOfMonth1El.classList.remove('disable')
              this.dayOfMonth2El.classList.remove('disable')
            } else {
              this.dayOfMonth1El.classList.add('disable')
              this.dayOfMonth2El.classList.add('disable')
            }
          }
        }
      },
      'timer': {
        'timerHours': () => {
          if (this.hours1El.classList.contains('disable')) {
            this.hours1El.classList.remove('disable')
            this.hours2El.classList.remove('disable')
          } else {
            this.hours1El.classList.add('disable')
            this.hours2El.classList.add('disable')
          }
        },
        'timerMinutes': () => {
          this.minutes1El.classList.toggle('disable')
          this.minutes2El.classList.toggle('disable')
        },
        'timerSeconds': () => {
          this.seconds1El.classList.toggle('disable')
          this.seconds2El.classList.toggle('disable')
        }
      }
    }
    return setInterval(() => {
      flashingData[this.mode][this.adjustData]()
    }, 500)
  }


  adjust() {
    this.checkToStopAlarm()
    if (this.mode !== 'timer' && this.mode !== 'stopwatch') {
      if (this.adjusting) {
        this.adjusting = false
        clearInterval(this.idAdjusting)
        this.adjustData = null
        if (this.mode === 'time') {
          console.log('go');
          this.dayOfWeek = this.getDayOfWeek(
            this.year,
            this.month,
            this.dayOfMonth
          )
        }
        if (this.mode === 'timer') {
          this.timerSetHours = this.timerHours
          this.timerSetMinutes = this.timerMinutes
          this.timerSetSeconds = this.timerSeconds
        }
      } else {
        this.adjusting = true
        this.changeNextAdjust()
        this.idAdjusting = this.flashingAdjustData()
      }
    } else {
      if (this.mode === 'timer') {
        if (this.adjusting) {
          this.adjusting = false
          clearInterval(this.idAdjusting)
          this.adjustData = null
          if (this.mode === 'timer') {
            this.timerSetHours = this.timerHours
            this.timerSetMinutes = this.timerMinutes
            this.timerSetSeconds = this.timerSeconds
          }
        } else {
          if (!(this.timerActive)) {
            this.adjusting = true
            this.changeNextAdjust()
            this.idAdjusting = this.flashingAdjustData()
          } else {
            clearInterval(this.idTimer)
            this.idTimer = null
            this.timerActive = false
            this.timerPause = false
            this.timerHours = this.timerSetHours
            this.timerMinutes = this.timerSetMinutes
            this.timerSeconds = this.timerSetSeconds
          }
        }
      } else if (this.mode === 'stopwatch') {
        if (this.stopwatchActive) {
          if (this.stopwatchPause) {
            if (this.stopwatchSplit === null) {
              clearInterval(this.idStopwatch)
              this.idStopwatch === null
              this.stopwatchActive = false
              this.stopwatchPause = false
              this.stopwatchSplit = null
              this.stopwatchHours = 0
              this.stopwatchMinutes = 0
              this.stopwatchSeconds = 0
              this.stopwatchHundredthsOfSeconds = 0
            } else {
              if (this.stopwatchSplit === true) {
                if (this.stopwatchSplitHours === this.stopwatchHours
                  && this.stopwatchSplitMinutes === this.stopwatchMinutes
                  && this.stopwatchSplitSeconds === this.stopwatchSeconds
                  && this.stopwatchSplitHundredthsOfSeconds === this.stopwatchHundredthsOfSeconds
                ) {
                  clearInterval(this.idStopwatch)
                  this.idStopwatch === null
                  this.stopwatchActive = false
                  this.stopwatchPause = null
                  this.stopwatchSplit = null
                  this.stopwatchHours = 0
                  this.stopwatchMinutes = 0
                  this.stopwatchSeconds = 0
                  this.stopwatchHundredthsOfSeconds = 0
                } else {
                  this.stopwatchSplitHours = this.stopwatchHours
                  this.stopwatchSplitMinutes = this.stopwatchMinutes
                  this.stopwatchSplitSeconds = this.stopwatchSeconds
                  this.stopwatchSplitHundredthsOfSeconds = this.stopwatchHundredthsOfSeconds
                }
              }
            }
          } else {
            this.toggleSplitStopwatch()
          }
        }
      }
    }
    this.displayScreen()
  }

  toggleFlash() {
    if (this.flash) {
      this.flash = false
      this.flashEl.classList.add('disable')
    } else {
      this.flash = true
      this.flashEl.classList.remove('disable')
    }
  }

  toggleAlarms() {
    if (!this.alarm && !this.sig) {
      this.alarm = true
      this.sig = false
      this.alarmEl.classList.remove('disable')
      this.sigEl.classList.add('disable')
    } else if (this.alarm && !this.sig) {
      this.alarm = false
      this.sig = true
      this.alarmEl.classList.add('disable')
      this.sigEl.classList.remove('disable')
    } else if (!this.alarm && this.sig) {
      this.alarm = true
      this.sig = true
      this.alarmEl.classList.remove('disable')
      this.sigEl.classList.remove('disable')
    } else if (this.alarm && this.sig) {
      this.alarm = false
      this.sig = false
      this.alarmEl.classList.add('disable')
      this.sigEl.classList.add('disable')
    }
  }

  togglePauseTimer() {
    if (!this.timerPause) {
      this.timerPause = true
    } else {
      this.timerPause = false
    }
  }

  togglePauseStopwatch() {
    if (this.stopwatchPause === null) {
      this.stopwatchPause = true
    }
    if (!this.stopwatchPause) {
      this.stopwatchPause = true
    } else {
      this.stopwatchPause = false
    }
  }

  toggleSplitStopwatch() {
    if (this.stopwatchSplit === null) {
      this.stopwatchSplit = true
      this.stopwatchSplitHours = this.stopwatchHours
      this.stopwatchSplitMinutes = this.stopwatchMinutes
      this.stopwatchSplitSeconds = this.stopwatchSeconds
      this.stopwatchSplitHundredthsOfSeconds = this.stopwatchHundredthsOfSeconds
      return
    }
    if (!this.stopwatchSplit) {
      this.stopwatchSplit = true
      this.stopwatchSplitHours = this.stopwatchHours
      this.stopwatchSplitMinutes = this.stopwatchMinutes
      this.stopwatchSplitSeconds = this.stopwatchSeconds
      this.stopwatchSplitHundredthsOfSeconds = this.stopwatchHundredthsOfSeconds
    } else {
      this.stopwatchSplit = false
    }
  }

  start() {
    this.checkToStopAlarm()
    if (this.mode !== 'stopwatch') {
      if (this.adjusting) {
        const adjust = {
          'time': {
            'seconds': () => {
              if (this.seconds >= 30) ++this.minutes
              if (this.minutes > 59) this.minutes = 0
              this.seconds = 0
            },
            'hours': () => {
              ++this.hours
              if (this.hours > 23) {
                this.hours = 0
              }
              this.displayScreen()
              if (!this.format24hr) {
                if (this.hours1El.innerText === '1') {
                  if (this.hours2El.classList.contains('disable')) {
                    this.hours1El.classList.add('disable')
                  } else {
                    this.hours1El.classList.remove('disable')
                  }
                } else {
                  this.hours1El.classList.add('disable')
                }
              }
            },
            'minutes': () => {
              ++this.minutes
              if (this.minutes > 59) this.minutes = 0
            },
            'year': () => {
              ++this.year
              if (this.year > 2099) this.year = 2000
            },
            'month': () => {
              ++this.month
              if (this.month > 9) {
                if (this.month2El.classList.contains('disable')) {
                  this.month1El.classList.add('disable')
                } else {
                  this.month1El.classList.remove('disable')
                }
              }
              if (this.month > 12) {
                this.month = 1
                this.month1El.classList.add('disable')
              }
            },
            'dayOfMonth': () => {
              ++this.dayOfMonth
              if (this.dayOfMonth > 9) {
                if (this.dayOfMonth2El.classList.contains('disable')) {
                  this.dayOfMonth1El.classList.add('disable')
                } else {
                  this.dayOfMonth1El.classList.remove('disable')
                }
              }
              if (this.dayOfMonth > this.getMaxDaysOnMonth(
                this.month,
                this.year
              )) {
                this.dayOfMonth = 1
                this.dayOfMonth1El.classList.add('disable')
              }
            }
          },
          'alarm': {
            'alarmHours': () => {
              ++this.alarmHours
              if (this.alarmHours > 23) {
                this.alarmHours = 0
              }
              this.displayScreen()
              if (!this.format24hr) {
                if (this.hours1El.innerText === '1') {
                  if (this.hours2El.classList.contains('disable')) {
                    this.hours1El.classList.add('disable')
                  } else {
                    this.hours1El.classList.remove('disable')
                  }
                } else {
                  this.hours1El.classList.add('disable')
                }
              }
            },
            'alarmMinutes': () => {
              ++this.alarmMinutes
              if (this.alarmMinutes > 59) this.alarmMinutes = 0
            },
            'alarmMonth': () => {
              if (this.alarmMonth === null) {
                this.alarmMonth = 1
                this.dayOfMonth1El.classList.add('disable')
              } else {
                ++this.alarmMonth
              }
              if (this.alarmMonth > 9) {
                if (this.month2El.classList.contains('disable')) {
                  this.month1El.classList.add('disable')
                } else {
                  this.month1El.classList.remove('disable')
                }
              }
              if (this.alarmMonth > 12) {
                this.alarmMonth = null
                this.month1El.classList.add('disable')
              }
            },
            'alarmDayOfMonth': () => {
              if (this.alarmDayOfMonth === null) {
                this.alarmDayOfMonth = 1
                this.dayOfMonth1El.classList.add('disable')
              } else {
                ++this.alarmDayOfMonth
              }
              if (this.alarmDayOfMonth > 9) {
                if (this.dayOfMonth2El.classList.contains('disable')) {
                  this.dayOfMonth1El.classList.add('disable')
                } else {
                  this.dayOfMonth1El.classList.remove('disable')
                }
              }
              if (this.alarmDayOfMonth > this.getMaxDaysOnMonth(
                this.alarmMonth || 1,
                this.year
              )) {
                this.alarmDayOfMonth = null
              }
            }
          },
          'timer': {
            'timerHours': () => {
              ++this.timerHours
              if (this.timerHours > 23) this.timerHours = 0
            },
            'timerMinutes': () => {
              ++this.timerMinutes
              if (this.timerMinutes > 59) this.timerMinutes = 0
            },
            'timerSeconds': () => {
              ++this.timerSeconds
              if (this.timerSeconds > 59) this.timerSeconds = 0
            }
          }
        }
        adjust[this.mode][this.adjustData]()
        this.displayScreen()
      } else {
        if (this.mode === 'time') {
          this.toggleFlash()
        } else if (this.mode === 'alarm') {
          this.toggleAlarms()
        } else if (this.mode === 'timer') {
          if (!this.timerActive) {
            this.idTimer = setInterval(() => {
              this.updateTimer()
            }, 1000)
            this.timerActive = true
          } else {
            this.togglePauseTimer()
          }
        }
      }
    } else {
      if (!this.stopwatchActive) {
        this.idStopwatch = setInterval(() => {
          this.updateStopwatch()
        }, 10)
        this.stopwatchActive = true
        this.stopwatchSplit = null
        this.stopwatchPause = false
      } else {
        if (this.stopwatchPause && this.stopwatchSplit === true) return
        this.togglePauseStopwatch()
      }
    }
  }

  changeMode() {
    const modes = {
      'time': 'alarm',
      'alarm': 'timer',
      'timer': 'stopwatch',
      'stopwatch': 'time'
    }
    this.mode = modes[this.mode]
  }

  cmode() {
    this.checkToStopAlarm()
    if (this.adjusting) {
      this.changeNextAdjust()
      this.displayScreen()
    } else {
      this.changeMode()
      this.displayScreen()
    }
  }

  turnOnLight() {
    this.backgroundEl.classList.add('lightOn')
    setTimeout(() => {
      this.backgroundEl.classList.remove('lightOn')
    }, 3000)
  }

  toggleFormat24hr() {
    if (this.format24hr) {
      this.format24hr = false
      this.displayScreen()
      if (this.hours1El.innerText === '0') {
        this.hours1El.classList.add('disable')
      }
    } else {
      this.format24hr = true
      this.displayScreen()
      if (this.hours1El.innerText === '0') {
        if (this.hours2El.classList.contains('disable')) {
          this.hours1El.classList.add('disable')
        } else {
          this.hours1El.classList.remove('disable')
        }
      }
    }
  }

  toggleAuto() {
    if (this.auto) {
      this.auto = false
      this.autoEl.classList.add('disable')
    } else {
      this.auto = true
      this.autoEl.classList.remove('disable')
    }
  }

  reset() {
    this.checkToStopAlarm()
    if (this.adjusting) {
      if (this.mode === 'time') {
        this.toggleFormat24hr()
      } else if (this.mode === 'timer') {
        this.toggleAuto()
      }
    } else {
      if (this.mode === 'time') {
        this.turnOnLight()
      }
    }
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
