//importing css
import '../App.css';

//importing MUI cmp

import { Typography, createTheme } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importing react cmp
import { useEffect, useState } from 'react';

//importing router
import { Navigate, useParams } from 'react-router-dom';

//importing photos
import logo from '../general_compo/logo.png'
import cafe from "../general_compo/cafe.png";

//importing JSON data
import menu_data from '../data_files/data.json';

//importing custom cmp
import MenuCard from './menu_card.js';
import CartContent from './cartContent.js';
import AccountContent from './accountContent.js';

//defining theme
const theme = createTheme({
    palette: {
        primary: { main: "#C31E2C" },
        secondary: green
    }
})

function Menu() {

    const id = useParams()

    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)
    const [cartDetails, setCartDetails] = useState()
    const [gotCartDetails, setGotCartDetails] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const apiUrlAcount = "http://127.0.0.1:8000/get-account-details"

    const token = JSON.parse(localStorage.getItem('token'))

    const [menu, setMenu] = useState()
    const [cartItems, setCartItems] = useState()
    const [data, setData] = useState()


    const apiUrl = `http://127.0.0.1:8000/get-menu/${parseInt(id.id)}`
    useEffect(() => {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                // Handle the response data here
                console.log(data);
                setData(data)
                setCartItems({ "order_id": -1, "canteen_id": parseInt(id.id), "order": data.map((item) => ({ "item_id": item.id, "quantity": 0 })), "total_amount": 0 })

            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        if (data && cartItems) {
            setMenu(data.map((item) => (<MenuCard key={item.id} id={item.id} name={item.name} price={item.price} addItem={handleAddItem} subItem={handleSubItem} cartItems={cartItems} />)))
            setIsLoaded(true)
        }
    }, [cartItems, data]);

    useEffect(() => {
        fetch(apiUrlAcount, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                setAccountDetails(data)
                setGotAccountDetails(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    const apiUrlCart = "http://127.0.0.1:8000/get-cust-orders"

    useEffect(() => {
        fetch(apiUrlCart, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                console.log(data)
                if(data.length===0)setCartDetails(data)
                else if (data[data.length-1].status!=="AddedToCart")setCartDetails([])
                else{ 
                    setCartDetails(data[data.length - 1])
                    if(cartItems&&cartItems.order_id===-1){
                        if(data[data.length-1].items[0].canteen===parseInt(id.id))setCartItems({ "order_id": data[data.length-1].id, "canteen_id": parseInt(id.id), "order":data[data.length-1].items.map((item)=>({"item_id":item.id,"quantity":item.quantity})), "total_amount": data[data.length-1].total_amount })
                    }
                }
                setGotCartDetails(true)
            })
            .catch(error => console.error('Error:', error));
    }, [cartItems])
    

    const handlePayment = () =>{
        const apiPayment = "http://127.0.0.1:8000/confirm-order"
        fetch(apiPayment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
            body: JSON.stringify({
                "order_id": cartItems.order_id
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                alert("Payment Successful")
                //setCartItems({ "order_id": -1, "canteen_id": parseInt(id.id), "order": data.map((item) => ({ "item_id": item.id, "quantity": 0 })), "total_amount": 0 })
                window.location.reload()
            })
            .catch(error => console.error('Error:', error));
    }

    const handleAddItem = (id) => {
        var tmp2 = 0
        const tmp = cartItems.order.map((item) => {
            if ((parseInt(item.item_id) === parseInt(id)) && item.quantity < 10) {
                tmp2 = data.filter((item1) => (item1.id === item.item_id))[0].price
                return ({ "item_id": item.item_id, "quantity": (parseInt(item.quantity) + 1) })
            }
            else {
                return item
            }
        })
        setCartItems((cartItems) => ({ ...cartItems, "order": tmp, "total_amount": cartItems.total_amount + tmp2 }))
    }

    const handleSubItem = (id) => {
        var tmp2 = 0
        const tmp = cartItems.order.map((item) => {
            if ((parseInt(item.item_id) === parseInt(id)) && item.quantity > 0) {
                tmp2 = data.filter((item1) => (item1.id === item.item_id))[0].price
                return { ...item, "quantity": parseInt(item.quantity) - 1 }
            }
            else {
                return item
            }
        })
        setCartItems((cartItems) => ({ ...cartItems, "order": tmp, "total_amount": cartItems.total_amount - tmp2 }))
    }



    //state for drawer
    const [state, setState] = React.useState({
        right: false,
        left: false
    });

    //function for toggling the drawer
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const closeButton = (anchor, status) => {
        setState({ ...state, [anchor]: status });
    }

    const drawerButton = (anchor, status) => {
        closeButton(anchor, status)
    }

    //list of all the items we need to display in the cart drawer
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
        //onClick={toggleDrawer(anchor, false)}
        //onKeyDown={toggleDrawer(anchor, false)}
        >
            {anchor === "right" ? <CartContent drawerButton={drawerButton} anchor={anchor} cartDetails={cartDetails} payment={handlePayment}/> : <AccountContent drawerButton={drawerButton} anchor={anchor} accountDetails={accountDetails} />}
        </Box>
    );

    const handleUpdateCart = () => {
        const useConfirmed = window.confirm("By updating your cart, your past cart will be cleared. Do you want to procced?")
        if (useConfirmed) {
        const apiUrl = "http://127.0.0.1:8000/create-order"
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
            body: JSON.stringify(cartItems),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                setCartItems((cartItems) => ({ ...cartItems, "order_id": data.order_id }))
                alert("Your cart is updated")
            })
            .catch(error => console.error('Error:', error));}
    }

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {gotAccountDetails && isLoaded && gotCartDetails ? <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', height: '732px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px', height: '632px' }}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '20px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '250px', height: '80px' }} />
                            <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home'>Home</Button>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/feedback'>Feedback</Button>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/aboutus'>About Us</Button>
                                <Button style={{ color: 'black', marginRight: '60px', marginTop: '10px', fontWeight: 'bold' }} href='/home/contact'>Contact</Button>

                                {/* drawer for cart */}
                                {['left'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <Button variant='contained' style={{ borderRadius: '30px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} onClick={toggleDrawer(anchor, true)}>Account</Button>
                                        <SwipeableDrawer
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                            PaperProps={{ style: { borderTopRightRadius: '30px', backgroundColor: '#DED8D8', padding: '20px', width: '480px' } }}
                                        >
                                            {list(anchor)}
                                        </SwipeableDrawer>
                                    </React.Fragment>
                                ))}
                                {['right'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <Button variant='contained' startIcon={<ShoppingCartIcon />} style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} onClick={toggleDrawer(anchor, true)}>{cartDetails.total_quantity}</Button>
                                        <SwipeableDrawer
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                            PaperProps={{ style: { borderTopLeftRadius: '30px', backgroundColor: '#DED8D8', padding: '20px', width: '480px' } }}
                                        >
                                            {list(anchor)}
                                        </SwipeableDrawer>
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                        {/* child box of padding box */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                            {menu}
                            <Button variant="contained" sx={{ borderRadius: "30px", marginTop: '20px' }} onClick={handleUpdateCart}>Update Cart</Button>
                        </div>
                    </div>
                </div>
                {/* footer */}
                <footer style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#C31E2C', width: '100%', marginTop: '70px', paddingTop: '10px' }}>
                    <div style={{ width: '500px', padding: '50px' }}>
                        <img src={cafe} alt='cafe' style={{ width: '200px' }} />
                        <Typography style={{ color: '#DAC6C7' }}>At Quick Cafe our core beliefs drive everything we do. We believe in the power of innovation to revolutionize the way people experience food and dining. We're passionate about harnessing technology to make dining experiences more convenient, efficient, and enjoyable for everyone.</Typography>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>Quick links</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Browse Foodtime</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Registrations</Typography>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>About</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>About us</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Mission</Typography>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>Contact</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Facebook</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Twitter</Typography>
                        <Typography style={{ color: '#DAC6C7', marginBottom: '20px' }}>Instagram</Typography>
                    </div>
                </footer>
            </div> : <div>loading</div>}

        </ThemeProvider>
    )
}

export default Menu;