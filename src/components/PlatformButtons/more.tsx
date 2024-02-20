import {
  Delete,
  List as ListIcon,
  MoreVert,
  Settings,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { PlatformInfo } from "../../typings/platform";
import React, { useMemo, useState } from "react";
import { useUser } from "../../stores/useUser";
import { MenuItemType } from "../../typings/utils";
import { fetcher } from "../../utils/fetcher";
import { enqueueSnackbar } from "notistack";
import { mutate } from "swr";
import { useNavigate } from "react-router";
import { PlatformSettingModal } from "../modals/PlatformSettingModal";
import { useConfirm } from "material-ui-confirm";

interface Props {
  platform?: PlatformInfo;
}

export const PlatformMoreButton: React.FC<Props> = ({ platform }) => {
  const { user } = useUser();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [platformSettingModalVisible, setPlatformSettingModalVisible] =
    useState(false);

  const handleDeletePlatform = async () => {
    if (!platform) {
      enqueueSnackbar("请等待信息加载完毕", {
        variant: "error",
      });
      return;
    }
    confirm({
      title: "确定删除？",
      content: "您确定要删除平台吗？该操作无法撤销，平台下的房间将一并删除",
      confirmationText: "确定",
      cancellationText: "取消",
    }).then(async () => {
      const result = await fetcher("/platform/delete/".concat(platform.id), {
        method: "delete",
      });

      if (result.code === 200) {
        enqueueSnackbar("操作成功", {
          variant: "success",
        });
        mutate("/user");
        navigate("/");
      }
    });
  };

  const handlePlatformSetting = async () => {
    setPlatformSettingModalVisible(true);
  };

  const isOwner = useMemo(
    () => platform?.owner?.id === user?.id,
    [platform, user]
  );

  const OWNER_MENU: MenuItemType[] = [
    {
      key: "invite-list",
      label: "邀请列表",
      icon: <ListIcon fontSize="small" />,
      disabled: true,
    },
    {
      key: "settings",
      label: "设置信息",
      icon: <Settings fontSize="small" />,
      onClick: () => {
        handlePlatformSetting();
        handleClose();
      },
    },
    {
      key: "delete",
      label: "删除平台",
      icon: <Delete fontSize="small" />,
      onClick: () => {
        handleDeletePlatform();
        handleClose();
      },
    },
  ];

  const USER_MENU: MenuItemType[] = [
    {
      key: "quit",
      label: "退出平台",
      icon: <Delete fontSize="small" />,
    },
  ];
  return isOwner ? (
    <>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {(isOwner ? OWNER_MENU : USER_MENU).map(
          ({ key, label, icon, onClick, disabled }) => (
            <MenuItem key={key} onClick={onClick} disabled={disabled}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              {label}
            </MenuItem>
          )
        )}
      </Menu>
      <PlatformSettingModal
        visible={platformSettingModalVisible}
        setVisible={setPlatformSettingModalVisible}
        platform={platform}
      />
    </>
  ) : (
    <></>
  );
};
