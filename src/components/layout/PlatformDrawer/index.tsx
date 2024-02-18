import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../../stores/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { PlatformCreateModal } from "../../modals/PlatformCreateModal";
import { PlatformJoinModal } from "../../modals/PlatformJoinModal";
import { CheckCircle, Home } from "@mui/icons-material";

export const PlatformDrawer: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();
  const { pid } = useParams();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const { user } = userData;

  if (!user) return <></>;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton
            onClick={() => {
              navigate("/");
            }}
          >
            <ListItem key="index" disablePadding>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={"首页"} />
            </ListItem>
          </ListItemButton>
        </List>
        <Divider />
        {user.platforms.length === 0 ? (
          <span className="m-4 text-center w-full text-sm">空空如也</span>
        ) : (
          <List>
            {user.platforms.map(({ id, name }) => (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/p/".concat(id));
                  }}
                >
                  <ListItemIcon>
                    {pid && pid === id && <CheckCircle />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      !name || name === "" ? "未命名 - ".concat(id) : name
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        <Divider />
        <div className="m-4 flex gap-2 justify-center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setJoinModalVisible(true)}
          >
            加入
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setCreateModalVisible(true)}
          >
            创建
          </Button>
        </div>
      </Box>

      <PlatformCreateModal
        visible={createModalVisible}
        setVisible={setCreateModalVisible}
      />

      <PlatformJoinModal
        visible={joinModalVisible}
        setVisible={setJoinModalVisible}
      />
    </Drawer>
  );
};
