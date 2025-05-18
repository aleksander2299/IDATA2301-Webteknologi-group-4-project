import {User} from "./User.ts";
import {RoomProvider} from "./RoomProvider.ts";

export type Booking = {
    bookingId: number;
    roomProvider: RoomProvider;
    user: User;
    checkInDate: string;
    checkOutDate: string;
}