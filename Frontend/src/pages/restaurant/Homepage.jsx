import { useEffect, useState } from "react";
import MenuList from "../components/MenuList";
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
            <MenuList menuItems={items} />
        </>
    );
}

export default Menu;