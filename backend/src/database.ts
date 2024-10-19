export const sqlite3 = require('sqlite3').verbose();


const Database = new sqlite3.Database('./db/winedrops.db', (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

export const getCustomerOrders = () => {
    /* - Get customer orders that are paid or diaspached 
       - Join values from customer_orders and wine_product by wine_product_id
       - Combine all quantity, total amount 
       - Group everything together
     */

    return new Promise((resolve, reject) => {
        Database.all('SELECT co.wine_product_id,SUM(co.quantity) AS total_quantity,SUM(co.total_amount) AS total_amount,wp.name,wp.price FROM customer_order AS co JOIN wine_product AS wp ON co.wine_product_id = wp.id WHERE co.status IN ("dispatched", "paid") GROUP BY co.wine_product_id;', [], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err)  
            } else {
                resolve(rows);
            }
        });
    });
}

export const processOrders = async () => {
    /*
    Fetch wine orders and remove prices from the names to combine all orders with the same name,
    create an additional total orders field for keeping count of all the same wine name orders 
     */
    try {
        const orders = await getCustomerOrders();
        const groupedOrders = {};

        orders.forEach(order => {
            const nameParts = order.name.split(' ');
            const newName = nameParts.slice(0, nameParts.length - 1).join(' ');

            if (!groupedOrders[newName]) {
                groupedOrders[newName] = {
                    wine_product_id: order.wine_product_id,
                    total_quantity: 0,
                    total_amount: 0,
                    total_orders: 0,
                    name: newName,
                    price: order.price
                };
            }

            groupedOrders[newName].total_quantity += order.total_quantity;
            groupedOrders[newName].total_amount += order.total_amount;
            groupedOrders[newName].total_orders += 1;
        });

        return Object.values(groupedOrders);
    } catch (error) {
        console.error("Error processing orders:", error);
        throw error;
    }
};


