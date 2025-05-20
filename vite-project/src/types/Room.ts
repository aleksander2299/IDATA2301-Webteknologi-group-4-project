import {Source} from "./Source.ts";

export type Room = {
    roomId: number;
    source: Source;
    roomName: string;
    description?: string;
    visibility: boolean;
    roomType: string;
    imageUrl: string;
};