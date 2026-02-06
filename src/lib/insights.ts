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
        venue_id: mi.venue_id,
        name: mi.name,
        type: mi.type,
        price_cents: mi.price_cents,
    });
}

export function getMenuLookup(id: string) {
    return menuLookup.get(id);
}

// Aggregate item sales - actual data
export interface ItemSale {
    itemId: string; // the original menu_item_id
    name: string; // human‑readable name
    type: string;
    qty_sold: number; // how many were sold in ALL venues
    /* perVenue maps venue_id → { qty, revenueCents } */
    item_rev_cents: number;
    venue_list: Record<string, { qty: number; revenueCents: number }>;
}

/* A whole table – keyed by menu_item_id so we can look anything up instantly */
type SalesByItem = Record<string, ItemSale>;

/* A single line in an order – the part that tells us what was bought */
type OrderItem = {
    menu_item_id: string; // links back to MenuItem
    qty: number; // how many of this item were ordered
};

/* An order is a container that holds one or more OrderItems */
type Order = {
    order_id: string;
    user_id: string;
    venue_id: string;
    items: OrderItem[];
};


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
                    type: lookup.type,
                    qty_sold: 0, // start at zero
                    item_rev_cents: 0.0, // start at zero
                    venue_list: {}, // empty map for venue breakdowns
                };
                /* Store it back into the main table so future items can find it. */
                sales[menu_item_id] = sale;
            }

            /* ----------------------------------------------------------------- */
            /* 6️⃣  Aggregate the numbers for this line item                   */

            /* How much money did this line generate? (unit price × quantity) */
            const revenueCents = lookup.price_cents * it.qty;

            /* Add the quantity to the overall total for this menu item. */
            sale.qty_sold += it.qty;

            /* Add to total revenue */
            sale.item_rev_cents += revenueCents;

            /* ----------------------------------------------------------------- */

            /* 7️⃣  Update the per‑venue breakdown for this same item.         */
            let venueData = sale.venue_list[lookup.venue_id];
            if (!venueData) {
                /* First time we see this item at this venue – create a sub‑bucket. */
                venueData = { qty: 0, revenueCents: 0.0 };
                sale.venue_list[lookup.venue_id] = venueData;
            }
            /* Add the quantity and revenue to that venue’s bucket. */
            venueData.qty += it.qty;
            venueData.revenueCents += revenueCents;
        } // end inner loop over items
    } // end outer loop over orders

    /* Finally, return the fully‑filled table. */
    return sales; // key = menu_item_id → ItemSale
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

export function getVenueByID(id: string) {
    return venueLookup.get(id);
}

export function getVenueTable() {
    return venueLookup;
}

console.log(getVenueTable());


// Aggregate venue sales
export interface VenueSale {
    venueId: string;
    name: string;
    category: string;
    qty_items_sold: number;          // all items sold here
    total_rev_cents: number; // in cents

    /* per‑item breakdown – reuse the same shape as ItemSale.perVenue */
    items_sold: Record<string, { qty: number; revenueCents: number }>;
}

type SalesByVenue = Record<string, VenueSale>;   // key = venue_id

export function getVenueSales(): SalesByVenue {
    const sales: SalesByVenue = {};

    /* Loop over every order exactly once */
    for (const order of data.orders as Order[]) {
        const venueId = order.venue_id;

        /* Grab the lookup info for this venue – we already built it */
        const venue = venueLookup.get(venueId);
        if (!venue) continue; // safety guard

        /* Create a new bucket for this venue if we haven’t seen it yet */
        let venue_sales = sales[venueId];
        if (!venue_sales) {
            venue_sales = {
                venueId,
                name: venue.name,
                category: venue.category,

                qty_items_sold: 0,
                total_rev_cents: 0,

                items_sold: {}, // itemId → {qty, revenueCents}
            };
            sales[venueId] = venue_sales;
        }

        /* Now walk the line items in this order */
        for (const it of order.items) {
            const menuRec = menuLookup.get(it.menu_item_id);
            if (!menuRec) continue; // safety guard

            const revenueCents = menuRec.price_cents * it.qty;

            /* Update venue‑wide totals */
            venue_sales.qty_items_sold += it.qty;
            venue_sales.total_rev_cents += revenueCents;

            /* And the per‑item breakdown for this venue */
            let itemData = venue_sales.items_sold[it.menu_item_id];
            if (!itemData) {
                itemData = { qty: 0, revenueCents: 0 };
                venue_sales.items_sold[it.menu_item_id] = itemData;
            }
            itemData.qty += it.qty;
            itemData.revenueCents += revenueCents;
        } // end inner items loop
    }   // end outer orders loop

    return sales; // key = venue_id → VenueSale
}


const userById = new Map(data.users.map(u => [u.user_id, u]));
const menuById = new Map(
    (data.menu_items as MenuItem[]).map(m => [m.menu_item_id, m])
);


const archetypeLookup = new Map(
    (data.archetypes).map(a => [
        a.archetype_id,
        { name: a.name, description: a.description }
    ])
);

/**
 * Utility that returns the display name for an archetype id.
 * Falls back to the id itself if nothing is found.
 */
export function getArchetypeName(id: string): string {
    return archetypeLookup.get(id)?.name ?? id;
}


export interface ArchetypeSale {
    archetype_id: string;
    archetype_name: string;
    qty_sold: number;        // total items sold by this archetype
    rev_cents: number;       // total revenue in cents
    items_sold: Record<
        string,
        { qty: number; revenueCents: number }
    >;                       // per‑menu_item breakdown
}


export function getSalesByArchetype(): Record<string, ArchetypeSale> {
    const agg = {} as Record<string, ArchetypeSale>;

    for (const order of data.orders as Order[]) {
        const user = userById.get(order.user_id);
        if (!user) continue;

        const archId = user.archetype_primary ?? 'unknown';

        // initialise bucket once – now include the human‑readable name
        if (!agg[archId]) {
            agg[archId] = {
                archetype_id: archId,
                archetype_name: getArchetypeName(archId),  // ← added line
                qty_sold: 0,
                rev_cents: 0,
                items_sold: {}
            };
        }

        for (const it of order.items) {
            const menuRec = menuById.get(it.menu_item_id);
            if (!menuRec) continue;

            const revenueCents = menuRec.price_cents * it.qty;
            agg[archId].qty_sold += it.qty;
            agg[archId].rev_cents += revenueCents;

            let itm = agg[archId].items_sold[it.menu_item_id];
            if (!itm) {
                itm = { qty: 0, revenueCents: 0 };
                agg[archId].items_sold[it.menu_item_id] = itm;
            }
            itm.qty += it.qty;
            itm.revenueCents += revenueCents;
        }
    }

    return agg; // key = archetype id → ArchetypeSale
}

// Get the # of unique users (later advanced parsing for new and unique users)
function getQtyUsers(): number {
    return Object.keys(data.users).length;
}

// Get # of transactions
function getTransactionQty(): number {
    return Object.keys(data.transactions).length;
}

function getTransactionTotal(): number {
    const totalCents = data.transactions.reduce(
        (sum, transaction) => sum + transaction.amount_cents, 0
    );
    return totalCents / 100;
}

function getReceiptQty(): number {
    return Object.keys(data.receipts).length;
}

// Get total amount gained from receipts
//      'reduce' is a function that seems to act like its own recursive caller
//      Given a base value, an accumulator, and a callback function
function getReceiptTotals(): number {
    const totalCents = data.receipts.reduce(
        (sum, receipt) => sum + receipt.total_cents, 0
    );
    return totalCents / 100;
}

// Get total from tips from receipts
function getReceiptTipTotals(): number {
    const totalCents = data.receipts.reduce(
        (sum, receipt) => sum + receipt.tip_cents, 0
    );
    return totalCents / 100;
}

// console.log(`${getQtyUsers()} unique users identified`);
// console.log(`${getTransactionQty()} total transactions`);
// console.log(`${getTransactionTotal()} earned`);
// console.log(`${getReceiptQty()} total receipts`);
// console.log(`$${getReceiptTotals()} earned`);
// console.log(`$${getReceiptTipTotals()} gained from tips`);

// const menuArray = Object.values(menuSales);
// console.log(menuArray);
// console.log(typeof(menuArray));
console.log(getSalesByArchetype());


