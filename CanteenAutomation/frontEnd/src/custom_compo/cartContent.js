//importing MUI cmp
import { ThemeProvider } from "styled-components";
import { green } from '@mui/material/colors';
import { Button, Typography, createTheme } from '@mui/material/';
import EastIcon from '@mui/icons-material/East';

function CartContent(props) {
    const theme = createTheme({
        palette: {
            primary: { main: "#C31E2C" },
            secondary: green
        }
    })

    var cartItems = []
    if (props.cartDetails.length !== 0) {
        cartItems = props.cartDetails.items.map((item) => {
            if (item.quantity !== 0) {
                return (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="h6">{item.quantity}</Typography>
                        <Typography variant="h6">{item.quantity * item.price}</Typography>
                    </div>
                )
            }
            else return([])
        })
        cartItems = cartItems.filter((item)=>(item.length!==0))
    }

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {props.cartDetails.length === 0 ||cartItems.length === 0? <div>Cart is empty</div> : <div>
                <div style={{ display: 'flex', alignItems: 'center', width: '460px' }}>
                    <Button variant='contained' sx={{ borderRadius: '30px' }} onClick={() => { props.drawerButton(props.anchor, false) }}><EastIcon /></Button>
                    <Typography variant='h5' sx={{ paddingLeft: '120px', fontWeight: 'bold' }}>Cart Content : {props.cartDetails.order_canteen_name}</Typography>
                </div>
                {/* box to show items that customer wants to purchase */}
                <div style={{ border: '2px solid white', borderRadius: '30px', width: '460px', margin: '5px', marginTop: '40px', padding: '5px' }}>
                    {cartItems}
                </div>
                {/* box to show the final summary of the items  */}
                <div style={{ borderRadius: '30px', border: '2px solid white', width: '460px', marign: '5px', padding: '10px', marginTop: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ margin: '20px', fontWeight: 'bold' }}>Order Summary</Typography>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Subtotal</Typography>
                        <Typography variant="h6">{props.cartDetails.total_amount}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Convenience fee</Typography>
                        <Typography variant="h6">20</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Tax</Typography>
                        <Typography variant="h6">20</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{props.cartDetails.total_amount + 40}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant='contained' sx={{ borderRadius: '30px', margin: '20px 0px 5px 0px', width: '300px', padding: '10px' }} endIcon={<EastIcon />} onClick={()=>(props.payment(props.cartDetails.id))}>Continue to Payment</Button>
                    </div>

                </div>
            </div>}

        </ThemeProvider>
    )
}

export default CartContent;