function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf)        
        // Agregar línea de detalle a la factura
        result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function amountFor(aPerf) {
    let result = 0;

    switch (playFor(aPerf).type) {
        case "tragedy":
            result = 40000;
            if (aPerf.audience > 30) {
                result += 1000 * (aPerf.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerf.audience > 20) {
                result += 10000 + 500 * (aPerf.audience - 20);
            }
            result += 300 * aPerf.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(aPerf).type}`);
    }

    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance){
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result
}