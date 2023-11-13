//importing css
import '../App.css';

//importing MUI cmp
import { Typography } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importing custom cmp
import theme from '../general_compo/theme.js';
import Order from './order.js';
import AccountContent from './accountContent.js';

//importing router
import { Navigate, useParams } from 'react-router-dom';

//importing images
import logo from '../general_compo/logo.png';
import cafe from "../general_compo/cafe.png";

//importing react cmp
import { useEffect, useState } from 'react';


function PendingOrders() {

    const [isLoaded, setIsLoaded] = useState(false)
    const [order, setOrder] = useState()

    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)

    const apiUrlAccount = "http://127.0.0.1:8000/get-account-details"
    const token = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        fetch(apiUrlAccount, {
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
                setAccountDetails(data)
                setGotAccountDetails(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])


    const apiUrl = "http://127.0.0.1:8000/get-pending-orders"

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
                setOrder(data.map((item) => (<Order key={item.id} id={item.id} name={item.order_cust_name} status={item.status} totalAmount={item.total_amount} items={item.items} completed={handleCompleted} />)))
                setIsLoaded(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    //state for drawer
    const [state, setState] = React.useState({
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
            {<AccountContent drawerButton={drawerButton} anchor={anchor} accountDetails={accountDetails} />}
        </Box>
    );

    const handleCompleted = (id) => {
        const userConfirm = window.confirm("Click OK to confirm!")
        if (userConfirm) {
            const apiCompleted = "http://127.0.0.1:8000/order-delivered"
            fetch(apiCompleted, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`
                },
                body: JSON.stringify({
                    "order_id": id
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
                    setOrder(data.map((item) => (<Order key={item.id} id={item.id} name={item.order_cust_name} status={item.status} totalAmount={item.total_amount} items={item.items} completed={handleCompleted} />)))
                    window.location.reload()
                })
                .catch(error => console.error('Error:', error));
        }
    }


    const id = useParams()
    console.log(id)

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {isLoaded && gotAccountDetails ?
                < div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    {/* first box */}
                    <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 0px' }}>
                        {/* padding box */}
                        <div style={{ width: '1191px' }}>
                            {/* header div / Navigation bar */}
                            <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '20px' }}>
                                <img src={logo} alt='website logo' style={{ marginRight: '100px', height: '80px' }} />
                                <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                    <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href={`/cownerHome/${id.id}`}>Home</Button>
                                    <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/feedback'>Feedback</Button>
                                    <Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/aboutus'>About Us</Button>
                                    <Button style={{ color: 'black', marginRight: '60px', marginTop: '10px', fontWeight: 'bold' }} href='/home/contact'>Contact</Button>
                                    <Button variant='contained' style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href={`/cownerHome/pendingOrders/${id.id}`}>Pending Orders</Button>
                                    <Button variant='contained' style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href={`/cownerHome/allOrders/${id.id}`}>All orders</Button>
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
                                </div>
                            </div>
                            {/* child box of padding box */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '70px' }}>
                                <Typography variant='h2'><u>Pending Orders</u></Typography>
                            </div>
                            {/* child box of padding box */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                {order}
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
                </div> : <div>loading</div>
            }

        </ThemeProvider >
    )
}

export default PendingOrders;