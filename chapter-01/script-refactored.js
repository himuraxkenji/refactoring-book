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
        const play = plays[perf.playID];
        let thisAmount = amountFor(perf, play);

        // Agregar créditos de volumen
        volumeCredits += Math.max(perf.audience - 30, 0);

        // Crédito adicional por cada 5 asistentes a comedias
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        // Agregar línea de detalle a la factura
        result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function amountFor(aPerf, play) {
    let result = 0;

    switch (play.type) {
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
            throw new Error(`unknown type: ${play.type}`);
    }

    return result;
}