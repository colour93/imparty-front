import React from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../stores/useUser";
import { getGreeting } from "../../utils";
import { Grid, Typography } from "@mui/material";
import { RoomCard } from "../../components/RoomCard";

export const OverviewPage: React.FC = () => {
  const { user } = useUser();

  const toPlayRooms = (user?.rooms ?? []).filter(
    (r) => new Date(r.endAt).getTime() > Date.now()
  );

  return (
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

      <Grid container spacing={2}>
        {toPlayRooms.map((room) => (
          <Grid key={room.id} item xs={6} md={4} lg={3} xl={2}>
            <RoomCard key={room.id} room={room} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
