// import React from "react";
// import { Tabs, Tab, Box, Typography, Paper, Fade } from "@mui/material";
import React, { useState } from "react";
import { Box, Button, Slide, Typography, Tabs, Tab, Paper, IconButton , Fade} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

    function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Fade in={value === index}>
            <Box p={3}>
                <Typography variant="body1">{children}</Typography>
            </Box>
            </Fade>
        )}
        </div>
    );
    }

    // Custom Styled Tabs
    const GradientTabs = styled(Tabs)({
    background: "linear-gradient(90deg, #ff8c00, #ff2e63, #6c63ff)",
    borderRadius: "10px",
    color: "#fff",
    padding: "5px",
    "& .MuiTab-root": {
        fontSize: "1rem",
        fontWeight: 500,
        color: "#fff",
        textTransform: "capitalize",
        margin: "0 10px",
        borderRadius: "20px",
        padding: "10px 20px",
        transition: "all 0.3s ease",
        "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
    },
    "& .Mui-selected": {
        backgroundColor: "#fff",
        color: "#ff2e63",
        fontWeight: "bold",
    },
    });

    // Custom Styled Tab Panel
    const StyledTabPanel = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: "12px",
    backgroundColor: "#f0f8ff",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.5s ease",
    }));

export default function SlidingTabs() {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(true); // To handle the visibility of the sliding component
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const closePanel = () => {
    setOpen(false);
     navigate(-1)}

  return (
    <Box>
      {/* Sliding Component */}
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Box sx={{ width: "100%", padding: "30px", }}>
      {/* Gradient Tabs */}
      {/* <IconButton onClick={closePanel} color="primary">
              <CloseIcon />
            </IconButton> */}
      <GradientTabs
        value={value}
        onChange={handleChange}
        aria-label="gradient tabs example"
        
      >
        <Tab label="Dashboard" />
        <Tab label="Profile" />
        <Tab label="Settings" />
      </GradientTabs>

      {/* Tab Panels */}
      <StyledTabPanel>
        <TabPanel value={value} index={0}>
          <Typography variant="h4" color="#1976d2" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to the dashboard! Here, you can view your statistics and
            recent activities.
            <handleFileUpload/>
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h4" color="#ff2e63" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1">
            This is your profile page. Update your personal details and
            preferences here.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h4" color="#6c63ff" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1">
            Customize your application settings and preferences here.
          </Typography>
        </TabPanel>
      </StyledTabPanel>
    </Box>

      </Slide>

      {/* Button to Reopen the Panel */}
      {!open && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          Open Panel
        </Button>
      )}
    </Box>
  );
}

