import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { PlatformCreateModal } from "../../modals/PlatformCreateModal";
import { PlatformJoinModal } from "../../modals/PlatformJoinModal";
import { CheckCircle, Home } from "@mui/icons-material";
import { PlatformPcDrawer } from "./pc";
import { PlatformMobileDrawer } from "./mobile";

const PlatformDrawerContent: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();
  const { pid } = useParams();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const { user } = userData;

  if (!user) return <></>;
  return (
    <>
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
          <div className="m-4 flex justify-center">
            <span className="text-sm">空空如也</span>
          </div>
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
    </>
  );
};

export const PlatformDrawer: React.FC = () => {
  return (
    <>
      <PlatformPcDrawer className="!hidden md:!flex">
        <PlatformDrawerContent />
      </PlatformPcDrawer>
      <PlatformMobileDrawer className="md:!hidden">
        <PlatformDrawerContent />
      </PlatformMobileDrawer>
    </>
  );
};
