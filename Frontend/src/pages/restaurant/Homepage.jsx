import { useEffect, useState } from "react";
import HomepageMenuList from "../../components/HomepageMenuList";
import RestaurantHeader from "../../components/RestaurantHeader";

const Menu = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/restaurant')
            .then(res => res.json())
            .then(itemsJSON => {
                setItems(itemsJSON.data);
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <>
            <RestaurantHeader />
            <HomepageMenuList menuItems={items} />
        </>
    );
}

export default Menu;