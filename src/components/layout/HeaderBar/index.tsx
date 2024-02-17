import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Container,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useUser } from "../../../stores/useUser";
import { UserAvatar } from "../../UserAvatar";
import { fetcher } from "../../../utils/fetcher";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

export const HeaderBar: React.FC = () => {
  const userData = useUser();
  const { user, isLoading } = userData;
  const navigate = useNavigate();

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
      icon: <SettingsIcon fontSize="small" />,
    },
    {
      key: "logout",
      label: "登出",
      icon: <LogoutIcon fontSize="small" />,
      onClick: async () => {
        await fetcher("/auth/logout", {
          method: "post",
        });
        enqueueSnackbar("您已退出登录", {
          variant: "success",
        });
        navigate("/auth");
      },
    },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            aria-label="platform list drawer button"
            aria-controls="platform-list-drawer"
            aria-haspopup="true"
            color="inherit"
            className="flex-0 md:!hidden"
          >
            <MenuIcon />
          </IconButton>
          <div
            className="mx-4 flex flex-1 justify-center md:flex-0 md:justify-normal font-mono text-lg font-700 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <span>Imparty</span>
          </div>

          <div className="hidden md:flex flex-1"></div>

          <div className="flex items-center flex-0 gap-3">
            <span className="hidden md:flex cursor-default">
              {isLoading ? "加载中" : user?.name}
            </span>
            <Tooltip title="设置">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <UserAvatar user={user} />
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
              {USER_MENU.map(({ key, label, icon, onClick }) => (
                <MenuItem key={key} onClick={onClick}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
