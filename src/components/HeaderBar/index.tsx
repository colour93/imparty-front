import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export const HeaderBar: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const USER_MENU = [
    {
      key: "setting",
      label: "设置",
    },
    {
      key: "logout",
      label: "登出",
    },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            aria-label="platform list drawer button"
            aria-controls="platform-list-drawer"
            aria-haspopup="true"
            color="inherit"
            className="flex-0"
          >
            <MenuIcon />
          </IconButton>
          <div className="mx-4 flex flex-1 justify-center md:flex-0 md:justify-normal font-mono text-lg font-700">
            <span>Imparty</span>
          </div>

          <div className="hidden md:flex flex-1"></div>

          <div className="flex-0">
            <Tooltip title="设置">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              className="mt-12"
            >
              {USER_MENU.map(({ key, label }) => (
                <MenuItem key={key}>{label}</MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
