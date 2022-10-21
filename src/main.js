import "./css/index.css"
// Imask para colocar marcara em campos
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#FF9900", "#FF0B0B"],
    american: ["#436D99", "#436D99"],
    default: ["transparent", "transparent"],
    nubank: ["gray", "purple"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType

// Código de segurança
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Data Validade
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// número do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    //console.log(foundMask)
    return foundMask

    /* Pode ser usado assim também é a mesma coisa só que mais simplificado
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) =>
      number.match(regex)
    )
    */
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  //console.log("Botão clicado com sucesso!")
  alert("Cartão adicionado!")
})

// Comando para fazer a página não recarregar ao clicar no botão
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

// Popula o nome do titular
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  //console.log(ccHolder.innerHTML = cardHolder.value.length)
  //if ternário para verificar se foi digitado algum valor, se digitado pega valor digitaro caso contrario aparece "FULANO DA SILVA"
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

// Popula o CVC do cartão
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-extra .cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "1234" : code
}

// Popula o número do cartão
cardNumberMasked.on("accept", () => {
  console.log(cardNumberMasked)
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-info .cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// Popula a data de expiração
expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-extra .cc-expiration .value")
  ccExpiration.innerText =
    expirationDateMasked.value.length === 0
      ? "02/32"
      : expirationDateMasked.value
})
