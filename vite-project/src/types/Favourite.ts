import {User} from "./User.ts";
import {Room} from "./Room.ts";

export type Favourite = {
    favouriteId: number;
    room: Room;
    user: User;
}