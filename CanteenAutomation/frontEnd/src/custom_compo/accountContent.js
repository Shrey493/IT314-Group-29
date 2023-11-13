//importing MUI cmp
import { ThemeProvider } from "styled-components";
import { green } from '@mui/material/colors';
import { Button, Typography, createTheme } from '@mui/material/';
import  WestIcon  from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

function AccountContent(props) {
    const theme = createTheme({
        palette: {
            primary: { main: "#C31E2C" },
            secondary: green
        }
    })
    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', width: '460px'}}>
                    <Button variant='contained' sx={{ borderRadius: '30px' }} onClick={() => { props.drawerButton(props.anchor, false) }}><WestIcon /></Button>
                    <Typography variant='h5' sx={{ paddingLeft: '120px', fontWeight: 'bold' }}>Account</Typography>
                </div>
                {/* box to show items that customer wants to purchase */}
                <div style={{ border: '2px solid white', borderRadius: '30px', width: '415px', margin: '5px', marginTop: '40px', padding: '20px'}}>
                    <Typography variant="h3" sx={{padding:'30px'}}>{props.accountDetails.name}</Typography>
                    <Typography variant="h6">Email</Typography>
                    <Typography variant="h5" sx={{paddingBottom:'20px'}}>abc@gmail.com</Typography>
                    <Typography variant="h6">Phone Number</Typography>
                    <Typography variant="h5" sx={{paddingBottom:'20px'}}>{props.accountDetails.contact_number}</Typography>
                    <Typography variant="h6">Student ID</Typography>
                    <Typography variant="h5">xxx</Typography>
                </div>
                {/* box to show the final summary of the items  */}
                <div style={{ borderRadius: '30px', border: '2px solid white', width: '415px', marign: '5px', padding: '20px', marginTop: '80px' }}>
                    <Typography variant="h5">Edit Profile</Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant='contained' sx={{ borderRadius: '30px', margin: '40px 0px 5px 0px', width: '350px', padding: '10px' }} endIcon={<EastIcon />} onClick={()=>(props.signOut())}>Sign Out</Button>
                    </div>

                </div>
            </div>
        </ThemeProvider>
    )
}

export default AccountContent;