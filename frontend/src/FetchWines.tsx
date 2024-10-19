import { useEffect } from "react";
import { useState } from "react";

export const FetchWines = () => {

    interface Wine{
        wine_product_id: number,
        total_quantity: number,
        total_amount: number,
        name: string,
        price: number
        total_orders: number,
    }

    const [wines, setWines] = useState<Wine[]>([]);
    const [sortCriteria, setSortCriteria] = useState('total_amount');
    const [activeButton, setActiveButton] = useState('total_amount');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/best_selling_wines')
        .then(response => response.json())
        .then(data => setWines(data))
        .catch(err => console.log(err))
    },[])

    const sortWines = (criteria: string) => {
        setSortCriteria(criteria);
        setActiveButton(criteria);
    };

    const sortedWines = [...wines].sort((a, b) => {
        if (sortCriteria === 'total_amount') {
            return b.total_amount - a.total_amount; 
        } else if (sortCriteria === 'total_quantity') {
            return b.total_quantity - a.total_quantity; 
        } else if (sortCriteria === 'total_orders') {
            return b.total_orders - a.total_orders; 
        }
        return 0;
    });

    const filteredWines = sortedWines.filter(wine =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRows = sortedWines.length;
    const top10PercentCount = Math.ceil(totalRows * 0.1);
    const bottom10PercentCount = Math.floor(totalRows * 0.1);

    return (
        <div>
        <h2>Best Selling Wine</h2>
        <button onClick={() => sortWines('total_amount')}
        style={{ backgroundColor: activeButton === 'total_amount' ? 'aquamarine' : 'white' }}>By revenue</button>
        <button onClick={() => sortWines('total_quantity')}
        style={{ backgroundColor: activeButton === 'total_quantity' ? 'aquamarine' : 'white' }}>By # bottles sold</button>
        <button onClick={() => sortWines('total_orders')}
        style={{ backgroundColor: activeButton === 'total_orders' ? 'aquamarine' : 'white' }}>By # orders</button>
        <form><input type="text" placeholder="search" onChange={(e) => setSearchTerm(e.target.value)}/></form>
        <table>
        <tbody>
                    {filteredWines.map((wine, index) => {
                        let rowStyle = {};
                        if (index < top10PercentCount) {
                            rowStyle = { color: 'green' };
                        } else if (index >= totalRows - bottom10PercentCount) {
                            rowStyle = { color: 'red' };
                        }
                        return (
                            <tr key={wine.wine_product_id} style={rowStyle}>
                                <td>{wine.name}</td>
                                <td>${wine.total_amount.toFixed(2)}</td>
                                <td>{wine.total_quantity}</td>
                                <td>{wine.total_orders}</td>
                            </tr>
                        );
                    })}
                </tbody>
        </table>
    </div>
    )
}