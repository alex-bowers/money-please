let budget,
    monthlyCosts,
    annualPaymentsThisMonth,
    annualPaymentsNextMonth

const WORKER_GET_URL = "https://api.alexbowers.co.uk/monthly-costs/get"
const WORKER_UPDATE_URL = "https://api.alexbowers.co.uk/monthly-costs/update"

const editableCostsWrapper = document.getElementsByClassName("editable-costs")[0]

// Average per month.
// Some items happen once a year, so the cost is divided by 12.
// Variables are based on average from the past 4 months.
fetch(WORKER_GET_URL)
    .then(response => response.json())
    .then((costs) => {
        if (costs.budget) {
            setAppData(costs)
        } else if (costs.message === "Key not found") {
            setInitialCosts()
        }
    })
    .catch((err) => showErrorOnPage(err))

const openEditCostsAction = document.getElementById("openEditCostsAction")
openEditCostsAction.addEventListener("click", function() {
    editableCostsWrapper.classList.add("show-editable-costs")
})

const updateCostsAction = document.getElementById("updateCostsAction")
updateCostsAction.addEventListener("click", function() {
    postCostsToWorker(
        JSON.parse(document.getElementById("editableCostsContent").innerText)
    )
    closeEditableCostsModal()
})

const cancelAction = document.getElementById("cancelAction")
cancelAction.addEventListener("click", function() {
    closeEditableCostsModal()
})

function addPaymentsToPage(payments, element) {
    const container = document.getElementById(element)

    const list = document.createElement("ul")
    list.className = "monthly-payment-list"
    payments.forEach((payment) => {
        let listItem = document.createElement("li")
        listItem.innerText = `${formatCamelCaseToWords(payment.name)} (${formatCamelCaseToWords(payment.type)}): ${formatMoney(payment.value * 12)}`
        list.appendChild(listItem)
    })
    container.appendChild(list)

    container.classList.add("show-payments")
}

function closeEditableCostsModal() {
    editableCostsWrapper.classList.remove("show-editable-costs")
}

function formatCamelCaseToWords(string) {
    const stringWithSpace = string.replace(/([A-Z])/g, " $1")
    return stringWithSpace.charAt(0).toUpperCase() + stringWithSpace.slice(1)
}

function formatMoney(cost) {
    return new Intl
        .NumberFormat("en-gb", { style: "currency", currency: "GBP" })
        .format(cost)
}

function postCostsToWorker(monthlyCosts) {
    fetch(WORKER_UPDATE_URL, {
        method: "POST",
        body: JSON.stringify(monthlyCosts)
    })
    .finally(() => setAppData(monthlyCosts))
}

async function setAppData(costs) {
    await setInitialAppData()
    await setBudget(costs.budget)
    setEditableCosts(costs)
    await storeMonthlyCosts(costs.set)
    await storeMonthlyCosts(costs.variable)

    showCostsOnPage()
    showAnnualPayments()
}

function setBudget(setBudget) {
    budget = setBudget
    document.getElementById("budget").innerText = formatMoney(setBudget)
}

function setEditableCosts(costs) {
    document.getElementById("editableCostsContent").innerText = JSON.stringify(costs, null, 2)
}

function setInitialAppData() {
    budget = 0
    monthlyCosts = 0
    annualPaymentsThisMonth = []
    annualPaymentsNextMonth = []

    document.querySelectorAll(".monthly-payment-list").forEach(list => list.remove())
}

function setInitialCosts() {
    fetch("./monthly-costs.json")
        .then(response => response.json())
        .then((monthlyCosts) => {
            postCostsToWorker(monthlyCosts)
        })
}

function showAnnualPayments() {
    if (annualPaymentsThisMonth.length > 1) {
        addPaymentsToPage(annualPaymentsThisMonth, "annualPaymentsThisMonth")
    }

    if (annualPaymentsNextMonth.length > 1) {
        addPaymentsToPage(annualPaymentsNextMonth, "annualPaymentsNextMonth")
    }
}

function showCostsOnPage() {
    document.getElementById("estimatedMonthly").innerText = formatMoney(monthlyCosts)
    document.getElementById("moneyRemaining").innerText = formatMoney(budget - monthlyCosts)
}

function showErrorOnPage(err) {
    document.getElementById("costHeadlines").innerText = err
}

function storeMonthlyCosts(category) {
    let currentMonth = new Date().getMonth() + 1
    category.forEach(type => {
        type.payments.forEach(payment => {
            monthlyCosts += payment.value
            payment.type = type.name
            if (payment.paymentMonth === currentMonth) {
                annualPaymentsThisMonth.push(payment)
            } else if (payment.paymentMonth === currentMonth + 1) {
                annualPaymentsNextMonth.push(payment)
            }
        })
    })
}
