import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./userSlice";

export default function CurrentInfoCard() {
    const user = useSelector(selectUser)

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Your ID: {user?.getId()}
                </Typography>
                {
                    user?.getRoomid() && <Typography variant="h5" component="div">
                        You are in room ID: {user?.getRoomid()}
                    </Typography>
                }
            </CardContent>
        </Card>
    );
}