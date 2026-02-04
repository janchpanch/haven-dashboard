import data from '../data/dataset.json' with {type: "json"};

// Get # of unique users (assumes no duplicates)
function getUserQty(): number {
    let count: number = 0;
    for (const user in data.users) {
        count++;
    }
    return count
}

console.log(`${getUserQty()} unique users identified`);

// Get # of transactions
function getTransactionQty(): number {
    let count: number = 0;
    for (const t in data.transactions) {
        count++;
    }
    return count
}

console.log(`${getTransactionQty()} total transactions`);

// Get total amount gained from receipts
function getReceiptTotals(): number {
    let total: number = 0;
    for (const r of data.receipts) {
        total += r.total_cents;
    } 
    return total / 100;
}

console.log(`$${getReceiptTotals()} earned`);


// Get total from tips from receipts
function getReceiptTipTotals(): number {
    let total: number = 0;
    for (const r of data.receipts) {
        total += r.tip_cents;
    } 
    return total / 100;
}

console.log(`$${getReceiptTipTotals()} gained from tips`);


// TODO:
//   Create a lookup table for menu items
//   Store data in entries to catalogue and dislpay purchase quantities
//   Brainstorm further metrics that are helpful at-a-glance
// 
// 
// 
