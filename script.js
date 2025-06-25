'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2025-04-28T14:11:59.604Z',
    '2025-05-02T17:01:17.194Z',
    '2025-06-17T23:36:17.929Z',
    '2025-06-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2024-12-23T16:33:06.386Z',
    '2024-12-25T14:43:26.374Z',
    '2025-01-04T18:49:59.371Z',
    '2025-01-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2024-12-23T16:33:06.386Z',
    '2024-12-25T14:43:26.374Z',
    '2025-01-04T18:49:59.371Z',
    '2025-01-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2024-12-23T16:33:06.386Z',
    '2024-12-25T14:43:26.374Z',
    '2025-02-21T18:49:59.371Z',
    '2025-02-22T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//Date Formatting
const FormatMoveDate = function(dates, locale) {
  const passedDate = function(date1, date2) {
    return Math.trunc(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))
  }
 const passedDays = passedDate(dates, new Date())
  if(passedDays === 0) return 'Today'
  if(passedDays === 1) return 'yesterday'
  if(passedDays <= 7) return `${passedDays} ago`
  else return new Intl.DateTimeFormat(locale).format(dates)
}

//Price Formatting
const formatPrice = function(value, locale, cur) {
  return new Intl.NumberFormat(locale, {style: 'currency', currency: cur}).format(value)
}

//Displaying Price & Date
const displayMovements = function(acc1, sort = false) {
  containerMovements.innerHTML = ''
  const moveNdate = acc1.movements.map(function(move, key) {
    return {
      movePrice: move,
      moveDates: acc1.movementsDates[key]
    }
  })

  const moveSort = sort ? moveNdate.slice().sort(function(a, b) {return a.movePrice - b.movePrice}) : moveNdate

  moveSort.forEach(function(value, key) {
    console.log(value)
    const dates = new Date(value.moveDates)
    const moveDates = FormatMoveDate(dates, acc1.locale)
    const valuePrice = formatPrice(value.movePrice, acc1.locale, acc1.currency)

    const type = value.movePrice > 0 ? 'deposit' : 'withdrawal'
    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${key + 1} deposit</div>
           <div class="movements__date">${moveDates}</div>
          <div class="movements__value">${valuePrice}</div>
      </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  }) 

  //Balance
  acc1.balance = acc1.movements.reduce(function(acum, value) {
    return acum + value
  }, 0)
  labelBalance.textContent = formatPrice(acc1.balance, acc1.locale, acc1.currency)

  //INCOME
  const income = acc1.movements.filter(function(value) {
    return value > 0
  }).reduce(function(acum, value) {
    return acum + value
  }, 0)
  labelSumIn.textContent = formatPrice(income, acc1.locale, acc1.currency)

  //Out /Expenses 
  const out = acc1.movements.filter(function(value) {
    return value < 0
  }).reduce(function(acum, value) {
    return acum + value
  }, 0)
  labelSumOut.textContent =formatPrice( Math.abs(out), acc1.locale, acc1.currency)

  //interest
  const interest = acc1.movements.filter(function(value) {
    return value > 0
  }).map(function(value) {
    return value * acc1.interestRate / 100
  }).filter(function(value) {
    return value > 1
  }).reduce(function(acum, value) {
    return acum + value
  }, 0)
  labelSumInterest.textContent = formatPrice( interest, acc1.locale, acc1.currency)
}

// USERNAME
const createUserName = function(AllAccount) {
  AllAccount.forEach(function(acc) {
    return acc.username = acc.owner.toLowerCase().split(' ').map(function(value) {
      return value[0]
    }).join('')
  })
}
createUserName(accounts)

//TIMER
const setTimer = function() {
  let time = 120;
  const interval = setInterval(function() {
     const min = String(Math.trunc(time / 60)).padStart(2, 0)
     const sec = String(Math.trunc(time % 60)).padStart(2, 0)
     time = time - 1
     if(time < 0) {
       clearInterval(interval)
       labelWelcome.textContent = 'Login to get started again!!'
       containerApp.style.opacity = 0
      }
      labelTimer.textContent = `${min}:${sec}` 
  }, 1000)
  return interval
}

//btn login
let currentAccount, timer
btnLogin.addEventListener('click', function(e) {
  e.preventDefault()
  currentAccount = accounts.find(function(acc1) {
    return acc1.username === inputLoginUsername.value
  })

  if(currentAccount?.pin === +inputLoginPin.value) {
    //date
    const now = new Date()
    const option = {
      year: 'numeric',
      month: 'numeric',
      date: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, option).format(now)
    //setting & resetting Timer
    if(timer) clearInterval(timer)
    timer = setTimer()
    displayMovements(currentAccount)
    containerApp.style.opacity = 1
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]} 🚀`
    inputLoginUsername.value = inputLoginPin.value = ''
  }
})

//Transfer money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault() 
  const recieverAcc = accounts.find(function(acc2) {
    return acc2.username === inputTransferTo.value
  })
  const amount = +inputTransferAmount.value

  if(amount > 0 && recieverAcc && currentAccount.username !== recieverAcc.username && currentAccount.balance > amount) {
    currentAccount.movements.push(-amount)
    recieverAcc.movements.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString())
    recieverAcc.movementsDates.push(new Date().toISOString())
    displayMovements(currentAccount)
    inputTransferTo.value = inputTransferAmount.value = ''
    if(timer) clearInterval(timer)
      timer = setTimer()
  }
})

//Loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault() 
  const amount = +inputLoanAmount.value
  setTimeout(function() {
    if(amount > 0 && currentAccount.movements.some(function(value) {return value >= amount * 0.1})) {
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date().toISOString())
      displayMovements(currentAccount)
      inputLoanAmount.value = ''
      if(timer) clearInterval(timer)
        timer = setTimer()
    }
  }, 3000)
})

//Delete Account 
btnClose.addEventListener('click', function(e) {
  e.preventDefault()

  if(currentAccount.pin === +inputClosePin.value) {
    const index = accounts.findIndex(function(acc1) {
      return acc1.pin === +inputClosePin.value
    })
    accounts.splice(index, 1)
    containerApp.style.opacity = 0
    labelWelcome.textContent = `Login to get started...`
  }
})

//sort
let sort = false
btnSort.addEventListener('click', function() {
  displayMovements(currentAccount, !sort)
  sort = !sort
})






























