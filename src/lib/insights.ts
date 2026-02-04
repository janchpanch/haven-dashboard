import data from "../data/dataset.json" with { type: "json" };

/* ----------------------------------------------------------- */
/*  Small “type” definitions    */

/* A single row in the `menu_items` array */
type MenuItem = {
    menu_item_id: string; // e.g. "m_101_01"
    venue_id: string; // which bar/restaurant it belongs to
    name: string; // human‑readable name, e.g. "Smoke & Citrus"
    type: string; // menu item type - human redable
    price_cents: number; // price in cents
};

/* A single line in an order – the part that tells us what was bought */
type OrderItem = {
    menu_item_id: string; // links back to MenuItem
    qty: number; // how many of this item were ordered
};

/* An order is a container that holds one or more OrderItems */
type Order = {
    order_id: string;
    items: OrderItem[];
};

/* Menu lookup lookup table – id → {name, venue_id}    */

/* Map<string, value> gives us O(1) look‑ups.  The key is the menu_item_id */
const menuLookup = new Map<
    string,
    { name: string; venue_id: string; type: string; price_cents: number }
>();

/* Populate that map by walking through every MenuItem in the JSON */
for (const mi of data.menu_items as MenuItem[]) {
    // store the name and venue for each id
    menuLookup.set(mi.menu_item_id, {
        name: mi.name,
        venue_id: mi.venue_id,
        type: mi.type,
        price_cents: mi.price_cents,
    });
}

/* Creating a lookup table for venue data*/
type VenueEntry = {
    venue_id: string;
    name: string;
    category: string;
}

const venueLookup = new Map<string, { name: string; category: string }>();

for (const v of data.venues as VenueEntry[]) {
    venueLookup.set(v.venue_id, {
        name: v.name,
        category: v.category
    });
}

/* Types that describe our *aggregated* sales results */

/* One aggregated “bucket” for a single menu item */
interface ItemSale {
    itemId: string; // the original menu_item_id
    name: string; // human‑readable name
    totalQty: number; // how many were sold in ALL venues
    /* perVenue maps venue_id → { qty, revenueCents } */
    totalRevenue: number;
    perVenue: Record<string, { qty: number; revenueCents: number }>;
}

/* A whole table – keyed by menu_item_id so we can look anything up instantly */
type SalesByItem = Record<string, ItemSale>;

/* The core helper – walk the orders and accumulate totals */
export function getMenuSales(): SalesByItem {
    /* Start with an empty object.  We’ll fill it in as we go. */
    const sales: SalesByItem = {};

    /* Outer loop – each order in the data set */
    for (const order of data.orders as Order[]) {
        /* Inner loop – every line item inside that order */
        for (const it of order.items) {
            /* Grab the menu_item_id from this line item. */
            const menu_item_id = it.menu_item_id;

            /* Use the lookup map to find the human‑readable name & venue. */
            const lookup = menuLookup.get(menu_item_id);

            if (!lookup) continue; // safety guard – should never hit

            /* Have we already created an ItemSale for this id? */
            let sale = sales[menu_item_id];
            if (!sale) {
                /* First time we see this item – create a brand new bucket. */
                sale = {
                    itemId: menu_item_id,
                    name: lookup.name,
                    totalQty: 0, // start at zero
                    totalRevenue: 0.0, // start at zero
                    perVenue: {}, // empty map for venue breakdowns
                };
                /* Store it back into the main table so future items can find it. */
                sales[menu_item_id] = sale;
            }

            /* ----------------------------------------------------------------- */
            /* 6️⃣  Aggregate the numbers for this line item                   */

            /* How much money did this line generate? (unit price × quantity) */
            const revenueCents = lookup.price_cents * it.qty;

            /* Add the quantity to the overall total for this menu item. */
            sale.totalQty += it.qty;

            /* Add to total revenue */
            sale.totalRevenue += revenueCents;

            /* ----------------------------------------------------------------- */

            /* 7️⃣  Update the per‑venue breakdown for this same item.         */
            let venueData = sale.perVenue[lookup.venue_id];
            if (!venueData) {
                /* First time we see this item at this venue – create a sub‑bucket. */
                venueData = { qty: 0, revenueCents: 0.0 };
                sale.perVenue[lookup.venue_id] = venueData;
            }
            /* Add the quantity and revenue to that venue’s bucket. */
            venueData.qty += it.qty;
            venueData.revenueCents += revenueCents;
        } // end inner loop over items
    } // end outer loop over orders

    /* Finally, return the fully‑filled table. */
    return sales; // key = menu_item_id → ItemSale
}

const menuSales = getMenuSales();

/* Example: show a table of items with total qty */
Object.values(menuSales).forEach((s) => {
    console.log(`${s.name}: ${s.totalQty} sold: $${s.totalRevenue / 100} earned`);
});

/* Or, break it down by venue */
// console.log(
//     "Smoke & Citrus at v_101:",
//     menuSales["m_101_01"]?.perVenue["v_101"],
// );

// console.log(menuLookup);
console.log(venueLookup);



//
//  What I came up with previously:
//

// Get the # of unique users (later advanced parsing for new and unique users)
function getUserQty(): number {
    let count: number = 0;
    for (const user in data.users) {
        count++;
    }
    return count;
}

// Get # of transactions
function getTransactionQty(): number {
    let count: number = 0;
    for (const t in data.transactions) {
        count++;
    }
    return count;
}

// Get total amount gained from receipts
function getReceiptTotals(): number {
    let total: number = 0;
    for (const r of data.receipts) {
        total += r.total_cents;
    }
    return total / 100;
}

// Get total from tips from receipts
function getReceiptTipTotals(): number {
    let total: number = 0;
    for (const r of data.receipts) {
        total += r.tip_cents;
    }
    return total / 100;
}
console.log(`${getUserQty()} unique users identified`);
console.log(`${getTransactionQty()} total transactions`);
console.log(`$${getReceiptTotals()} earned`);
console.log(`$${getReceiptTipTotals()} gained from tips`);
