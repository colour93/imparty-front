import React from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../hooks/useUser";
import { getGreeting } from "../../utils";
import { Skeleton, Typography } from "@mui/material";
import { RoomCard } from "../../components/RoomCard";

export const OverviewPage: React.FC = () => {
  const { user, isLoading } = useUser();

  const toPlayRooms = (user?.rooms ?? []).filter(
    (r) => new Date(r.endAt).getTime() > Date.now()
  );

  return isLoading || !user ? (
    <div className="flex">
      <div className="flex-0 flex-col gap-1 mb-4 w-[220px] !hidden md:!flex">
        <Skeleton
          sx={{ height: 36, width: 180 }}
          animation="wave"
          variant="text"
        />
        <Skeleton
          sx={{ height: 36, width: 180 }}
          animation="wave"
          variant="text"
        />
        <Skeleton
          sx={{ height: 36, width: 180 }}
          animation="wave"
          variant="text"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1 mb-4">
        <Skeleton
          sx={{ height: 72, width: 200 }}
          animation="wave"
          variant="text"
        />
        <Skeleton
          sx={{ height: 48, width: 160 }}
          animation="wave"
          variant="text"
        />
      </div>
    </div>
  ) : (
    <>
      <Helmet>
        <title>首页 - Imparty</title>
      </Helmet>

      <div className="flex flex-col gap-1 mb-4">
        <Typography variant="h4" gutterBottom>
          {user && user.name && `${user.name}，`}
          {getGreeting()}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {toPlayRooms.length > 0
            ? `当前有 ${toPlayRooms.length} 个未结束的房间安排`
            : "还没有安排哦"}
        </Typography>
      </div>

      <div className="flex flex-wrap gap-4 [&>*]:flex-grow md:[&>*]:flex-grow-0">
        {toPlayRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
};
