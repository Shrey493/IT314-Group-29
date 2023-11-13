//importing css
import '../App.css';

//importing MUI cmp
import { Typography, createTheme } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EastIcon from '@mui/icons-material/East';

//importing router
//import { NavLink } from 'react-router-dom';

//importing photos
import logo from '../general_compo/logo.png'
import cafe from "../general_compo/cafe.png";
import error_404 from "../error_compo/error_404.png";

//defining theme
const theme = createTheme({
    palette: {
        primary: { main: "#C31E2C" },
        secondary: green
    }
})

function Error() {
    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', height: '732px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px', height: '632px' }}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '20px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '250px', height: '80px' }} />
                            <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '11px' }}>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '11px', fontWeight: 'bold' }} href='/home'>Home</Button>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '11px', fontWeight: 'bold' }} href='/home/feedback'>Feedback</Button>
                                <Button style={{ color: 'black', marginRight: '20px', marginTop: '11px', fontWeight: 'bold' }} href='/home/aboutus'>About Us</Button>
                                <Button style={{ color: 'black', marginRight: '60px', marginTop: '11px', fontWeight: 'bold' }} href='/home/contact'>Contact</Button>
                                <Button variant='contained' style={{ borderRadius: '30px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/account'>Account</Button>
                                <Button variant='contained' startIcon={<ShoppingCartIcon />} style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} href='/home/cart'>0</Button>
                            </div>
                        </div>
                        {/* child box of padding box */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', marginLeft: '100px' }}>
                            <div style={{ width: '450px' }}>
                                <Typography variant='h3'>Sorry, it looks like someone took a bite of this page!</Typography>
                                <Button variant='contained' endIcon={<EastIcon/>} style={{ borderRadius: '30px', marginTop: '60px', height: '50px' }}>Return to Home</Button>
                            </div>
                            <div style={{ marginLeft: '70px' }}>
                                <img src={error_404} alt='error_404' style={{ height: '300px' }} />
                            </div>
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
            </div>
        </ThemeProvider>
    )
}

export default Error;